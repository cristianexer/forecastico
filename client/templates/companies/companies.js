/*****************************************************************************/
/* Companies: Event Handlers */
/*****************************************************************************/
Template.Companies.events({
  'click .fa-area-chart':function(){
    var symbol = this.symbol;
    window.location.href = 'company/' + symbol;
},
  'click .fa-heart': function () {
    var item = {
      user: Meteor.user()._id,
      symbol: this.symbol,
      company:this.company
    };
    
    
    if (Favorites.findOne(item))
      Favorites.remove(Favorites.findOne(item)._id);
    else
     Favorites.insert(item);
     
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

async function getData(SYMBOL, Handler) {

  var final = 'https://api.iextrading.com/1.0/stock/market/batch?symbols=' + SYMBOL + '&types=news,quote&range=1m&last=1';

  await HTTP.get(final, {}, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      //return response
      Handler(response);
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
function stringifyComps(arr) {
  var str = "";
  arr.map(function (res, key) {
    str = str + res.symbol + ",";
  });
  str[str.length - 1] = "";
  return str;
}

Template.Companies.onRendered(function () {
  var companies = this.data.companies;
  var comps = stringifyComps(companies);
  
  getData(comps, function (response) {
 
    Object.entries(response.data).forEach(function ([key, value]) {

      placeIndicators(
        key,
        [
         value.quote.close,//today close price
         value.quote.previousClose // yesterday close price
        ]
      );
    });
   

  });
    
     
    
    
    
});

Template.Companies.onDestroyed(function () {
});
