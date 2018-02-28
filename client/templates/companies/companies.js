/*****************************************************************************/
/* Companies: Event Handlers */
/*****************************************************************************/
Template.Companies.events({
  'click .fa-area-chart':function(){
    var symbol = this.symbol;
    window.location.href = 'company/' + symbol;
}
});

/*****************************************************************************/
/* Companies: Helpers */
/*****************************************************************************/
Template.Companies.helpers({
});

/*****************************************************************************/
/* Companies: Lifecycle Hooks */
/*****************************************************************************/
Template.Companies.onCreated(function () {
});

async function getEOD(SYMBOL,EODHandler){
  
  var quandlLink = 'https://www.quandl.com/api/v3/datasets/EOD/';//End of the day api
  var quandlKey = 'FHgZKM4zrgcJkQs5TiHv'; // my account api key
  var year = new Date().getFullYear(); // get current year
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


function placeIndicators(id,arr){
  var indicatorAdjClose = arr[0] > arr[1] ? "up" : "down";
  var value = arr[0];
  var element = $('#' + id+" .indicator");
  element.append('<i class="fa fa-arrow-circle-'+indicatorAdjClose+'"></i>');
  element.addClass(indicatorAdjClose);
  $('#' + id+" .amount").text(value);
   

}
function toTimestamp(strDate){
  var datum = Date.parse(strDate);
  return datum/1000;
}
function toDate(timestamp){
  var timestp = new Date(timestamp);
  return timestp.toISOString();
}
Template.Companies.onRendered(function () {
  
    var companies = this.data.companies;
    companies.map(function(result,keys){
      getEOD(result.symbol,function(response){
        placeIndicators(
          result.symbol,
          [
            response.data.dataset.data[0][4],//today close price
            response.data.dataset.data[1][4] // yesterday close price
          ]
        );
          
       });
    });
     
    
    
    
});

Template.Companies.onDestroyed(function () {
});
