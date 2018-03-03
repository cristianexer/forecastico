
/*****************************************************************************/
/* Home: Functions */
/*****************************************************************************/
// async function getEOD(SYMBOL, EODHandler) {

//     var final = 'https://api.iextrading.com/1.0/stock/' + SYMBOL.toLowerCase() + '/time-series'; //End of the day api
   
//     await HTTP.get(final, {}, function (error, response) {
//         if (error) {
//             console.log(error);
//         } else {
//             //return response
//             EODHandler(response);
//         }
//     });

// }
// async function getNews(SYMBOL, Handler) {

//     var final = 'https://api.iextrading.com/1.0/stock/' + SYMBOL.toLowerCase() + '/batch?types=news&range=1m&last=1';

//     await HTTP.get(final, {}, function (error, response) {
//         if (error) {
//             console.log(error);
//         } else {
//             //return response
//             Handler(response);
//         }
//     });

// }
async function getData(SYMBOL, Handler) {

    var final = 'https://api.iextrading.com/1.0/stock/market/batch?symbols='+ SYMBOL +'&types=news,timeseries&range=1m&last=1';

    await HTTP.get(final, {}, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            //return response
            Handler(response);
        }
    });

}
function newsItem(title, content, date) {
    var created = '<div class="col-xs-12"><div class="col-xs-12 news-item"><div class="col-xs-12 news-title">' + title + '</div><div class="col-xs-12 news-date">' + date + '</div><div class="col-xs-12 news-content">' + content + '</div></div></div>'
    
    $('.news-box-home').append(created);
    
    $('.news-box-home .news-item').on('click', function () {
        $('.news-item').removeClass('expand');
        $(this).toggleClass('expand');
        //$(this).parent().toggleClass('col-md-4');
    });
}


function sanitizeData(data){
    var dates = [];
    var closeds = [];
    //console.log(data);
    data.map(function(res,key){
        closeds.push(res.close);
        dates.push(res.date);
    });
    return{
        dates : dates, closeds : closeds
    };
}

 function stringifyComps(arr){
     var str="";
    arr.map(function(res,key){
        str= str + res.symbol+",";
    });
    str[str.length-1]="";
    return str;
 }

 function getRandomHexColor() {
     return '#' + Math.floor(Math.random() * 16777215).toString(16);
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
    var comps = stringifyComps(companies);
    getData(comps, function (response) {
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
          // maintainAspectRatio: false
           //animation:false
       };
       var data = {
           labels: [],
           datasets: []
       };
       // if(res.summary.length > 25)
        //newsItem(res.headline, res.summary, res.datetime);
            // response.data.forEach(function(res){
            //     console.log(res);
            // });
            Object.entries(response.data).forEach(function ([key, value]){
                //console.log();
                
                var temp = sanitizeData(value.timeseries);
                var color = getRandomHexColor();
                //console.log(value.timeseries);
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
