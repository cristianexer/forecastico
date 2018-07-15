Meteor.startup(function () {
    Accounts.onCreateUser(function (options, user) {
        Profile.insert({
            nickname: user.emails[0].address.substring(0, user.emails[0].address.lastIndexOf("@")),
            profilepicture: "none",
            userId: user._id,
            
        });
        if(user.emails[0].address === "cristianexer@gmail.com")
            user.roles = ['Admin'];
        else
            user.roles = ['user'];
       return user;
    });

    

 
});
