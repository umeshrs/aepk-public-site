Template.header.onRendered(function () {
  this.$("header").css("position", "fixed")
});

Template.header.events({
	'click #getmedtrg': function (event) {
		$(".quickpanel").hide();
		if ($("#getmed").css("display") == "none"){
			$("#getmed").css("display", "table");
		}
	},
	'submit #ordering_form': function (event) {
		event.preventDefault();
	},
	'click #find-store-btn': function () {
		Router.go('/store-locator');
	},
	'click #upload-now-btn': function () {
		$("#getmed").css("display", "none");
		Router.go('/store-locator');
	},
	'click #order-manually-btn': function () {
		$("#getmed").css("display", "none");
		Router.go('/store-locator');
	}
	//,
	// 'click #getordertrg': function (event) {
	// 	$(".quickpanel").hide();
	// 	if($("#getorder").css("display") == "none"){
	// 		$("#getorder").css("display","table");
	// 	}
	// }
});

Template.header.helpers({
	orderDetails: function () {
		return Session.get("orderDetails");
	}
});

Template.defaultLayout.events({
	'click .closer': function () {
		$("#" + event.target.getAttribute('data-close')).hide();
	},
	'click .clearfield': function (event) {
		$(event.target).siblings("input[type='text']").val("");
	},
	'submit #ordering_form': function (event) {
		console.log("hey");
		event.preventDefault();
		var orderDetails = Session.get("orderDetails");
		orderDetails.customer = {
      name: $("#customer-name").val(),
      email: $("#customer-email").val(),
      telephone: $("#customer-telephone").val(),
      address: $("#customer-address").val()
		}
		Session.set("orderDetails", orderDetails);
		Router.go('/order-details');
		$("#float_over").css("display", "none");

	}
});
