Template.header.events({
	'click #getmedtrg': function (event) {
		$(".quickpanel").hide();
		if ($("#getmed").css("display") == "none"){
			$("#getmed").css("display", "table");
		}
	},
	'click #ordering_form > button': function (event) {
	  $("#ordering_form").get(0).reset();
	  $("#float_over").css({"display":"none"});
	},
	'submit #ordering_form': function (event) {
		event.preventDefault();
	}
	//,
	// 'click #getordertrg': function (event) {
	// 	$(".quickpanel").hide();
	// 	if($("#getorder").css("display") == "none"){
	// 		$("#getorder").css("display","table");
	// 	}
	// }
});

Template.defaultLayout.events({
	'click .closer': function () {
		console.log(this);
		console.log("e: ", event.target.getAttribute('data-close'));
		$("#" + event.target.getAttribute('data-close')).hide();
	},
	'click .clearfield': function (event) {
		$(event.target).siblings("input[type='text']").val("");
	}
});
