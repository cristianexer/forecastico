Meteor.publish('symbols', function () {
    return Symbols.find();
   });

Meteor.publish('favorites', function () {
    return Favorites.find({});
});

Meteor.publish('profile', function () {
    return Profile.find({});
});

Meteor.publish('users', function () {
    return Meteor.users.find({});
});

