
/*****************************************************************************/
/* Home: Functions */
/*****************************************************************************/
async function getEOD(SYMBOL, EODHandler) {

    var quandlLink = 'https://www.quandl.com/api/v3/datasets/EOD/';//End of the day api
    var quandlKey = 'FHgZKM4zrgcJkQs5TiHv'; // my account api key
    var year = '2018'; // set Start year
    var final = quandlLink + SYMBOL + '.json?api_key=' + quandlKey + '&start_date=' + year + '-01-01'; // concatenate all variables to create a link for api

    await HTTP.get(final, {}, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            //return response
            EODHandler(response);
        }
    });

}
async function getNews(SYMBOL, Handler) {

    var final = 'https://api.iextrading.com/1.0/stock/' + SYMBOL.toLowerCase() + '/batch?types=news&range=1m&last=1';

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
   
}

function reversedDatasetOfColumn(column, dataset) {
    var response = [];
    dataset.map(function (result, keys) {
        response.push(result[column]);
    });
    return response.reverse();
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
    // var ctx = document.getElementById("trend-chart").getContext("2d");
    // var options = {
    //     responsive: true,
    //     scaleFontColor: "#fff",
    //     scaleFontSize: 10
    // };
    // var data = {
    //     datasets: [
    //         // invisible dataset
           
    //     ]
    // };
    // var myLineChart = new Chart(ctx).Line(data, options);
    
    companies.map(function (result, keys) {

        //  getEOD(result.symbol, async function (response) {
        //     //  if(keys == 0)
        //     //      data.append({labels : response.data.dataset.data[0][0]});
        //     //labels = response.data.dataset.column_names
        //     //labels = response.data.dataset.data[0][0]
        //     //close = response.data.dataset.data[0][4]
        //     //adjClose = response.data.dataset.data[0][11]
        //     //console.log( response.data.dataset.column_names);
        //     //console.log( response.data.dataset);
            
        //     //  data.datasets.push({
        //     // label: "Close",
        //     // fillColor: "rgba(220,220,220,0.2)",
        //     // strokeColor: "green",
        //     // pointColor: "green",
        //     // pointStrokeColor: "#fff",
        //     // pointHighlightFill: "green",
        //     // pointHighlightStroke: "rgba(220,220,220,1)",
        //     // data: reversedDatasetOfColumn(4, response.data.dataset.data[0]),


        //     //  });

        // });
         getNews(result.symbol,function (response) {
        JSON.parse(response.content).news.map(function (res, key) {
            if(res.summary.length > 25)
            newsItem(res.headline, res.summary, res.datetime);
        });

        $('.news-item').on('click', function () {
            $('.news-item').removeClass('expand');
            $(this).toggleClass('expand');
            //$(this).parent().toggleClass('col-md-4');
        });

        });
    });
   
    
    
});

Template.Home.onDestroyed(function () {
});
