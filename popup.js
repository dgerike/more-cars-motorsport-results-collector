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
                    let renderedList = renderList(response.results);
                    $('#resultsList').html(renderedList);
                }
            });
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
