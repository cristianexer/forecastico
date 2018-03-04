Meteor.publish('symbols', function () {
    return Symbols.find();
   });

Meteor.publish('favorites', function () {
    return Favorites.find({});
});

