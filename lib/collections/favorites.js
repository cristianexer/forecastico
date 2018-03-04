Favorites = new Mongo.Collection('favorites');
import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Favorites.attachSchema(new SimpleSchema({
  user: {
    type: String,
    label: "User",
  },
  symbol: {
    type: String,
    label: "Symbol",
    //blackbox: true
  },
  company: {
    type: String,
    label: "Company",
    //blackbox: true
  }
}));


if (Meteor.isServer) {
  Favorites.allow({
    insert: function (userId, doc) {
      return true;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },

    remove: function (userId, doc) {
      return true;
    }
  });
  

}

if (Meteor.isClient) {
  Favorites.allow({
    insert: function (userId, doc) {
      return true;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },

    remove: function (userId, doc) {
      return true;
    }
  });

}