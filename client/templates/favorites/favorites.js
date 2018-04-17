/*****************************************************************************/
/* Favorites: Event Handlers */
/*****************************************************************************/


Template.Favorites.events({
    'click .fa-area-chart': function () {
        var symbol = this.symbol;
        window.location.href = 'company/' + symbol;
    },
    'click .fa-heart': function () {
        var item = {
            user: Meteor.user()._id,
            symbol: this.symbol,
            company: this.company
        };


        if (Favorites.findOne(item))
            Favorites.remove(Favorites.findOne(item)._id);
        else
            Favorites.insert(item);

    }
});

/*****************************************************************************/
/* Favorites: Helpers */
/*****************************************************************************/
Template.Favorites.helpers({
});

/*****************************************************************************/
/* Favorites: Lifecycle Hooks */
/*****************************************************************************/
Template.Favorites.onCreated(function () {
    var companies = this.data.companies;
    var comps = Meteor.myFunctions.stringifyComps(companies);
    if(!Meteor.userId())
        console.log("not logged");
    else
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

Template.Favorites.onRendered(function () {
});

Template.Favorites.onDestroyed(function () {
});
