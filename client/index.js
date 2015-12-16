Template.registerHelper("adminDomain", function () { return ADMIN_APP_DOMAIN; });
Template.registerHelper("adminPort", function () { return ADMIN_APP_PORT; });

Template.index.onRendered(function () {
  var spacing = ($("#promosect > article").innerWidth() - (150*5))/4;
  var sets = Math.ceil($("#promosect > article > aside > a").length / 5);
  
  var setcount = 0;
  
  $("#promosect > article > aside > a").each(function(k,v){
    console.log($(this).css({'left':k*(150+spacing)}));
  });
  
  $("#promosect > span:first-of-type").click(function(){
    setcount--;
    if(setcount < 0){
      setcount = sets-1;
    }
    prodmove();
  });
  
  $("#promosect > span:last-of-type").click(function(){
    setcount++;
    if(setcount+1 > sets){
      setcount = 0;
    }
    prodmove();
  });
  
  function prodmove(){
    if($("#promosect > article > aside > a").length > 0){
      $("#promosect > article > aside").animate({'left':- $("#promosect > article > aside > a").eq((setcount*5)).position().left},1400,"easeOutCubic");
    }
  }
  
  promomover = setInterval(function(){
    setcount++;
    if(setcount+1 > sets){
      setcount = 0;
    }
    prodmove();
  }, 6000);
  
});
