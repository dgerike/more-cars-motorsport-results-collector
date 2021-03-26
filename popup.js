let sessionResults = null
let apiBaseUrl = 'https://more-cars.net'

let racingSeries = [{
    "name": "DTM Trophy",
    "more_cars_id": 222981,
    "source": "https://www.dtm.com/de/dtm-trophy/",
    "racing_series_indicator_title": "DTM Trophy",
    "selectors": [{
        "session_type": "race",
        "session_type_indicator": "div.results__content.view table:last-child thead th:nth-child(10)",
        "session_type_indicator_value": "Punkte",
        "table_selector": "div.results__content.view table:last-child",
        "row_selector": "tbody tr",
        "position": "td:nth-child(1)",
        "driver_name": "td:nth-child(4)",
        "driver_name_childnode": 1,
        "driver_first_name": "td:nth-child(4)",
        "team_name": "td:nth-child(4)",
        "team_name_childnode": 3,
        "race_time": "td:nth-child(7)",
        "fastest_lap": "td:nth-child(8)",
        "points": "td:nth-child(10)",
        "status": "td:nth-child(7)",
    }, {
        "session_type": "qualifying",
        "session_type_indicator": "div.results__content.view table:last-child thead th:nth-child(8)",
        "session_type_indicator_value": "int",
        "table_selector": "div.results__content.view table:last-child",
        "row_selector": "tbody tr",
        "position": "td:nth-child(1)",
        "driver_name": "td:nth-child(4)",
        "driver_name_childnode": 1,
        "driver_first_name": "td:nth-child(4)",
        "team_name": "td:nth-child(4)",
        "team_name_childnode": 3,
        "fastest_lap": "td:nth-child(7)",
    }, {
        "session_type": "practice",
        "session_type_indicator": "div.results__content.view table:last-child thead th:nth-child(9)",
        "session_type_indicator_value": "runden",
        "table_selector": "div.results__content.view table:last-child",
        "row_selector": "tbody tr",
        "position": "td:nth-child(1)",
        "driver_name": "td:nth-child(4)",
        "driver_name_childnode": 1,
        "driver_first_name": "td:nth-child(4)",
        "team_name": "td:nth-child(4)",
        "team_name_childnode": 3,
        "fastest_lap": "td:nth-child(7)",
        "laps": "td:nth-child(9)",
    }]
}, {
    "name": "DTM",
    "more_cars_id": 661,
    "source": "https://www.dtm.com/",
    "racing_series_indicator_title": "DTM",
    "selectors": [{
        "session_type": "race",
        "session_type_indicator": "div.results__content.view table:last-child thead th:nth-child(10)",
        "session_type_indicator_value": "Punkte",
        "table_selector": "div.results__content.view table:last-child",
        "row_selector": "tbody tr",
        "position": "td:nth-child(1)",
        "driver_name": "td:nth-child(4)",
        "driver_name_childnode": 1,
        "driver_first_name": "td:nth-child(4)",
        "team_name": "td:nth-child(4)",
        "team_name_childnode": 3,
        "race_time": "td:nth-child(7)",
        "fastest_lap": "td:nth-child(8)",
        "points": "td:nth-child(10)",
        "status": "td:nth-child(7)",
    }, {
        "session_type": "qualifying",
        "session_type_indicator": "div.results__content.view table:last-child thead th:nth-child(8)",
        "session_type_indicator_value": "int",
        "table_selector": "div.results__content.view table:last-child",
        "row_selector": "tbody tr",
        "position": "td:nth-child(1)",
        "driver_name": "td:nth-child(4)",
        "driver_name_childnode": 1,
        "driver_first_name": "td:nth-child(4)",
        "team_name": "td:nth-child(4)",
        "team_name_childnode": 3,
        "fastest_lap": "td:nth-child(7)",
    }, {
        "session_type": "practice",
        "session_type_indicator": "div.results__content.view table:last-child thead th:nth-child(9)",
        "session_type_indicator_value": "runden",
        "table_selector": "div.results__content.view table:last-child",
        "row_selector": "tbody tr",
        "position": "td:nth-child(1)",
        "driver_name": "td:nth-child(4)",
        "driver_name_childnode": 1,
        "driver_first_name": "td:nth-child(4)",
        "team_name": "td:nth-child(4)",
        "team_name_childnode": 3,
        "fastest_lap": "td:nth-child(7)",
        "laps": "td:nth-child(9)",
    }]
}, {
    "name": "Formula 1",
    "more_cars_id": 310,
    "source": "https://www.formula1.com/",
    "racing_series_indicator_title": "FORMULA 1",
    "selectors": [{
        "session_type": "race",
        "session_type_indicator": "table thead tr th:nth-child(8)",
        "session_type_indicator_value": "PTS",
        "table_selector": "table",
        "row_selector": "tbody tr",
        "position": "td:nth-child(2)",
        "start_number": "td:nth-child(3)",
        "driver_name": "td:nth-child(4) span:nth-child(2)",
        "driver_first_name": "td:nth-child(4) span:first-child",
        "team_name": "td:nth-child(5)",
        "race_time": "td:nth-child(7)",
        "race_time_suffix": "td:nth-child(7) .suffix",
        "points": "td:nth-child(8)",
        "status": "td:nth-child(7)",
        "laps": "td:nth-child(6)",
    }, {
        "session_type": "qualifying",
        "session_type_indicator": "table thead tr th:nth-child(9)",
        "session_type_indicator_value": "Laps",
        "table_selector": "table",
        "row_selector": "tbody tr",
        "position": "td:nth-child(2)",
        "start_number": "td:nth-child(3)",
        "driver_name": "td:nth-child(4) span:nth-child(2)",
        "driver_first_name": "td:nth-child(4) span:first-child",
        "team_name": "td:nth-child(5)",
        "fastest_lap": "td:nth-child(8)",
        "fastest_lap_fallback_1": "td:nth-child(7)",
        "fastest_lap_fallback_2": "td:nth-child(6)",
        "laps": "td:nth-child(9)",
    }, {
        "session_type": "practice",
        "session_type_indicator": "table thead tr th:nth-child(8)",
        "session_type_indicator_value": "Laps",
        "table_selector": "table",
        "row_selector": "tbody tr",
        "position": "td:nth-child(2)",
        "start_number": "td:nth-child(3)",
        "driver_name": "td:nth-child(4) span:nth-child(2)",
        "driver_first_name": "td:nth-child(4) span:first-child",
        "team_name": "td:nth-child(5)",
        "fastest_lap": "td:nth-child(6)",
        "laps": "td:nth-child(8)",
    }]
}, {
    "name": "Formula E",
    "more_cars_id": 18311,
    "source": "https://www.fiaformulae.com/",
    "racing_series_indicator_title": "Formula E",
    "selectors": [{
        "session_type": "race",
        "session_type_indicator": ".standings-intro__title",
        "session_type_indicator_value": "E-Prix",
        "table_selector": "table",
        "row_selector": "tbody tr.table__row",
        "skip_rows": 1,
        "position": "td:nth-child(2)",
        "start_number": "td:nth-child(3) .driver__number",
        "driver_name": "td:nth-child(3) .driver__lname .full",
        "driver_first_name": "td:nth-child(3) .driver__fname",
        "team_name": "td:nth-child(4) div span",
        "race_time": "td:nth-child(7) .stat__value",
        "fastest_lap": "td:nth-child(6) .stat__value",
        "points": "td:nth-child(8) .points",
        "status": "td:nth-child(7) .stat-indicator",
    }, {
        "session_type": "qualifying",
        "session_type_indicator": ".standings-intro__title",
        "session_type_indicator_value": "Qualification",
        "table_selector": "table",
        "row_selector": "tbody tr.table__row",
        "skip_rows": 1,
        "position": "td:nth-child(2)",
        "start_number": "td:nth-child(3) .driver__number",
        "driver_name": "td:nth-child(3) .driver__lname .full",
        "driver_first_name": "td:nth-child(3) .driver__fname",
        "team_name": "td:nth-child(4) div span",
        "fastest_lap": "td:nth-child(7) .stat__value",
    }, {
        "session_type": "practice",
        "session_type_indicator": ".standings-intro__title",
        "session_type_indicator_value": "Practice",
        "table_selector": "table",
        "row_selector": "tbody tr.table__row",
        "skip_rows": 1,
        "position": "td:nth-child(2)",
        "start_number": "td:nth-child(3) .driver__number",
        "driver_name": "td:nth-child(3) .driver__lname .full",
        "driver_first_name": "td:nth-child(3) .driver__fname",
        "team_name": "td:nth-child(4) div span",
        "fastest_lap": "td:nth-child(7) .stat__value",
    }]
}, {
    "name": "WTCR",
    "more_cars_id": 221292,
    "source": "https://fiaresultsandstatistics.motorsportstats.com/",
    "racing_series_indicator_title": "WTCR",
    "selectors": [{
        "session_type": "race",
        "session_type_indicator": "table tbody:first-of-type tr td:nth-child(11) div:not(:empty)",
        "table_selector": "table",
        "row_selector": "tbody",
        "position": "tr td:nth-child(1)",
        "start_number": "tr td:nth-child(2)",
        "driver_name": "tr td:nth-child(3)",
        "team_name": "tr td:nth-child(5)",
        "race_time": "tr td:nth-child(7)",
        "fastest_lap": "tr td:nth-child(11)",
        "status": "tr td:nth-child(1)",
        "laps": "tr td:nth-child(6)",
    }, {
        "session_type": "training|qualifying",
        "session_type_indicator": "table tbody:first-of-type tr td:nth-child(11) div:empty",
        "table_selector": "table",
        "row_selector": "tbody",
        "position": "tr td:nth-child(1)",
        "start_number": "tr td:nth-child(2)",
        "driver_name": "tr td:nth-child(3)",
        "team_name": "tr td:nth-child(5)",
        "fastest_lap": "tr td:nth-child(7)",
        "status": "tr td:nth-child(1)",
        "laps": "tr td:nth-child(6)",
    }]
}, {
    "name": "WEC",
    "more_cars_id": 136157,
    "source": "https://fiaresultsandstatistics.motorsportstats.com/",
    "racing_series_indicator_title": "World Endurance Championship",
    "selectors": [{
        "session_type": "race",
        "session_type_indicator": "table tbody:first-of-type tr td:nth-child(11) div:not(:empty)",
        "table_selector": "table",
        "row_selector": "tbody",
        "position": "tr td:nth-child(1)",
        "start_number": "tr td:nth-child(2)",
        "driver_name": "tr td:nth-child(4) a:nth-of-type(1)",
        "driver_name_2": "tr td:nth-child(4) a:nth-of-type(2)",
        "driver_name_3": "tr td:nth-child(4) a:nth-of-type(3)",
        "driver_name_4": "tr td:nth-child(4) a:nth-of-type(4)",
        "team_name": "tr td:nth-child(3)",
        "race_time": "tr td:nth-child(7)",
        "fastest_lap": "tr td:nth-child(11)",
        "status": "tr td:nth-child(1)",
        "laps": "tr td:nth-child(6)",
    }, {
        "session_type": "training|qualifying",
        "session_type_indicator": "table tbody:first-of-type tr td:nth-child(11) div:empty",
        "table_selector": "table",
        "row_selector": "tbody",
        "position": "tr td:nth-child(1)",
        "start_number": "tr td:nth-child(2)",
        "driver_name": "tr td:nth-child(3)",
        "team_name": "tr td:nth-child(5)",
        "fastest_lap": "tr td:nth-child(7)",
        "status": "tr td:nth-child(1)",
        "laps": "tr td:nth-child(6)",
    }]
}]

renderRacingSeriesList(racingSeries)

function isSupportedRacingSeries(url, title) {
    return racingSeries.some(series => {
        const urlIsAMatch = url.includes(series.source)
        const titleIsAMatch = title.includes(series.racing_series_indicator_title)

        return urlIsAMatch && titleIsAMatch
    })
}

function getRacingSeriesByUrl(url, title) {
    for (let i = 0; i < racingSeries.length; i++) {
        const urlIsAMatch = url.includes(racingSeries[i].source)
        const titleIsAMatch = title.includes(racingSeries[i].racing_series_indicator_title)
        if (urlIsAMatch && titleIsAMatch) {
            return racingSeries[i]
        }
    }
}

window.onload = function () {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        const currentUrl = tabs[0].url;
        const currentTitle = tabs[0].title;

        if (isSupportedRacingSeries(currentUrl, currentTitle)) {
            const currentRacingSeries = getRacingSeriesByUrl(currentUrl, currentTitle)

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
            ' #' + result.start_number +
            '<span class="badge badge-danger float-right">' + result.points + ' points' + '</span>' +
            '<span class="badge badge-info mr-1 float-right">' + result.status + '</span>' +
            ' <small>' + result.team_name + '</small>' +
            '</b>' +
            '<br>' +
            ' Laps: ' + result.laps +
            ' | Total time: ' + result.race_time +
            ' <span class="float-right">⏱️' + result.fastest_lap_time + '</span>' +
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
    let value = $(this).val();
    fetchRaceResultsFromMoreCars(value);
    $('#addResults').prop('disabled', false)
    $('#errorBox').addClass('d-none')
});

function fetchRaceResultsFromMoreCars(sessionId) {
    let endpoint = '/racing-event-sessions/' + sessionId + '/race-results';

    $.ajax({
        type: 'GET',
        url: apiBaseUrl + '/api/v1' + endpoint,
    }).done(function (response) {
        $('#raceResultCount').html(response.data.length);
    }).fail(function (response, status) {

    });
}

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
    $('#uploadProgress div').css('width', progress + '%')
    if (totalSteps === currentStep) {
        $('#uploadProgress div').text('Upload completed')
        $('#uploadProgress div').removeClass('progress-bar-animated')
    }
}

function isUploadDataValid(results) {
    if (!results || results.length === 0) {
        $('#errorBox').text('No race results found. Cannot proceed.')
        $('#errorBox').removeClass('d-none')
        $('#addResults').prop('disabled', true)

        return false
    }

    if (parseInt($('#raceResultCount').text()) > 0) {
        $('#errorBox').text('For this racing event session there are already race results attached. Cannot proceed.')
        $('#errorBox').removeClass('d-none')
        $('#addResults').prop('disabled', true)

        return false
    }

    $('#errorBox').addClass('d-none') // remove error messages
    $('#addResults').prop('disabled', false) // enable submit button

    return true
}

function addResults(results) {
    if (!isUploadDataValid(results)) {
        return false
    }

    $('#addResults').prop('disabled', true)
    $('#uploadProgress').removeClass('d-none')
    initializeProgressBar(results.length * 4)

    results.forEach(result => {
        uploadResult(result)
    })
}

function uploadResult(result) {
    let payloadResult = {
        "name": 'a',
        "position": result.position,
        "start_number": result.start_number,
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

                if (!payloadLapTime.lap_time) {
                    updateProgress(2)
                } else {
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
                }
            })
        })
    })
}