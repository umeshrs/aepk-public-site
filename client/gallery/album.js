Template.album.onRendered(function () {
  imgcount = $(".gall_viewer2 > aside").length;
  presentimg = 0;
  pause = 0;
  $("#imgcounter").text(presentimg+" of "+imgcount);
  
  moveani = function(){
    if(pause == 0){
      presentimg = presentimg + 1;
      if(presentimg > imgcount){
        presentimg = 1;
      }
      $(".gall_viewer1").css({"background-image":$(".gall_viewer2 > aside").eq(presentimg-1).css("background-image")+",url('http://localhost/svit_cms/images/loader.gif')"});
      $("#imgcounter").text(presentimg+" of "+imgcount);
      $(".gall_viewer2 > aside").removeClass("selecimg");
      $(".gall_viewer2 > aside").eq(presentimg - 1).addClass("selecimg");
    }
  };
  
  moveani();
  imgtimer = setInterval(moveani,5000);
  
  $(".gall_viewer2 > aside")
  .innerHeight($(".gall_viewer2 > aside").innerWidth())
  .click(function(){
    $(".gall_viewer2 > aside").removeClass("selecimg");
    $(".gall_viewer1").css({"background-image":$(this).css("background-image")+",url('http://localhost/svit_cms/images/loader.gif')"});
    presentimg = Number($(this).attr("data-id"));
    $("#imgcounter").text(presentimg+" of "+imgcount);
    $(this).addClass("selecimg");
  });
  
  $("#imgcounter").click(function(){
    if(pause == 0){
      pause = 1;
      $(this).addClass("galplay");
    }else{
      pause = 0;
      $(this).removeClass("galplay");
    }
  });
  
  $("#imgmoveleft").click(function(){
    pause = 0;
    $("#imgcounter").removeClass("galplay");
    presentimg = presentimg - 2;
    if(presentimg < 0){
      presentimg = imgcount-1;
    }
    moveani();
  });
  
  $("#imgmoveright").click(function(){
    pause = 0;
    $("#imgcounter").removeClass("galplay");
    moveani();
  });
});
