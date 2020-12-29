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
        "position": position,
        "driver_name": driverFirstName + driverLastName,
        "team_name": teamName,
        "race_time": raceTime,
        "fastest_lap_time": fastestLap,
        "points": points,
    }
}

function extractAllResultsForTheSelectedSession() {
    const results = [];

    let resultsCount = document.querySelectorAll('div.results__content.view table:last-child tbody tr').length
    for (let i = 1; i <= resultsCount; i++) {
        results.push(extractResultsForPosition(i))
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
