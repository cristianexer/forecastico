
/*****************************************************************************/
/* Home: Functions */
/*****************************************************************************/


function newsItem(title, content, date) {
    var created = '<div class="col-xs-12 col-md-4"><div class="col-xs-12 news-item"><div class="col-xs-12 news-title">' + title + '</div><div class="col-xs-12 news-date">' + date + '</div><div class="col-xs-12 news-content">' + content + '</div></div></div>'
    
    $('.news-box-home').append(created);

    
    
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
    'compLength': function () {
        return (this.companies.length < 1) ? false : true;

    }
});

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/
Template.Home.onCreated(function () {
   
});

Template.Home.onRendered(function () {
    

    var companies = this.data.companies; //get companies from controller var
    if(companies.length > 0){
    var comps = Meteor.myFunctions.stringifyComps(companies); //stringify the arr of companies for API call
    Meteor.myFunctions.timeseriesIEX(comps, function (response) { //call API
       var ctx = document.getElementById("trend-chart").getContext("2d"); //get chart Wrapper
       var options = {  //chart options                   
           responsive: true,
           scaleFontColor: "#333",
           scaleFontSize: 10, 
       };
       var data = { //chart data instance
           labels: [],
           datasets: []
       };

            Object.entries(response.data).forEach(function ([key, value]){ //loop key -> index , value - > item[key]
                
                var temp = Meteor.myFunctions.formatDataForChart(value.timeseries.slice(10)); //cut first 10 items from arr and pass to format function
                var color = Meteor.myFunctions.getRandomHexColor(); //get random color
                Meteor.myFunctions.legendItem('trendChartLegend',{color:color,name:value.quote.companyName}); //insert legend item
                data.labels = temp.dates; //set labels with dates
                data.datasets.push({ 
                    label: `${value.quote.companyName}`,
                    fillColor: "rgba(220,220,220,0.1)",
                    strokeColor: "" + color,
                    pointColor: ""+color,
                    pointStrokeColor: "" + color,
                    pointHighlightFill: "" + color,
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: temp.closeds
                });
                //console.log(response.data.timeseries);

                if (value.news[0].summary.length > 25) //if news content is bigger than 25 add to newsBox
                newsItem(value.news[0].headline, value.news[0].summary, value.news[0].datetime);

            });

            $('.news-box-home .news-item').on('click', function () {
                //$('.news-item').removeClass('expand');
                //console.log(this);
                $(this).toggleClass('expand');
            });
        
                 var myLineChart = new Chart(ctx).Line(data, options); //create chart
       
    });

}
    
});

Template.Home.onDestroyed(function () {
});
