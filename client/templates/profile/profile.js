/*****************************************************************************/
/* Profile: Event Handlers */
/*****************************************************************************/
Template.Profile.events({
    'click .logOut': function () {
        Meteor.logout();
    },
    'click .profile-menu-item': function (event) {
        let target = event.target.dataset.target;
        $('.changerMenu .changerMenu-item').removeClass('active');
        $(target).addClass('active');
    },
    'click .showEditable': function (event, template) {
        let target = event.target.dataset.attribute;
        let index = template.data.companies.findIndex(obj => obj.symbol == target);
        if (index != -1) {
            let object = template.data.companies[index];
            $('#symbolUpdate')[0].value = object.symbol
            $('#companyNameUpdate')[0].value = object.company;
            $('#companyDescriptionUpdate')[0].value = object.description;
            document.getElementById('updateCompany').setAttribute('data-attribute', object._id);
            document.getElementById('deleteCompany').setAttribute('data-attribute', object._id);
        }

    },
    'click #updateCompany': function (event, template) {
        let target = event.target.dataset.attribute;
        let object = {
            id: target,
            symbol: $('#symbolUpdate')[0].value,
            company: $('#companyNameUpdate')[0].value,
            description: $('#companyDescriptionUpdate')[0].value,
            status: true
        }
        Meteor.call('updateCompany', object, (err, result) => {
            if (err) {
                console.log(err, res);
            }
            if (result) {
                Meteor.myFunctions.notification(
                    type = "change",
                    content = `${object.company} was updated with success.`
                );
            } else {
                Meteor.myFunctions.notification(
                    type = "error",
                    content = `${object.company} couldn't be updataed, something went wrong.`
                );
            }
        });

    },
    'click #deleteCompany': function (event, template) {
        if (confirm('Are you sure you want to delete this company?')) {
            let target = event.target.dataset.attribute;
            let object = {
                id: target,
                company: $('#companyNameUpdate')[0].value,
                status: true
            }
            Meteor.call('deleteCompany', object, (err, result) => {
                if (err) {
                    console.log(err, res);
                }
                if (result) {
                    Meteor.myFunctions.notification(
                        type = "change",
                        content = `${object.company} was deleted with success.`
                    );
                    $('#editCompanyModal').modal('toggle');
                } else {
                    Meteor.myFunctions.notification(
                        type = "error",
                        content = `${object.company} couldn't be updataed, something went wrong.`
                    );
                }
            });
        }
    },
    'click #insertCompany':function(event,template){
        let object = {
            symbol: $('#symbol')[0].value,
            company: $('#companyName')[0].value,
            description: $('#companyDescription')[0].value,
            status: true
        }
        

        Meteor.call('insertCompany', object, (err, result) => {
            if (err) {
                console.log(err, res);
            }
            if (result && result != 'exists') {
                Meteor.myFunctions.notification(
                    type = "change",
                    content = `${object.company} was added with success.`
                );
                $('#symbol')[0].value = $('#companyName')[0].value = $('#companyDescription')[0].value = '';
                $('#insertCompanyModal').modal('toggle');
            }else if(result == 'exists'){
                Meteor.myFunctions.notification(
                    type = "error",
                    content = `${object.company} couldn't be inserted it already exists.`
                );
            }
            else {
                Meteor.myFunctions.notification(
                    type = "error",
                    content = `${object.company} couldn't be inserted, something went wrong.`
                );
            }
        });

    },
    'click #saveOption': function (event, template) {
        let object = {
            id: $('#userSelector')[0].value,
            user: $('#userSelector :selected').text(),
            option: $('#userOption')[0].value,
            status: true
        }
        if (Meteor.users.findOne(Meteor.userId(), {
                fields: {
                    roles: 1
                }
            }).roles[0] == "Admin") {

            Meteor.call('updateRole', object, (err, result) => {
                if (err) {
                    console.log(err, res);
                }
                if (result) {
                    Meteor.myFunctions.notification(
                        type = "change",
                        content = `${object.user} is now ${object.option}.`
                    );
                } else {
                    Meteor.myFunctions.notification(
                        type = "error",
                        content = `${object.user} couldn't be updataed, something went wrong.`
                    );
                }
            });

        }
    },

    'click #saveUsername': function (event, template) {
        let checkNick = true;
        let object = {
            id: Meteor.userId(),
            oldUsername: this.profile.nickname,
            newUsername: $('#inputUsername')[0].value,
            status: true
        }
        if (object.newUsername == this.profile.nickname) {
            Meteor.myFunctions.notification(
                type = "error",
                content = `Your username is already ${this.profile.nickname}.`
            );
            // valid = false;
            checkNick = false;

        }
        if (object.newUsername == '') {
            Meteor.myFunctions.notification(
                type = "error",
                content = `The input is empty`
            );
            //valid = false;
            checkNick = false;
        }
        if (checkNick) {
            Meteor.call('checkIfUsrnameAlreadyExist', object.newUsername, (err, result) => {
                if (!result) {

                    Meteor.myFunctions.notification(
                        type = "error",
                        content = `This username already exist.`
                    );
                } else {
                    Meteor.call('changeNickname', object, (err, result) => {
                        if (err) {
                            console.log(err, res);
                        }
                        if (result) {
                            Meteor.myFunctions.notification(
                                type = "change",
                                content = `Your new username is now ${object.newUsername}.`
                            );
                        } else {
                            Meteor.myFunctions.notification(
                                type = "error",
                                content = `Your username couldn't be updataed, something went wrong.`
                            );
                        }
                    });
                }
            });
        }

    },
    'click #savePicture': function () {
        let object = {
            id: Meteor.userId(),
            picture: $('#pPicture')[0].value,
            status: true
        }

        Meteor.call('changeProfilePicture', object, (err, result) => {
            if (err) {
                console.log(err, res);
            }
            if (result) {
                Meteor.myFunctions.notification(
                    type = "change",
                    content = `Your have changed your profile picture.`
                );
            } else {
                Meteor.myFunctions.notification(
                    type = "error",
                    content = `Something went wrong.`
                );
            }
        });
    },
    'click #removePicture': function () {
        let object = {
            id: Meteor.userId(),
            picture: "none",
            status: true
        }

        Meteor.call('changeProfilePicture', object, (err, result) => {
            if (err) {
                console.log(err, res);
            }
            if (result) {
                Meteor.myFunctions.notification(
                    type = "change",
                    content = `Your have changed your profile picture.`
                );
            } else {
                Meteor.myFunctions.notification(
                    type = "error",
                    content = `Something went wrong.`
                );
            }
        });
    }

});

/*****************************************************************************/
/* Profile: Helpers */
/*****************************************************************************/
Template.Profile.helpers({

    'equal': function (a, b) {
        return (a === b)
    },
    'isInRole': function (passed) {
        return (this.role.roles[0] === passed);
    },
    'activeClassByRole': function (passed) {
        return (this.role.roles[0] === passed) ? "active" : "inactive";
    },

    'emailOfUser': function (object) {
        return object[0].address;
    },
    'pictureInput': function () {
        return (this.profile.profilepicture != "none") ? this.profile.profilepicture : '';
    },
    'avatar': function () {
        return (this.profile.profilepicture == "none") ? "/images/avatar.png" : this.profile.profilepicture;
    },
    'myEmail': function () {
        return this.me.emails[0].address;
    },



});

/*****************************************************************************/
/* Profile: Lifecycle Hooks */
/*****************************************************************************/
Template.Profile.onCreated(function () {


});

Template.Profile.onRendered(function () {
    [...document.getElementsByClassName('increm')].forEach(item => item.innerText = parseInt(item.innerText)+1);

});

Template.Profile.onDestroyed(function () {});