function extractResultsForPosition(pos) {
    const baseSelector = 'div.results__content.view table:last-child tr:nth-child(' + pos + ')';

    const position = document.querySelector(baseSelector + ' td:nth-child(1)').textContent;
    const driverFirstName = document.querySelector(baseSelector + ' td:nth-child(4)').childNodes[0].textContent;
    const driverLastName = document.querySelector(baseSelector + ' td:nth-child(4)').childNodes[1].textContent;
    const teamName = document.querySelector(baseSelector + ' td:nth-child(4)').childNodes[3].textContent;
    const raceTime = document.querySelector(baseSelector + ' td:nth-child(7)').textContent;
    const fastestLap = document.querySelector(baseSelector + ' td:nth-child(8)').textContent;
    const points = document.querySelector(baseSelector + ' td:nth-child(10)').textContent;

    return {
        "position": parseInt(position),
        "driver_name": driverFirstName + driverLastName,
        "team_name": teamName,
        "race_time": raceTime.trim(),
        "fastest_lap_time": fastestLap,
        "points": parseInt(points),
    }
}

function convertRaceTime(raceTime, winnerRaceTime) {
    if (raceTime.match(/.*[a-zA-Z].*/g)) { // "+2 Laps", "2L", "DNF"
        raceTime = null;
    } else if (raceTime.match(/\+/g)) { // "+10.199", "+1:15.953"
        raceTime = raceTime.replace('+', '');
        raceTime = moment.duration(raceTime, 's');
        raceTime = moment.duration(winnerRaceTime).add(raceTime).toISOString();
    } else if ((raceTime.match(/:/g) || []).length === 1) { // "57:49.271"
        raceTime = '0:' + raceTime;
        raceTime = moment.duration(raceTime).toISOString()
    } else if ((raceTime.match(/:/g) || []).length === 2) { // "1:13:27.930"
        raceTime = moment.duration(raceTime).toISOString()
    }

    return raceTime;
}

function extractAllResultsForTheSelectedSession() {
    const results = [];

    let resultsCount = document.querySelectorAll('div.results__content.view table:last-child tbody tr').length
    for (let i = 1; i <= resultsCount; i++) {
        let result = extractResultsForPosition(i);
        if (i === 1) {
            result.race_time = convertRaceTime(result.race_time);
        } else {
            result.race_time = convertRaceTime(result.race_time, results[0].race_time);
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
