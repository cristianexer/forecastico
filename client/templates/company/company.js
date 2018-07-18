/*****************************************************************************/
/* Company: Functions */
/*****************************************************************************/
const brain = require('brain.js');
let config = {
    activation: 'tanh', 
    hiddenLayers: [4], 
    iterations: 2000, 
    errorThresh: 0.0003, 
    log: false, 
    logPeriod: 100, 
    learningRate: 0.03, 
    timeout: Infinity 

}
var net = new brain.NeuralNetwork(config);



function newsItem(title, content, date) {
    let el = document.createElement('div');
    el.innerHTML = `<div class="col-xs-12 news-title">${title}</div><div class="col-xs-12 news-date">${date}</div><div class="col-xs-12 news-content">${content}</div>`;
    el.classList.add('col-xs-12');
    el.classList.add('news-item');
    el.addEventListener('click', (event) => {
        event.target.parentElement.classList.contains('expand') ? event.target.parentElement.classList.remove('expand') : event.target.parentElement.classList.add('expand');
    });
    document.getElementsByClassName('news-container')[0].appendChild(el);

}

function placeIndicators(data) {
    var indicator = function (name, value) {
        $(`.indicators-box .${name} .indicator`).text(value);
    };
    indicator('open', data.open);
    indicator('clos', data.close);
    indicator('high', data.high);
    indicator('low', data.low);
    indicator('volume', data.latestVolume);
    indicator('marketCap', data.marketCap);
    indicator('previousClose', data.previousClose);
    indicator('delayedPrice', data.delayedPrice);
    indicator('sector', data.sector);
    indicator('latestTime', data.latestTime);


}

function createCanvas(id, where) {
    let canvas = document.createElement('canvas');
    canvas.setAttribute('id', id);
    document.getElementById(where).appendChild(canvas);

}

function removeCanvas(id) {
    document.getElementById(id).remove();
}

/*****************************************************************************/
/* Company: Event Handlers */
/*****************************************************************************/
Template.Company.events({
    'click .chartSelector': function (event, template) {
        removeCanvas('chartContainer');
        createCanvas('chartContainer', 'canvasContainer');
        let dataAtribute = event.target.dataset.attribute;
        var ctx = document.getElementById("chartContainer").getContext("2d");
        Meteor.myFunctions.selectedRequest(this.company.symbol, dataAtribute, function (response) {

            var options = {
                responsive: true,
                scaleFontColor: "#fff",
                scaleFontSize: 9,

            };
            var data = {
                labels: [],
                datasets: []
            };

            Object.entries(response.data).forEach(function ([key, value]) {

                var temp = Meteor.myFunctions.formatDataForChart(value.timeseries);
                data.labels = temp.dates;
                data.datasets.push({
                    label: `${value}`,
                    fillColor: "rgba(220,220,220,0.1)",
                    strokeColor: "orange",
                    pointColor: "orange",
                    pointStrokeColor: "orange",
                    pointHighlightFill: "orange",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: temp.closeds
                });

            });


            var myLineChart = new Chart(ctx).Line(data, options);
        });

    },
    'click .chartSelectorVolume': function (event, template) {
        removeCanvas('volumeChart');
        createCanvas('volumeChart', 'canvasContainerVolume');
        let dataAtribute = event.target.dataset.attribute;
        var ctx = document.getElementById("volumeChart").getContext("2d");
        Meteor.myFunctions.selectedRequest(this.company.symbol, dataAtribute, function (response) {

            var options = {
                responsive: true,
                scaleFontColor: "#fff",
                scaleFontSize: 9,

            };
            var data = {
                labels: [],
                datasets: []
            };

            Object.entries(response.data).forEach(function ([key, value]) {

                var temp = Meteor.myFunctions.formatDataForVolumeChart(value.timeseries);
                data.labels = temp.dates;
                data.datasets.push({
                    label: `${value}`,
                    fillColor: "#154854",
                    strokeColor: "orange",
                    pointColor: "orange",
                    pointStrokeColor: "orange",
                    pointHighlightFill: "orange",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: temp.volume
                });

            });


            var myBarChart = new Chart(ctx).Bar(data, options);
        });

    }

});

/*****************************************************************************/
/* Company: Helpers */
/*****************************************************************************/
Template.Company.helpers({});

/*****************************************************************************/
/* Company: Lifecycle Hooks */
/*****************************************************************************/
Template.Company.onCreated(function () {});

Template.Company.onRendered(function () {
    var company = this.data.company.symbol;

    Meteor.myFunctions.requestAPI(company, 'fullCall', (response) => {
        var ctx = document.getElementById("closedPrices").getContext("2d");
        var options = {
            legend: {
                display: true,
                position: 'left',
                labels: {
                    fontColor: "#fff",
                }
            },
            responsive: true,
            scaleFontColor: "#fff",
            scaleFontSize: 10,

        };
        var data = {
            labels: [],
            datasets: []
        };

        Object.entries(response.data).forEach(([key, value]) => {

            var temp = Meteor.myFunctions.formatDataForChart(value.timeseries);
            data.labels = temp.dates;
            data.datasets.push({
                label: `${value}`,
                fillColor: "rgba(220,220,220,0.1)",
                strokeColor: "orange",
                pointColor: "orange",
                pointStrokeColor: "orange",
                pointHighlightFill: "orange",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: temp.closeds
            });
            placeIndicators(value.quote);

            value.news.map(function (result, key) {
                if (result.summary.length > 25)
                    newsItem(result.headline, result.summary, result.datetime);
            });

        });


        var myLineChart = new Chart(ctx).Line(data, options);
        $('.closedChart').removeClass('miniLoader');
    });

    Meteor.myFunctions.requestAPI(company, 'fullCall', (rs) => {

        let timeseries = rs.data[company].timeseries;

        let trainingData = Meteor.myFunctions.iexDataHandler(timeseries);
        trainingData.splice(trainingData.length - 1);
        net.train(trainingData);

        let value = timeseries[timeseries.length - 3];

        let arr = Meteor.myFunctions.normalizeObject(Meteor.myFunctions.iexIdentifierObject(value), timeseries);

        let prediction = brain.likely(arr, net);

        var ctx = document.getElementById("prediction").getContext("2d");
        var options = {
            legend: {
                display: true,
                labels: {
                    fontColor: "#fff",
                }
            },
            responsive: true,
            scaleFontColor: "#fff",
            scaleFontSize: 10,

        };
        var chartData = {
            labels: [],
            datasets: []
        };

        chartData.labels = [timeseries[timeseries.length - 3].date, timeseries[timeseries.length - 2].date, timeseries[timeseries.length - 1].date];
        chartData.datasets.push({
            fillColor: "rgba(220,220,220,0.1)",
            strokeColor: "orange",
            pointColor: "orange",
            pointStrokeColor: "orange",
            pointHighlightFill: "orange",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [timeseries[timeseries.length - 3].close, timeseries[timeseries.length - 2].close, prediction],
        });

        var myLineChart = new Chart(ctx).Line(chartData, options);
        $('.predictionChart').removeClass('miniLoader');
    });

    Meteor.myFunctions.selectedRequest(company, '1M', function (response) {
        var ctx = document.getElementById("chartContainer").getContext("2d");
        var ctxVolume = document.getElementById("volumeChart").getContext("2d");
        var options = {
            responsive: true,
            scaleFontColor: "#fff",
            scaleFontSize: 10,

        };
        var data = {
            labels: [],
            datasets: []
        };
        var dataVolume = {
            labels: [],
            datasets: []
        };

        Object.entries(response.data).forEach(function ([key, value]) {
            var volumeTemp = Meteor.myFunctions.formatDataForVolumeChart(value.timeseries);
            var temp = Meteor.myFunctions.formatDataForChart(value.timeseries);

            data.labels = temp.dates;
            dataVolume.labels = volumeTemp.dates;

            data.datasets.push({
                label: `${value}`,
                fillColor: "rgba(220,220,220,0.1)",
                strokeColor: "orange",
                pointColor: "orange",
                pointStrokeColor: "orange",
                pointHighlightFill: "orange",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: temp.closeds
            });

            dataVolume.datasets.push({
                label: `${value}`,
                fillColor: "#154854",
                strokeColor: "orange",
                pointColor: "orange",
                pointStrokeColor: "orange",
                pointHighlightFill: "orange",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: volumeTemp.volume
            });

        });


        var myLineChart = new Chart(ctx).Line(data, options);

        var myVolumeChart = new Chart(ctxVolume).Bar(dataVolume, options);

    });
});

Template.Company.onDestroyed(function () {});