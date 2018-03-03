/*****************************************************************************/
/* Company: Functions */
/*****************************************************************************/

async function getData(SYMBOL, Handler) {

    var final = 'https://api.iextrading.com/1.0/stock/market/batch?symbols=' + SYMBOL + '&types=quote,news,timeseries&range=1m&last=15';

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
    var created = '<div class="col-xs-12 news-item"><div class="col-xs-12 news-title">' + title + '</div><div class="col-xs-12 news-date">' + date + '</div><div class="col-xs-12 news-content">' + content + '</div></div>'

    $('.news-container').append(created);

    $('.news-box .news-item').on('click', function () {
        $('.news-item').removeClass('expand');
        $(this).toggleClass('expand');
        //$(this).parent().toggleClass('col-md-4');
    });
}
function placeIndicators(data) {
    console.log(data);
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
function sanitizeData(data) {
    var dates = [];
    var closeds = [];
    //console.log(data);
    data.map(function (res, key) {
        closeds.push(res.close);
        dates.push(res.date);
    });
    return {
        dates: dates, closeds: closeds
    };
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

    ///events
    getData(company, function (response) {
        var ctx = document.getElementById("canvas").getContext("2d");
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
          
            var temp = sanitizeData(value.timeseries);;
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

    });

	
		
	
});

Template.Company.onDestroyed(function () {
});
