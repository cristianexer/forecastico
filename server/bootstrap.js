Meteor.startup(function () {
    if (Roles.userIsInRole(Meteor.users.findOne({ "emails.address": "dcristian35@yahoo.com" })._id,'Admin')){
        Roles.addUsersToRoles(Meteor.users.findOne({ "emails.address": "dcristian35@yahoo.com" })._id, 'Admin');
    }
});
