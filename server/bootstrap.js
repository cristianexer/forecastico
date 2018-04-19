Meteor.startup(function () {
    
    if (!Roles.userIsInRole(Meteor.users.findOne({ "emails.address": "dcristian35@yahoo.com" })._id,'Admin')){

        Roles.addUsersToRoles(Meteor.users.findOne({ "emails.address": "dcristian35@yahoo.com" })._id, 'Admin');
        //fix for not giving the admin rights
    }
    Accounts.onCreateUser(function (options, user) {
        Profile.insert({
            nickname: user.emails[0].address.substring(0, user.emails[0].address.lastIndexOf("@")),
            profilepicture: "none",
            userId: user._id
        });
       return user;
    });

 
});
