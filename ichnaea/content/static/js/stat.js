function make_graph(url, graph_id) {

    function suffixFormatter(val, axis) {
        if (val > 1000000)
            return (val / 1000000).toFixed(axis.tickDecimals) + " M";
        else if (val > 1000)
            return (val / 1000).toFixed(axis.tickDecimals) + " k";
        else
            return val.toFixed(axis.tickDecimals);
    }

    var graphWidth = 940;
    var graphHeight = 155;

    // adjust graph sizes to match responsive CSS rules
    var screenWidth = screen.width;
    if (screenWidth >= 760 && screenWidth < 1000) {
        graphWidth = 660;
    } else if (screenWidth < 760) {
        graphWidth = 260;
    }

    var placeholder = $(graph_id);

    placeholder.css("width", graphWidth + "px");
    placeholder.css("height", graphHeight + "px");

    $("<div id='chart_tooltip'></div>").css({
        position: "absolute",
        display: "none",
        border: "1px solid #ddf",
        padding: "2px",
        "background-color": "#eef",
        opacity: 0.80
    }).appendTo("body");

    placeholder.bind("plothover", function (event, pos, item) {
        if (item) {
            var x = item.datapoint[0],
                y = item.datapoint[1];

            $("#chart_tooltip").html(item.series.label + ": " + y)
                .css({top: item.pageY + 5, left: item.pageX + 5})
                .fadeIn(200);
        } else {
            $("#chart_tooltip").hide();
        }
    });

    var colors = ["rgb(0,150,221)", "rgb(184,216,233)", "rgb(240,136,30)"];

    var options = {
        grid: {
            hoverable: true,
            borderWidth: {top: 0, right: 0, bottom: 1, left: 1}
        },
        legend: { show: false, position: "nw" },
        series: {
            lines: {show: true, fill: false},
            points: {show: true}
        },
        xaxis: {mode: "time", timeformat: "%b %Y"},
        yaxis: {tickDecimals: 1, tickFormatter: suffixFormatter}
    };

    $.ajax({
        url: url,
        dataType: 'json'
    }).then(
        function(data, textStatus, jqXHR) {
            var series = [];
            for (var i=0; i < data.series.length; i++) {
                series.push({
                    label: data.series[i].title,
                    data: data.series[i].data,
                    color: colors[i]
                });
            }
            return series;
        }
    ).then(
        function(series) {
            var plot = $.plot(document.querySelector(graph_id + " .chart"),
                              series, options);
            return plot;
        }
    )
}

$(document).ready(function() {
    make_graph('/stats_blue.json', '#blue_chart');
    make_graph('/stats_cell.json', '#cell_chart');
    make_graph('/stats_wifi.json', '#wifi_chart');
});
