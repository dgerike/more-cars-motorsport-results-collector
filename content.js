chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.message === "collect-results-data_REQUEST") {
            let position = document.querySelector('div.results__content.view table tr:first-child td:nth-child(1)').textContent;
            let driverFirstName = document.querySelector('div.results__content.view table tr:first-child td:nth-child(4)').childNodes[0].textContent;
            let driverLastName = document.querySelector('div.results__content.view table tr:first-child td:nth-child(4)').childNodes[1].textContent;
            let teamName = document.querySelector('div.results__content.view table tr:first-child td:nth-child(4)').childNodes[2].textContent;
            let raceTime = document.querySelector('div.results__content.view table tr:first-child td:nth-child(7)').textContent;
            let fastestLap = document.querySelector('div.results__content.view table tr:first-child td:nth-child(8)').textContent;
            let points = document.querySelector('div.results__content.view table tr:first-child td:nth-child(10)').textContent;

            chrome.runtime.sendMessage({
                "message": "collect-results-data_RESPONSE",
                "position": position,
                "driver_name": driverFirstName + driverLastName,
                "team_name": teamName,
                "race_time": raceTime,
                "fastest_lap_time": fastestLap,
                "points": points,
            });
        }
    }
);
