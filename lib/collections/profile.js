Profile = new Mongo.Collection('profile');
import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Profile.attachSchema(new SimpleSchema({
  nickname: {
    type: String,
    label: "Nickname",
  },
  profilepicture: {
    type: String,
    label: "Profile Picture",
    //blackbox: true
  },
  userId: {
    type: String,
    label: "userId",
    //blackbox: true
  }
}));


if (Meteor.isServer) {
  Profile.allow({
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
  Profile.allow({
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