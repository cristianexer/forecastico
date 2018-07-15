Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound',
  
});

Router.route('/', {
  name: 'HomeSecond',
  controller: 'HomeController',
  where: 'client',
  action:'action',
});

Router.route('/home', {
  name: 'Home',
  controller: 'HomeController',
  where: 'client',
  action:'action',
});

Router.route('/test', {
  name: 'test',
  controller: 'TestController',
  where: 'client'
});

Router.route('/profile', {
  name: 'profile',
  controller: 'ProfileController',
  where: 'client'
});

Router.route('/companies', {
  name: 'companies',
  controller: 'CompaniesController',
  where: 'client',
});

Router.route('/favorites', {
  name: 'favorites',
  controller: 'FavoritesController',
  where: 'client'
});

Router.route('/company/:SYMBOL', {
  name: 'company',
  controller: 'CompanyController',
  where: 'client'
});