chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.message === "collect-results-data_REQUEST") {
            let driverFirstName = document.querySelector('div.results__content.view table tr:first-child td:nth-child(4)').childNodes[0].textContent;
            let driverLastName = document.querySelector('div.results__content.view table tr:first-child td:nth-child(4)').childNodes[1].textContent;

            chrome.runtime.sendMessage({
                "message": "collect-results-data_RESPONSE",
                "driver_name": driverFirstName + driverLastName,
            });
        }
    }
);
