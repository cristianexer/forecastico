/*****************************************************************************/
/* Favorites: Event Handlers */
/*****************************************************************************/


Template.Favorites.events({
    'click .fa-area-chart': function () {
        var symbol = this.symbol;
        window.location.href = 'company/' + symbol;
    },
    'click .fa-heart': function () {
        if(Meteor.userId() != null){
            var item = {
                user: Meteor.user()._id,
                symbol: this.symbol,
                company: this.company
            };


            if (Favorites.findOne(item)) {
                Favorites.remove(Favorites.findOne(item)._id);
                Meteor.myFunctions.notification(
                    type = "change",
                    content = `${this.company} was removed from your favorite list.`
                );
            }
            else {
                Favorites.insert(item);
                Meteor.myFunctions.notification(
                    type = "change",
                    content = `${this.company} was added to your favorite list.`
                );
            }
        }
        else{
            Meteor.myFunctions.notification(
                type = "error",
                content = "You are not logged in",
                hyperLink = '/profile',
                linkName = 'Log In'
            );  
        }
    },
});

/*****************************************************************************/
/* Favorites: Helpers */
/*****************************************************************************/
Template.Favorites.helpers({
    'compLength':function(){
        return (this.companies.length < 1) ? false : true;
    }
});

/*****************************************************************************/
/* Favorites: Lifecycle Hooks */
/*****************************************************************************/
Template.Favorites.onCreated(function () {
    var companies = this.data.companies;
    if (Meteor.userId() && companies.length > 0){
    
    var comps = Meteor.myFunctions.stringifyComps(companies);
    
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

    }

});

Template.Favorites.onRendered(function () {
});

Template.Favorites.onDestroyed(function () {
});
