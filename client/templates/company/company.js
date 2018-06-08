/*****************************************************************************/
/* Company: Functions */
/*****************************************************************************/
const brain = require('brain.js');
var net = new brain.NeuralNetwork({
    activation: 'relu', // activation function
    hiddenLayers: [2,3],
    learningRate: 0.4 // global learning rate, useful when training using streams
});



function newsItem(title, content, date) {
    var created = '<div class="col-xs-12 news-item"><div class="col-xs-12 news-title">' + title + '</div><div class="col-xs-12 news-date">' + date + '</div><div class="col-xs-12 news-content">' + content + '</div></div>'

    $('.news-container').append(created);

    
}
function placeIndicators(data) {
    //console.log(data);
    var indicator = function (name, value) {
        $('.indicators-box .' + name + ' .indicator').text(value);
    };
    indicator('open', data.open);
    indicator('clos', data.close);
    indicator('high', data.high);
    indicator('low', data.low);
    indicator('volume', data.latestVolume);
    indicator('marketCap',data.marketCap);
    indicator('previousClose', data.previousClose);
    indicator('delayedPrice', data.delayedPrice);
    indicator('sector', data.sector);
    indicator('latestTime', data.latestTime);


}


/*****************************************************************************/
/* Company: Event Handlers */
/*****************************************************************************/
Template.Company.events({
    'click .loadHighData':function(){
        //company not defined
        $('.loadDataRow').fadeOut();
        $('.highChart').addClass('prepare');
        Meteor.myFunctions.highCallIEX(this.company.symbol, function (response) {
            var ctx = document.getElementById("highChart").getContext("2d");
            var options = {
                responsive: false,
                scaleFontColor: "#fff",
                scaleFontSize: 10,

            };
            var data = {
                labels: [],
                datasets: []
            };

            Object.entries(response.data).forEach(function ([key, value]) {

                var temp = Meteor.myFunctions.formatDataForChart(value.timeseries);
                data.labels = temp.dates;
                data.datasets.push({
                    label: "" + value,
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
            $('.highChart').removeClass('miniLoader');
        });

    }
    
});

/*****************************************************************************/
/* Company: Helpers */
/*****************************************************************************/
Template.Company.helpers({
});

/*****************************************************************************/
/* Company: Lifecycle Hooks */
/*****************************************************************************/
Template.Company.onCreated(function () {
});

Template.Company.onRendered(function () {
   var company= this.data.company.symbol;

    Meteor.myFunctions.fullCallIEX(company, function (response) {
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
       
        Object.entries(response.data).forEach(function ([key, value]) {
          
            var temp = Meteor.myFunctions.formatDataForChart(value.timeseries);
            data.labels = temp.dates;
            data.datasets.push({
                label: "" + value,
                fillColor: "rgba(220,220,220,0.1)",
                strokeColor: "orange",
                pointColor: "orange",
                pointStrokeColor: "orange" ,
                pointHighlightFill: "orange",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: temp.closeds
            });
            placeIndicators(value.quote);
           
            value.news.map(function(result,key){
                if (result.summary.length > 25)
                newsItem(result.headline, result.summary, result.datetime);
            });
            
        });
        $('.news-box .news-item').on('click', function () {
            //$('.news-item').removeClass('expand');
            $(this).toggleClass('expand');

        });
        
        var myLineChart = new Chart(ctx).Line(data, options);
        $('.closedChart').removeClass('miniLoader');
    });

     Meteor.myFunctions.oneYearTimeseriesIEX(company, (rs) => {

        let timeseries = rs.data[company].timeseries;

        let trainingData = Meteor.myFunctions.iexDataHandler(timeseries);
        trainingData.splice(trainingData.length - 1);
        net.train(trainingData);//train the network

        let value = timeseries[timeseries.length - 3];
        // console.log(trainingData);
        let arr = Meteor.myFunctions.normalizeObject(Meteor.myFunctions.iexIdentifierObject(value), timeseries);

        let prediction = brain.likely(arr, net);
        // console.log(`We have entered ( ${Meteor.myFunctions.iexIdentifierObject(value).close} ) and we expect ( ${timeseries[timeseries.length - 2].close} ) result is ${prediction} `);
        var ctx = document.getElementById("prediction").getContext("2d");
        var options = {
            legend: {
                display: true,
                //position: 'left',
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

        chartData.labels = [ timeseries[timeseries.length - 3].date, timeseries[timeseries.length - 2].date, timeseries[timeseries.length - 1].date];
        chartData.datasets.push({
            label: "" + timeseries[timeseries.length - 2].close,
            fillColor: "rgba(220,220,220,0.1)",
            strokeColor: "orange",
            pointColor: "orange",
            pointStrokeColor: "orange",
            pointHighlightFill: "orange",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [ timeseries[timeseries.length - 3].close, timeseries[timeseries.length - 2].close, prediction],
        });
       
        var myLineChart = new Chart(ctx).Line(chartData, options);
        $('.predictionChart').removeClass('miniLoader');
    });
  

});

Template.Company.onDestroyed(function () {
});
