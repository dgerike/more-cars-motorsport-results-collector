function detectSessionType() {
    return 'race' // TODO temporary restriction


    let pointsColumn = document.querySelector('div.results__content.view th:nth-child(10)')
    let lapsColumn = document.querySelector('div.results__content.view th:nth-child(9)')

    if (pointsColumn && pointsColumn.textContent === 'Punkte') {
        return 'race'
    }

    if (lapsColumn && lapsColumn.textContent === 'runden') {
        return 'practice'
    }

    return 'qualifying'
}

function extractDataPoint(baseSelector, fieldName, selectors) {
    if (!selectors[fieldName]) {
        return null
    }

    return document
        .querySelector(baseSelector + ' ' + selectors[fieldName])
        .childNodes[selectors[fieldName + '_childnode']].textContent.trim()
}

function extractResultsForPosition(pos, selectors) {
    let sessionType = detectSessionType()

    const baseSelector = selectors.table_selector + ' ' + selectors.row_selector + ':nth-child(' + pos + ')'

    let position = extractDataPoint(baseSelector, 'position', selectors) // e.g. "1", "17", "NC", "-"
    position = parseInt(position)
    if (!position) {
        position = pos
    }

    const driverName = extractDataPoint(baseSelector, 'driver_name', selectors)
    const driverFirstName = extractDataPoint(baseSelector, 'driver_first_name', selectors)
    const teamName = extractDataPoint(baseSelector, 'team_name', selectors)

    let raceTime = null
    let fastestLap = null
    let points = null
    let laps = null
    let status = null

    if (sessionType === 'race') {
        raceTime = extractDataPoint(baseSelector, 'race_time', selectors)
        fastestLap = extractDataPoint(baseSelector, 'fastest_lap', selectors)
        points = extractDataPoint(baseSelector, 'points', selectors)
        status = extractDataPoint(baseSelector, 'status', selectors)
    } else if (sessionType === 'practice') {
        fastestLap = document.querySelector(baseSelector + ' td:nth-child(7)').textContent;
        laps = document.querySelector(baseSelector + ' td:nth-child(9)').textContent;
    } else {
        fastestLap = document.querySelector(baseSelector + ' td:nth-child(7)').textContent;
    }

    return {
        "position": position,
        "driver_name": (driverFirstName + ' ' + driverName).trim(),
        "team_name": teamName,
        "race_time": raceTime,
        "fastest_lap_time": fastestLap,
        "laps": parseInt(laps),
        "status": status,
        "points": parseInt(points),
    }
}

function normalizeDuration(duration) {
    if (!duration) {
        return null
    }

    if (duration.match(/.*[a-zA-Z].*/g)) {
        return null
    }

    duration = duration.replace('+', '') // "+10.199"

    if ((duration.match(/:/g) || []).length === 0) { // "53.027"
        duration = '0:0:' + duration
    } else if ((duration.match(/:/g) || []).length === 1) { // "1:05.095"
        duration = '0:' + duration
    }

    return duration
}

function convertRaceTime(raceTime, winnerRaceTime) {
    let normalizedRaceTime = normalizeDuration(raceTime)

    if (raceTime.match(/\+/g)) { // "+10.199", "+1:15.953"
        normalizedRaceTime = moment.duration(winnerRaceTime).add(normalizedRaceTime)
    }

    return moment.duration(normalizedRaceTime).toISOString()
}

function convertStatus(status) {
    const possibleStatus = ['DNF', 'DNS', 'DNC', 'DSQ']

    if (possibleStatus.includes(status)) {
        return status
    }

    return 'Finished'
}

function extractAllResultsForTheSelectedSession(selectors) {
    const results = [];

    let resultsCount = document.querySelectorAll(selectors.table_selector + ' ' + selectors.row_selector).length
    for (let i = 1; i <= resultsCount; i++) {
        let result = extractResultsForPosition(i, selectors);

        if (result.race_time) {
            if (i === 1) {
                result.race_time = convertRaceTime(result.race_time);
            } else {
                result.race_time = convertRaceTime(result.race_time, results[0].race_time);
            }
        }

        if (result.fastest_lap_time) {
            result.fastest_lap_time = convertRaceTime(result.fastest_lap_time);
        }

        if (result.status) {
            result.status = convertStatus(result.status);
        }

        results.push(result)
    }

    return results;
}

chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.message === "collect-results-data_REQUEST") {
            const results = extractAllResultsForTheSelectedSession(request.selectors);

            chrome.runtime.sendMessage({
                "message": "collect-results-data_RESPONSE",
                "results": results,
            });
        }
    }
);
