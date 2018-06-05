Symbols = new Mongo.Collection('symbols'); //instantiem obiectul Symbols al bazei de date
import SimpleSchema from 'simpl-schema'; //importam clasa simpl-schema pentru a atasa o schema colectiei
SimpleSchema.extendOptions(['autoform']); //extindem optiunea pentru autoform deoarece nu

Symbols.attachSchema(new SimpleSchema({
  symbol:{ //campul pentru simbolul companiei
    type:String, // este de tipul string
    label: "Symbol", //eticheta pentru autoform
    optional:false, // este obligatoriu
  },
  company:{ //campul pentru numele companiei
    type:String, //este de tipul string
    label: "Company Name", // eticehta pentru autoform
    optional: false, //este obligatoriu
  },
  description:{ //campul pentru descrierea companiei
    type:String,  //este de tipul string
    label: "Company Description", //eticheta pentru autoform
    autoform: { //definim 6 randuri pentru autoform ca sa creeze un textarea
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
