window.onload = function(){
	init();
	$("#start-button").on("click",function(){
		$("#start-menu,#over-menu").css("display","none");
		$("#bird,#score").css("display","block");
		rungame();
	});
	$("#restart-button").on("click",function(){
		$("#over-menu").css("display","none");
		$(".pipeD,.pipeU").remove(); //重置游戏的前需要把管道元素都删除掉
		rungame();
	});
}