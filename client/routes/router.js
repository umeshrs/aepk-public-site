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