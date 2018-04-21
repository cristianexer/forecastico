Meteor.publish('symbols', function getSymbols () {
    return Symbols.find();
   });

Meteor.publish('favorites', function getFavorites () {
    return Favorites.find({});
});

Meteor.publish('profile', function getProfiles () {
    return Profile.find({});
});

