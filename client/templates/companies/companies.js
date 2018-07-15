/*****************************************************************************/
/* Companies: Event Handlers */
/*****************************************************************************/

Template.Companies.events({
  'click .fa-area-chart': function () {
    let symbol = this.symbol;
    window.location.href = `company/${symbol}`;
  },
  'click .fa-heart': function () {
    if (Meteor.userId() != null) {
      let item = {
        user: Meteor.user()._id,
        symbol: this.symbol,
        company: this.company
      };

      $(`#${this.symbol} .favorite-company i.fa-heart`).toggleClass('active');

      if (Favorites.findOne(item)) {
        Favorites.remove(Favorites.findOne(item)._id);
        Meteor.myFunctions.notification(
          type = "change",
          content = `${this.company} was removed from your favorite list.`
        );
      } else {
        Favorites.insert(item);
        Meteor.myFunctions.notification(
          type = "change",
          content = `${this.company} was added to your favorite list.`
        );
      }
    } else {
      Meteor.myFunctions.notification(
        type = "error",
        content = "You are not logged in",
        hyperLink = '/profile',
        linkName = 'Log In'
      );
    }
  },
  'keyup #searchCompanies': function (event, template) {
    let companies = template.data.companies;
    let input = $('#searchCompanies')[0].value.toUpperCase();
    companies.map(comp => {
      $(`#${comp.symbol}`).parent().toggle(comp.company.toUpperCase().indexOf(input) > -1);

    });
  },
});

/*****************************************************************************/
/* Companies: Helpers */
/*****************************************************************************/
Template.Companies.helpers({
  'compLength': function () {
    return (this.companies.length < 1) ? false : true;

  }
});

/*****************************************************************************/
/* Companies: Lifecycle Hooks */
/*****************************************************************************/
Template.Companies.onCreated(function () {});



Template.Companies.onRendered(function () {
  let companies = this.data.companies;
  if (companies.length > 0) {
    let comps = Meteor.myFunctions.stringifyComps(companies);

    this.data.favorites.map(function (res, key) {
      $(`#${res.symbol} .favorite-company i.fa-heart`).addClass('active');
    });
    Meteor.myFunctions.requestAPI(comps,'fullCall', function (response) {

      Object.entries(response.data).forEach(function ([key, value]) {

        Meteor.myFunctions.placeIndicators(
          key, [
            value.quote.close, //today close price
            value.quote.previousClose // yesterday close price
          ]
        );
      });


    });
  }




});

Template.Companies.onDestroyed(function () {});