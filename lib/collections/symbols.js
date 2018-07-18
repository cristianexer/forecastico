Symbols = new Mongo.Collection('symbols');
import SimpleSchema from 'simpl-schema'; 
SimpleSchema.extendOptions(['autoform']); 

Symbols.attachSchema(new SimpleSchema({
  symbol:{ 
    type:String, 
    label: "Symbol", 
    optional:false,
  },
  company:{ 
    type:String, 
    label: "Company Name", 
    optional: false, 
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
if (Meteor.isClient) {
  Symbols.allow({
    insert: function (userId, doc) {
      return false;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return false;
    },

    remove: function (userId, doc) {
      return false;
    }
  });


}