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
                    let renderedList = renderList([
                        ['position', response.result.position],
                        ['driver_name', response.result.driver_name],
                        ['team_name', response.result.team_name],
                        ['race_time', response.result.race_time],
                        ['fastest_lap_time', response.result.fastest_lap_time],
                        ['points', response.result.points],
                    ]);
                    $('#resultsList').html(renderedList);
                }
            });
        }
    });
};

function renderList(items) {
    let html = '';

    items.forEach(item => {
        html +=
            '<li class="list-group-item">' +
            '<b>' + item[0] + '</b><br>' +
            '<small>' + item[1] + '</small>' +
            '</li>';
    });

    return html;
}
