function detectSessionType() {
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

function extractResultsForPosition(pos) {
    let sessionType = detectSessionType()

    const baseSelector = 'div.results__content.view table:last-child tr:nth-child(' + pos + ')';
    const position = document.querySelector(baseSelector + ' td:nth-child(1)').textContent;
    const driverFirstName = document.querySelector(baseSelector + ' td:nth-child(4)').childNodes[0].textContent;
    const driverLastName = document.querySelector(baseSelector + ' td:nth-child(4)').childNodes[1].textContent;
    const teamName = document.querySelector(baseSelector + ' td:nth-child(4)').childNodes[3].textContent;
    let raceTime = null
    let fastestLap = null
    let points = null

    if (sessionType === 'race') {
        raceTime = document.querySelector(baseSelector + ' td:nth-child(7)').textContent.trim();
        fastestLap = document.querySelector(baseSelector + ' td:nth-child(8)').textContent;
        points = document.querySelector(baseSelector + ' td:nth-child(10)').textContent;
    } else {
        fastestLap = document.querySelector(baseSelector + ' td:nth-child(7)').textContent;
    }

    return {
        "position": parseInt(position),
        "driver_name": driverFirstName + driverLastName,
        "team_name": teamName,
        "race_time": raceTime,
        "fastest_lap_time": fastestLap,
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

function extractAllResultsForTheSelectedSession() {
    const results = [];

    let resultsCount = document.querySelectorAll('div.results__content.view table:last-child tbody tr').length
    for (let i = 1; i <= resultsCount; i++) {
        let result = extractResultsForPosition(i);
        if (result.race_time) {
            if (i === 1) {
                result.race_time = convertRaceTime(result.race_time);
            } else {
                result.race_time = convertRaceTime(result.race_time, results[0].race_time);
            }
        }
        results.push(result)
    }

    return results;
}

chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.message === "collect-results-data_REQUEST") {
            const results = extractAllResultsForTheSelectedSession();

            chrome.runtime.sendMessage({
                "message": "collect-results-data_RESPONSE",
                "results": results,
            });
        }
    }
);
