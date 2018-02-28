Meteor.publish('symbols', function () {
    return Symbols.find();
   });
