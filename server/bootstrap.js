Meteor.startup(function () {
    Accounts.onCreateUser(function (options, user) {
        Profile.insert({
            nickname: user.emails[0].address.substring(0, user.emails[0].address.lastIndexOf("@")),
            profilepicture: "none",
            userId: user._id,
            
        });
        user.roles = ['user'];
       return user;
    });

 
});
