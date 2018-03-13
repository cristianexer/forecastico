/*****************************************************************************/
/* Profile: Functions */
/*****************************************************************************/
function getProfile() {
    if (Profile.findOne({ userId: Meteor.userId() })) {
        return Profile.findOne({ userId: Meteor.userId() });
    }
    else {
        Profile.insert({
            nickname: "none",
            profilepicture: "none",
            userId: Meteor.userId()
        });
    }
    return Profile.findOne({ userId: Meteor.userId() });

}

function editNickname(nickname){
    var profileId = getProfile()._id;
    return Profile.update(profileId,{
        $set:{nickname:nickname},
    });    

}
function editProfilePicture(path){

}
/*****************************************************************************/
/* Profile: Event Handlers */
/*****************************************************************************/
Template.Profile.events({
});

/*****************************************************************************/
/* Profile: Helpers */
/*****************************************************************************/
Template.Profile.helpers({
    
    'equal':function(a,b){
        return (a === b)
    }

});

/*****************************************************************************/
/* Profile: Lifecycle Hooks */
/*****************************************************************************/
Template.Profile.onCreated(function () {
});

Template.Profile.onRendered(function () {
    $('.editProfile').on('click',function(){
        $(this).toggleClass('editMode');
        $('.profile-data').toggleClass('editMode');
        var edit = $(this).text();
        var username = $('#username').text();
        var inputTag = '<input type="text" value="' + username + '" id="usernameControl"/>';
        if(edit == "Edit Profile"){
        $(this).text("Save");
        $('#username').html(inputTag);
        
       $('#usernameControl').on('keyup', function () {
            var value = $(this).val();
           editNickname(value);
        
       });
        }
        else{
        $(this).text("Edit Profile");
        $('#username').text(temp);
        var temp = $('#usernameControl').val();
        $('#usernameControl').remove();
        
               
        }
        
    });
    

    $('.profile-menu-item').on('click',function(){
        var target = $(this).data('target');
        $('.changerMenu .changerMenu-item').removeClass('active');
        $(target).addClass('active');
    });

    
});

Template.Profile.onDestroyed(function () {
});
