$(document).ready(function(){
	
	$(".clearfield").click(function(){
		$(this).siblings("input[type='text']").val("");
	});

	$(".cleartableau").click(function(){
		console.log($(".tableau > div:nth-child(n+2)").remove());
	});
	
	$("#getmedtrg").click(function(){
		$(".quickpanel").hide();
		if($("#getmed").css("display") == "none"){
			$("#getmed").css("display","table");
		}
	});
	
	$("#getordertrg").click(function(){
		$(".quickpanel").hide();
		if($("#getorder").css("display") == "none"){
			$("#getorder").css("display","table");
		}
	});
	
	$(".closer").click(function(){
		$("#"+$(this).attr("data-close")).hide();
	});
	
	$(".map_plot_page > aside").height($(window).innerHeight() - 92);
	$(".map_plot_page > article").height($(window).innerHeight() - 92);
	
	$(window).resize(function(){
		$(".map_plot_page > aside").height($(window).innerHeight() - 92);
		$(".map_plot_page > article").height($(window).innerHeight() - 92);
	});
	
	$(".stores_list > button").click(function(){
		$("#float_over").css({"display":"table"});
	});
	
	$("#ordering_form > button").click(function(){
		$("#ordering_form").get(0).reset();
		$("#float_over").css({"display":"none"});
	});
	
	$("#drug_short_list").click(function(){
		$(".tableau").show();
	});
	
	$(".rowadder").click(function(){
		$(this).parent().parent().append('<div><img src="images/remove.png" class="rowremover"><input type="text" placeholder="Enter Drug Name Here"><input type="text" placeholder="Enter Quantity"></div>');
		rowremove();
		$(".tableau > div > input:nth-of-type(1)").on("input",function(){
			listupdate();
		});
	});
	
	rowremove = function(){$(".rowremover").click(function(){
			$(this).parent().remove();
			listupdate();
		});
	};
	rowremove();
	
	$(".tableau > div > input:nth-of-type(1)").on("input",function(){
		listupdate();
	});
	
	listupdate = function(){
		drugslist = "";
		$.each($(".tableau > div > input:nth-of-type(1)"), function(k,v){
			drugslist += $(v).val();
			if((k+1) == $(".tableau > div > input:nth-of-type(1)").length){
				return;
			}else{
				drugslist += ", ";
			}
		});
		$("#drug_short_list").val(drugslist);
	};
	
});
