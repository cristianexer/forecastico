ProfileController = RouteController.extend({
  layoutTemplate: 'MasterLayout',

  subscriptions: function () {},


  waitOn: function () {
    return [
      Meteor.subscribe('symbols'),
      Meteor.subscribe('favorites'),
      Meteor.subscribe('profile'),
      Meteor.subscribe('users')
    ];
  },

  data: function () {
    return {
      companies: Symbols.find().fetch(),
      favorites: Favorites.find({
        user: Meteor.userId()
      }).count(),
      me: Meteor.user(),
      profile: Profile.findOne({
        userId: Meteor.userId()
      }),
      users: Meteor.users.find({}, {
        fields: {
          roles: 1,
          emails: 1
        }
      }).fetch(),
      role: Meteor.users.findOne(Meteor.userId(), {
        fields: {
          roles: 1
        }
      })
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
  onAfterAction: function () {},
  onStop: function () {}
});