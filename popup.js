let sessionResults = null
let apiBaseUrl = 'https://more-cars.net'

let racingSeries = [
    {
        "name": "DTM",
        "more_cars_id": 661,
        "source": "https://www.dtm.com/",
        "selectors": {
            "table_selector": "div.results__content.view table:last-child",
            "row_selector": "tbody tr",
            "position": "td:nth-child(1)",
            "position_childnode": 0,
            "driver_name": "td:nth-child(4)",
            "driver_name_childnode": 1,
            "driver_first_name": "td:nth-child(4)",
            "driver_first_name_childnode": 0,
            "team_name": "td:nth-child(4)",
            "team_name_childnode": 3,
            "race_time": "td:nth-child(7)",
            "race_time_childnode": 0,
            "fastest_lap": "td:nth-child(8)",
            "fastest_lap_childnode": 0,
            "points": "td:nth-child(10)",
            "points_childnode": 0,
            "status": "td:nth-child(7)",
            "status_childnode": 0
        }
    }, {
        "name": "Formula 1",
        "more_cars_id": 310,
        "source": "https://www.formula1.com/",
        "selectors": {
            "table_selector": "table",
            "row_selector": "tbody tr",
            "position": "td:nth-child(2)",
            "position_childnode": 0,
            "driver_name": "td:nth-child(4) span:nth-child(2)",
            "driver_name_childnode": 0,
            "driver_first_name": "td:nth-child(4) span:first-child",
            "driver_first_name_childnode": 0,
            "team_name": "td:nth-child(5)",
            "team_name_childnode": 0,
            "race_time": "td:nth-child(7)",
            "race_time_childnode": 0,
            "fastest_lap": null,
            "fastest_lap_childnode": 0,
            "points": "td:nth-child(8)",
            "points_childnode": 0,
            "status": "td:nth-child(7)",
            "status_childnode": 0
        }
    }
]

renderRacingSeriesList(racingSeries)

function isSupportedRacingSeries(currentUrl) {
    return racingSeries.some(series => {
        return currentUrl.includes(series.source)
    })
}

function getRacingSeriesByUrl(currentUrl) {
    for (let i = 0; i < racingSeries.length; i++) {
        if (currentUrl.includes(racingSeries[i].source)) return racingSeries[i]
    }
}

window.onload = function () {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        const currentUrl = tabs[0].url;

        if (isSupportedRacingSeries(currentUrl)) {
            const currentRacingSeries = getRacingSeriesByUrl(currentUrl)

            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                const activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, {
                    "message": "collect-results-data_REQUEST",
                    "selectors": currentRacingSeries.selectors
                });
            });

            chrome.runtime.onMessage.addListener(function (response, sender) {
                if (response.message === "collect-results-data_RESPONSE") {
                    sessionResults = response.results
                    let renderedList = renderList(response.results)
                    $('#resultsList').html(renderedList)
                }
            })
        }
    });
};

function renderList(results) {
    let html = '';

    results.forEach(result => {
        html +=
            '<li class="list-group-item">' +
            '<b>' + result.position +
            '. ' + result.driver_name +
            ' <small>' + result.team_name + '</small>' +
            '</b>' +
            '<span class="badge badge-danger float-right">' + result.points + ' points' + '</span>' +
            '<br>' +
            'Total time: ' + result.race_time +
            ' <small class="float-right">Fastest lap: ' + result.fastest_lap_time + '</small>' +
            '</li>';
    });

    return html;
}

function renderRacingSeriesList(seriesList) {
    seriesList.forEach(series => {
        let html =
            '<option value="' + series.more_cars_id + '">' +
            series.name +
            '</option>'

        $('#racingSeriesList').append(html)
    })
}

$('#racingSeriesList').change(function () {
    let value = $(this).val();
    fetchRacingEventsFromMoreCars(value);
});

function fetchRacingEventsFromMoreCars(racingSeriesId) {
    let endpoint = '/racing-series/' + racingSeriesId + '/racing-events';

    $.ajax({
        type: 'GET',
        url: apiBaseUrl + '/api/v1' + endpoint,
    }).done(function (response) {
        let renderedEventList = renderEventList(response.data)
        $('#racingEventList').html(renderedEventList);
    }).fail(function (response, status) {

    });
}

function renderEventList(events) {
    let html = '';

    html += '<option selected disabled>--- Select Racing Event ---</option>'
    events.forEach(event => {
        html +=
            '<option value="' + event.id + '">' +
            'Round ' + event.round +
            ': ' + event.name +
            ' (' + event.start_date +
            ' - ' + event.end_date +
            ')' +
            '</option>'
    });

    return html;
}

$('#racingEventList').change(function () {
    let value = $(this).val();
    fetchRacingEventSessionsFromMoreCars(value);
});

function fetchRacingEventSessionsFromMoreCars(eventId) {
    let endpoint = '/racing-events/' + eventId + '/racing-event-sessions';

    $.ajax({
        type: 'GET',
        url: apiBaseUrl + '/api/v1' + endpoint,
    }).done(function (response) {
        let renderedSessionList = renderSessionsList(response.data)
        $('#racingEventSessionsList').html(renderedSessionList);
    }).fail(function (response, status) {

    });
}

function renderSessionsList(sessions) {
    let html = '';

    html += '<option selected disabled>--- Select Session ---</option>'
    sessions.forEach(session => {
        html +=
            '<option value="' + session.id + '" data-start-date="' + session.start_date + '">' +
            session.name +
            ' - ' + session.duration + ' ' + session.duration_unit +
            ' (' + session.start_time + ')' +
            '</option>'
    });

    return html;
}

$('#racingEventSessionsList').change(function () {
    $('#addResults').prop('disabled', false);
});

let accessTokenInput = document.getElementById('accessTokenInput');
chrome.storage.local.get(['accessToken'], function (storage) {
    if (storage.accessToken) {
        accessTokenInput.value = storage.accessToken;
    }
});

let saveAccessTokenBtn = document.getElementById('saveAccessToken');
saveAccessTokenBtn.onclick = function () {
    let newAccessToken = document.getElementById('accessTokenInput').value;
    chrome.storage.local.set({'accessToken': newAccessToken});
};

let addResultsButton = document.getElementById('addResults');
addResultsButton.onclick = function () {
    addResults(sessionResults)
};

let totalSteps = 1
let stepSize = 1
let currentStep = 0
let progress = 0

function initializeProgressBar(stepCount) {
    totalSteps = stepCount
    stepSize = 100 / totalSteps
    currentStep = 0
    progress = 0
}

function updateProgress(steps) {
    currentStep = currentStep + steps
    progress = stepSize * currentStep
    $('#uploadProgress').css('width', progress + '%')
    if (totalSteps === currentStep) {
        $('#uploadProgress').text('Upload completed')
        $('#uploadProgress').removeClass('progress-bar-animated')
    }
}

function addResults(results) {
    initializeProgressBar(results.length * 4)

    results.forEach(result => {
        let payloadResult = {
            "name": 'a',
            "position": result.position,
            "driver_name": result.driver_name,
            "team_name": result.team_name,
            "race_time": result.race_time,
            "laps": result.laps,
            "status": result.status,
            "points": result.points,
        }

        let payloadLapTime = {
            "name": 'a',
            "lap_time": result.fastest_lap_time,
            "driver_name": result.driver_name,
            "date": $($('#racingEventSessionsList option:selected')[0]).data('start-date'),
        }

        let sessionId = $($('#racingEventSessionsList option:selected')[0]).val()

        chrome.storage.local.get(['accessToken'], function (storage) {
            let endpoint = 'race-results'
            let raceResultId = null
            $.ajax({ // post result
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                url: apiBaseUrl + '/api/v1/' + endpoint,
                headers: {
                    'access-token': storage.accessToken
                },
                data: JSON.stringify(payloadResult)
            }).done(function (createdRaceResult) { // connect result and session
                updateProgress(1)

                raceResultId = createdRaceResult.data.id
                let endpoint2 = 'race-results/' + raceResultId + '/racing-event-sessions/' + sessionId
                $.ajax({
                    type: 'POST',
                    url: apiBaseUrl + '/api/v1/' + endpoint2,
                    headers: {
                        'access-token': storage.accessToken
                    }
                }).done(function () { // post lap time
                    updateProgress(1)

                    let endpoint3 = 'lap-times'
                    $.ajax({
                        type: 'POST',
                        contentType: 'application/json; charset=utf-8',
                        url: apiBaseUrl + '/api/v1/' + endpoint3,
                        headers: {
                            'access-token': storage.accessToken
                        },
                        data: JSON.stringify(payloadLapTime)
                    }).done(function (createdLapTime) { // connect lap time and result
                        updateProgress(1)

                        let endpoint4 = 'lap-times/' + createdLapTime.data.id + '/race-results/' + raceResultId
                        $.ajax({
                            type: 'POST',
                            url: apiBaseUrl + '/api/v1/' + endpoint4,
                            headers: {
                                'access-token': storage.accessToken
                            }
                        }).done(function () {
                            updateProgress(1)
                        })
                    })
                })
            })
        })
    })
}