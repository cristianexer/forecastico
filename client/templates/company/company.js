/*****************************************************************************/
/* Company: Functions */
/*****************************************************************************/
const brain = require('brain.js');
var net = new brain.NeuralNetwork({
    activation: 'relu', // activation function
    hiddenLayers: [4],
    learningRate: 0.4 // global learning rate, useful when training using streams
});



function newsItem(title, content, date) {
    var created = '<div class="col-xs-12 news-item"><div class="col-xs-12 news-title">' + title + '</div><div class="col-xs-12 news-date">' + date + '</div><div class="col-xs-12 news-content">' + content + '</div></div>'

    $('.news-container').append(created);

    $('.news-box .news-item').on('click', function () {
        $('.news-item').removeClass('expand');
        $(this).toggleClass('expand');
       
    });
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
       
        
        var myLineChart = new Chart(ctx).Line(data, options);
        $('#closedPrices').removeClass('miniLoader');
    });

    Meteor.myFunctions.callQuandl(company, (data) => {
        let trainingData = Meteor.myFunctions.dataHandler(data);

        let date = Meteor.myFunctions.getDateNow();
        net.train(trainingData);//train the network

        let value = data[data.length - 1][1];

        let arr = { date: date, value: value };

        let prediction =  brain.likely(arr, net);

        var ctx = document.getElementById("prediction").getContext("2d");
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
        var chartData = {
            labels: [],
            datasets: []
        };

        chartData.labels = [data[data.length - 5][0], data[data.length - 4][0], data[data.length - 3][0], data[data.length - 2][0], data[data.length - 1][0]];
        chartData.datasets.push({
            label: "" + data[data.length - 2][1],
            fillColor: "rgba(220,220,220,0.1)",
            strokeColor: "orange",
            pointColor: "orange",
            pointStrokeColor: "orange",
            pointHighlightFill: "orange",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [data[data.length - 5][1], data[data.length - 4][1], data[data.length - 3][1], data[data.length - 2][1] ,prediction],
        });
       
        var myLineChart = new Chart(ctx).Line(chartData, options);
        $('#prediction').removeClass('miniLoader');
    });
  
	
});

Template.Company.onDestroyed(function () {
});
