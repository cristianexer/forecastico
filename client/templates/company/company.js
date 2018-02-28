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

async function getEOD(SYMBOL,EODHandler){
  
    var quandlLink = 'https://www.quandl.com/api/v3/datasets/EOD/';//End of the day api
    var quandlKey = 'FHgZKM4zrgcJkQs5TiHv'; // my account api key
    var year = '2018'; // set Start year
    var final = quandlLink + SYMBOL + '.json?api_key=' + quandlKey +'&start_date='+ year +'-01-01'; // concatenate all variables to create a link for api
  
    await HTTP.get(final,{}, function(error,response){
      if ( error ) {
          console.log( error );
        } else {
          //return response
          EODHandler(response);
        }
    });
        
    }
async function getNews(SYMBOL,Handler){

    var final = 'https://api.iextrading.com/1.0/stock/'+SYMBOL.toLowerCase()+'/batch?types=news&range=1m&last=15';

    await HTTP.get(final,{}, function(error,response){
        if ( error ) {
            console.log( error );
        } else {
            //return response
            Handler(response);
        }
    });
        
    }

function toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return datum/1000;
  }
  function toDate(timestamp){
    var timestp = new Date(timestamp);
    return timestp.toISOString();
  }
function newsItem(title,content,date){
    var created = '<div class="col-xs-12 news-item"><div class="col-xs-12 news-title">'+title+'</div><div class="col-xs-12 news-date">'+date+'</div><div class="col-xs-12 news-content">'+content+'</div></div>'

    $('.news-container').append(created);
}
function placeIndicators(data){
// 0: "Date"
// 1: "Open"
// 2: "High"
// 3: "Low"
// 4: "Close"
// 5: "Volume"
// 6: "Dividend"
// 7: "Split"
// 8: "Adj_Open"
// 9: "Adj_High"
// 10: "Adj_Low"
// 11: "Adj_Close"
// 12: "Adj_Volume"
    var indicator = function(name,value){
        $('.indicators-box .'+name+' .indicator').text(value);
    };
    indicator('open',data[1]);
    indicator('clos',data[4]);
    indicator('high',data[2]);
    indicator('low',data[3]);
    indicator('split',data[7]);
    indicator('dividend',data[6]);
    indicator('volume',data[5]);
    indicator('adjOpen',data[8]);
    indicator('adjClose',data[11]);
    indicator('adjHigh',data[9]);
    indicator('adjLow',data[10]);
    indicator('adjVolume',data[12]);

}
function reversedDatasetOfColumn(column,dataset){
    var response = [];
    dataset.map(function(result,keys){
        response.push(result[column]);
    });
    return response.reverse();
}
function chartData(dataset){
    
    return {
        labels : reversedDatasetOfColumn(0,dataset.data),
        
        datasets : [
            {
                label: "Close",
                fillColor : "rgba(220,220,220,0.2)",
                strokeColor : "green",
                pointColor : "green",
                pointStrokeColor : "#fff",
                pointHighlightFill : "green",
                pointHighlightStroke : "rgba(220,220,220,1)",
                data : reversedDatasetOfColumn(4,dataset.data),
                
                
            },
            {
                label: "Adj Close",
                fillColor : "rgba(220,220,220,0.2)",
                strokeColor : "orange",
                pointColor : "orange",
                pointStrokeColor : "#fff",
                pointHighlightFill : "orange",
                pointHighlightStroke : "rgba(220,220,220,1)",
                data : reversedDatasetOfColumn(11,dataset.data),
            }
        ]
    }
    
}
Template.Company.onRendered(function () {
   var company= this.data.company.symbol;
    ///
    ///events
    
    ///
    getEOD(company,async function(response){
        //labels = response.data.dataset.column_names
        //labels = response.data.dataset.data[0][0]
        //close = response.data.dataset.data[0][4]
        //adjClose = response.data.dataset.data[0][11]
         //console.log( response.data.dataset.column_names);
        placeIndicators(response.data.dataset.data[0]);

       var settings = await chartData(response.data.dataset);
       var ctx = document.getElementById("canvas").getContext("2d");
       window.myLine = new Chart(ctx).Line(settings, {
           responsive: true,
           scaleFontColor: "#fff",
           scaleFontSize: 10
       });

       });
    getNews(company, async function(response){
    JSON.parse(response.content).news.map(function(res,key){
        newsItem(res.headline,res.summary,res.datetime);
    });
    
    $('.news-item').on('click',function(){
        $('.news-item').removeClass('expand');
        $(this).toggleClass('expand');
    });
    
    });
		
	
		
	
});

Template.Company.onDestroyed(function () {
});
