Router.configure({
  layoutTemplate: 'defaultLayout'
});

Router.route('/', function () {
  this.render('index', {
    // data: function () { return Items.findOne({_id: this.params._id}); }
  });
});

Router.route('/store-locator', function () {
  this.render('storeLocator');
});

Router.route('/order-details', function () {
  this.render('orderDetails');
});

Router.route('/partners', function () {
  this.render('partners');
});

Router.route('/gallery', function () {
  this.render('gallery');
});

Router.route('/gallery/album', function () {
  this.render('album');
});

Router.route('/contact', function () {
  this.render('contact');
});
