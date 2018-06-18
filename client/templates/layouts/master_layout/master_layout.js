/*****************************************************************************/
/* Master Layout: Event Handlers */
/*****************************************************************************/
Template.MasterLayout.events({});

/*****************************************************************************/
/* Master Layout: Helpers */
/*****************************************************************************/
Template.MasterLayout.helpers({});

/*****************************************************************************/
/* Master Layout: Lifecycle Hooks */
/*****************************************************************************/
Template.MasterLayout.onCreated(function () {});

Template.MasterLayout.onRendered(function () {
    $('#reconnecting').fadeOut(300);
    let wardTime = 2000;

    let ward = () => {
       
            if(!Meteor.status().connected){
                $('#reconnecting').fadeIn(300);
                Meteor.reconnect();
            }else{
                $('#reconnecting').fadeOut(300);
            }


        Meteor.setTimeout(ward, wardTime);
    };

    Meteor.setTimeout(ward, wardTime);


    

});

Template.MasterLayout.onDestroyed(function () {});