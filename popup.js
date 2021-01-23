let sessionResults = null
let apiBaseUrl = 'https://more-cars.net'

window.onload = function () {
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, function (tabs) {
        const currentUrl = tabs[0].url;
        const url_pattern = 'dtm.com';

        if (currentUrl.includes(url_pattern)) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                const activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, {
                    "message": "collect-results-data_REQUEST",
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

function addResults(results) {
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
                raceResultId = createdRaceResult.data.id
                let endpoint2 = 'race-results/' + raceResultId + '/racing-event-sessions/' + sessionId
                $.ajax({
                    type: 'POST',
                    url: apiBaseUrl + '/api/v1/' + endpoint2,
                    headers: {
                        'access-token': storage.accessToken
                    }
                }).done(function () { // post lap time
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
                        let endpoint4 = 'lap-times/' + createdLapTime.data.id + '/race-results/' + raceResultId
                        $.ajax({
                            type: 'POST',
                            url: apiBaseUrl + '/api/v1/' + endpoint4,
                            headers: {
                                'access-token': storage.accessToken
                            }
                        })
                    })
                })
            })
        })
    })
}