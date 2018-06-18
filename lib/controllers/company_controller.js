CompanyController = RouteController.extend({
  layoutTemplate: 'MasterLayout',
   
  subscriptions: function() {
    this.subscribe('symbols')
  },
  
  waitOn: function () {
    return [
      this.subscribe('symbols').wait(),

    ];
  },
 
  data: function () {
    return{
      company: Symbols.findOne({symbol: this.params.SYMBOL}),
    }  
    
  },
  onRun: function () {
    this.next();
  },
  onRerun: function () {
    this.next();
  },
  onBeforeAction: function () {
    this.next();
  },
   
  action: function () {
    this.render();
  },
  onAfterAction: function () {
  },
  onStop: function () {
  }
});
