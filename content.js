function detectSessionType(selectors) {
    for (let i = 0; i < selectors.length; i++) {
        let indicatorElement = document.querySelector(selectors[i].session_type_indicator)
        if (indicatorElement) {
            if (indicatorElement.textContent === selectors[i].session_type_indicator_value) {
                return i
            }
        }
    }

    return null
}

function extractDataPoint(baseSelector, fieldName, selectors) {
    if (!selectors[fieldName]) {
        return null
    }

    if (!document.querySelector(baseSelector + ' ' + selectors[fieldName])) {
        return null
    }

    let childNode = 0
    if (selectors[fieldName + '_childnode']) {
        childNode = selectors[fieldName + '_childnode']
    }

    if (!document.querySelector(baseSelector + ' ' + selectors[fieldName]).childNodes[childNode]) {
        return null
    }

    let datapoint = document
        .querySelector(baseSelector + ' ' + selectors[fieldName])
        .childNodes[childNode]
        .textContent
        .trim()

    if (selectors[fieldName + '_suffix']) {
        let suffixElement = document.querySelector(baseSelector + ' ' + selectors[fieldName + '_suffix'])
        if (suffixElement) {
            suffix = suffixElement.textContent
            datapoint = datapoint + suffix
        }
    }

    return datapoint
}

function extractResultsForPosition(pos, selectors) {
    let nthChild = pos
    if (selectors.skip_rows) {
        nthChild = 2 * (parseInt(selectors.skip_rows) + pos - 1) - 1
    }
    const baseSelector = selectors.table_selector + ' ' + selectors.row_selector + ':nth-child(' + nthChild + ')'

    let position = extractDataPoint(baseSelector, 'position', selectors) // e.g. "1", "17", "NC", "-"
    position = parseInt(position)
    if (!position) {
        position = pos
    }

    let startNumber = extractDataPoint(baseSelector, 'start_number', selectors)
    if (startNumber) {
        startNumber = startNumber.replace('#', '')
    }

    const driverName = extractDataPoint(baseSelector, 'driver_name', selectors)
    const driverFirstName = extractDataPoint(baseSelector, 'driver_first_name', selectors)
    const teamName = extractDataPoint(baseSelector, 'team_name', selectors)
    const raceTime = extractDataPoint(baseSelector, 'race_time', selectors)

    let fastestLap = extractDataPoint(baseSelector, 'fastest_lap', selectors)
    if (!fastestLap) {
        fastestLap = extractDataPoint(baseSelector, 'fastest_lap_fallback_1', selectors)
    }
    if (!fastestLap) {
        fastestLap = extractDataPoint(baseSelector, 'fastest_lap_fallback_2', selectors)
    }

    const laps = extractDataPoint(baseSelector, 'laps', selectors)
    const status = extractDataPoint(baseSelector, 'status', selectors)
    const points = extractDataPoint(baseSelector, 'points', selectors)

    return {
        "position": position ? position : parseInt(position),
        "start_number": startNumber,
        "driver_name": (driverFirstName + ' ' + driverName).trim(),
        "team_name": teamName,
        "race_time": raceTime,
        "fastest_lap_time": fastestLap,
        "laps": laps ? laps : parseInt(laps),
        "status": status,
        "points": points ? points : parseInt(points),
    }
}

function normalizeDuration(duration) {
    if (!duration) {
        return null
    }

    if (duration.match(/^[a-z ]+/i)) { // "DNF", "DSQ"
        return null
    }

    if (duration.match(/lap/i)) { // "+1 Lap", "3 laps"
        return null
    }

    if (duration.match(/\d+L/i)) { // "1L", "5L"
        return null
    }

    duration = duration.replace(' ', '') // "+ 10.199s"
    duration = duration.replace('+', '') // "+10.199s"
    duration = duration.replace('s', '') // "10.199s"

    if ((duration.match(/:/g) || []).length === 0) { // "53.027"
        duration = '0:0:' + duration
    } else if ((duration.match(/:/g) || []).length === 1) { // "1:05.095"
        duration = '0:' + duration
    }

    return duration
}

function convertRaceTime(raceTime, winnerRaceTime) {
    let normalizedRaceTime = normalizeDuration(raceTime)

    if (normalizedRaceTime && raceTime.match(/^\+/)) { // "+10.199", "+1:15.953"
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
    const results = []
    let sessionType = detectSessionType(selectors)

    let resultsCount = document.querySelectorAll(selectors[sessionType].table_selector + ' ' + selectors[sessionType].row_selector).length
    for (let i = 1; i <= resultsCount; i++) {
        let result = extractResultsForPosition(i, selectors[sessionType])

        if (result.race_time) {
            if (i === 1) {
                result.race_time = convertRaceTime(result.race_time)
            } else {
                result.race_time = convertRaceTime(result.race_time, results[0].race_time)
            }
        }

        if (result.fastest_lap_time) {
            result.fastest_lap_time = convertRaceTime(result.fastest_lap_time)
        }

        if (result.status) {
            result.status = convertStatus(result.status)
        }

        results.push(result)
    }

    return results
}

chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.message === "collect-results-data_REQUEST") {
            const results = extractAllResultsForTheSelectedSession(request.selectors)

            chrome.runtime.sendMessage({
                "message": "collect-results-data_RESPONSE",
                "results": results,
            })
        }
    }
);
