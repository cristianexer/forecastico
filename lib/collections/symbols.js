Symbols = new Mongo.Collection('symbols');
import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Symbols.attachSchema(new SimpleSchema({
  symbol:{
    type:String,
    label: "Symbol",
  },
  company:{
    type:String,
    label: "Company Name",
  },
  description:{
    type:String,
    label: "Company Description",
    autoform: {
      rows: 6
    }
  }
}));


if (Meteor.isServer) {
  Symbols.allow({
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
