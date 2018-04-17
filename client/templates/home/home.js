
/*****************************************************************************/
/* Home: Functions */
/*****************************************************************************/


function newsItem(title, content, date) {
    var created = '<div class="col-xs-12"><div class="col-xs-12 news-item"><div class="col-xs-12 news-title">' + title + '</div><div class="col-xs-12 news-date">' + date + '</div><div class="col-xs-12 news-content">' + content + '</div></div></div>'
    
    $('.news-box-home').append(created);
    
    $('.news-box-home .news-item').on('click', function () {
        $('.news-item').removeClass('expand');
        $(this).toggleClass('expand');
    });
}

 
/*****************************************************************************/
/* Home: Event Handlers */
/*****************************************************************************/
Template.Home.events({
});

/*****************************************************************************/
/* Home: Helpers */
/*****************************************************************************/
Template.Home.helpers({
});

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/
Template.Home.onCreated(function () {
   
});

Template.Home.onRendered(function () {
    var companies = this.data.companies;
    var comps = Meteor.myFunctions.stringifyComps(companies);
    Meteor.myFunctions.timeseriesIEX(comps, function (response) {
       var ctx = document.getElementById("trend-chart").getContext("2d");
       var options = {
            legend: {
                display: true,
                position: 'left',
                labels: {
                    fontColor: "#fff",
                }},                     
           responsive: true,
           scaleFontColor: "#fff",
           scaleFontSize: 10,
       };
       var data = {
           labels: [],
           datasets: []
       };

            Object.entries(response.data).forEach(function ([key, value]){
                
                
                var temp = Meteor.myFunctions.formatDataForChart(value.timeseries);
                var color = Meteor.myFunctions.getRandomHexColor();
                
                data.labels = temp.dates;
                data.datasets.push({
                    label: ""+value,
                    fillColor: "rgba(220,220,220,0.1)",
                    strokeColor: "" + color,
                    pointColor: ""+color,
                    pointStrokeColor: "" + color,
                    pointHighlightFill: "" + color,
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: temp.closeds
                });
                //console.log(response.data.timeseries);
                if (value.news[0].summary.length > 25)
                newsItem(value.news[0].headline, value.news[0].summary, value.news[0].datetime);

            });
           // console.log(response.data);
        
                 var myLineChart = new Chart(ctx).Line(data, options);
       
    });

    
});

Template.Home.onDestroyed(function () {
});
