/*****************************************************************************/
/*  Client and Server Methods */
/*****************************************************************************/

Meteor.methods({

    'updateRole': async function (object) {
        if (object.status) {

            let result = await Meteor.users.update({
                _id: object.id
            }, {
                $set: {
                    'roles.0': object.option
                }
            });

            return result;

        }



    },
    'changeNickname': async function (object) {
        if (object.status) {

            let result = await Profile.update({
                userId: object.id
            }, {
                $set: {
                    'nickname': object.newUsername
                }
            });

            return result;

        }

    },

    'checkIfUsrnameAlreadyExist': async function (nickName) {
        let result = await Profile.findOne({
            nickname: nickName
        });
        return result ? false : true;

    },
    'changeProfilePicture': async function (object) {
        if (object.status) {

            let result = await Profile.update({
                userId: object.id
            }, {
                $set: {
                    'profilepicture': object.picture
                }
            });

            return result;

        }

    },
    'updateCompany': async function (object) {
        if (object.status) {

            let result = await Symbols.update({
                _id: object.id
            }, {
                $set: {
                    'symbol': object.symbol,
                    'company': object.company,
                    'description': object.description,
                }
            });

            return result;

        }

    },
    'deleteCompany': async function (object) {
        if (object.status) {

            let result = await Symbols.remove(object.id);

            return result;

        }

    },
    'insertCompany': async function (object) {
        if (object.status) {
            delete object['status'];
            if (Symbols.findOne({symbol: object.symbol})) {
                return 'exists';
            } else {
                return await Symbols.insert(object);
            }


        }

    }



});