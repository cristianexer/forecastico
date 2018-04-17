/*****************************************************************************/
/* Companies: Functions */
/*****************************************************************************/



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
    
    $('#' + this.symbol + " .favorite-company i.fa-heart").toggleClass('active');
    
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



Template.Companies.onRendered(function () {
  var companies = this.data.companies;
  var comps = Meteor.myFunctions.stringifyComps(companies);

  this.data.favorites.map(function(res,key){
    $('#' + res.symbol +" .favorite-company i.fa-heart").addClass('active');
  });
  Meteor.myFunctions.callIEX(comps, function (response) {
 
    Object.entries(response.data).forEach(function ([key, value]) {

      Meteor.myFunctions.placeIndicators(
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
