/*****************************************************************************/
/* Profile: Functions */
/*****************************************************************************/

function editNickname(nickname){
    var profileId = getProfile()._id;
    return Profile.update(profileId,{
        $set:{nickname:nickname},
    });    

}


/*****************************************************************************/
/* Profile: Event Handlers */
/*****************************************************************************/
Template.Profile.events({
    'click .logOut':function(){
        Meteor.logout();
    },
    'click .profile-menu-item':function(event){
        let target = event.target.dataset.target;
        $('.changerMenu .changerMenu-item').removeClass('active');
        $(target).addClass('active');
    },
    'click .comp':function(event){
        let target = event.target;
        $('.companyEditWrapper').removeClass('active');
        $('.companyEditWrapper').addClass('col-md-4');
        $(target).parent().toggleClass('active col-md-4');
        
    }

});

/*****************************************************************************/
/* Profile: Helpers */
/*****************************************************************************/
Template.Profile.helpers({
    
    'equal':function(a,b){
        return (a === b)
    },
    
    'avatar':function(){
        let picture = this.profile.profilepicture;
        if(picture != "none")
            return "/profiles/" + Meteor.userId() + "/" + picture;

        return "/images/avatar.png"
    },
    'myEmail':function(){
        return this.me.emails[0].address;
    }

});

/*****************************************************************************/
/* Profile: Lifecycle Hooks */
/*****************************************************************************/
Template.Profile.onCreated(function () {
 
});

Template.Profile.onRendered(function () {
    
    
});

Template.Profile.onDestroyed(function () {
});
