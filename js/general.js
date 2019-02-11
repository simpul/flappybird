function init(){
	$("#bird,#score,#over-menu").css("display","none");
	$("#restart-button").on({
		mouseenter: function(){
			$(this).html("Start it right now!");
		},
		mouseleave: function(){
			$(this).html("Start a new journey?");
		}
	});
}
function rungame(){
	var game = $("#game").get(0);
	//var game = document.getElementById("game");
	var birdEle = $("#bird").get(0);
	//var birdEle = document.getElementById("bird");
	var gameover = false;
	var g = 1;  //重力加速度
	var score = 0;  //计分
	var sky = {
		position: 0
	}
	$("#bird").css("top","100px"); //每次重新开始游戏时重置小鸟的位置
	var bird = {
		entity: birdEle,
		speedX: 2,  //水平飞行的速度
		speedY: 5,
		x: birdEle.offsetLeft,
		y: birdEle.offsetTop
	}
	$("#score span,#over-menu span").html("0"); //分数初始化

	function Pipe(position) {
		this.x = position;  //管道div的left属性值 
		this.width = 52;  //管道的宽度 
		this.upPipeY = 0;   //上管道div的top属性值
		this.gap = 180; //能通过的gap大小
		this.upPipeH = parseInt(Math.random() * 275) + 100;  //上面管道div的高度: 100~275
		this.downPipeY = this.upPipeH + this.gap;   //下管道div的top属性值
		this.downPipeH = 600 - this.downPipeY;  //下面管道div的高度。 600是div.game的高度 
		var _this = this;

		var divUp = document.createElement("div"); //生成一个上管道
		divUp.className = "pipeU";
		divUp.style.left = this.x + "px";
		divUp.style.top = this.upPipeY + "px";
		divUp.style.width = this.width + "px";
		divUp.style.height = this.upPipeH + "px";  
		
		var divDown = document.createElement("div"); //生成一个下管道
		divDown.className = "pipeD";
		divDown.style.left = this.x + "px";
		divDown.style.top = this.downPipeY + "px";  //
		divDown.style.width = this.width + "px";
		divDown.style.height = this.downPipeH + "px";  //
		
		game.appendChild(divUp);
		game.appendChild(divDown);
		
		
		var _pipeloop = setInterval(function(){
			var bonus, gap, range;
			gameover && clearTimeout(_pipeloop);
			_this.x -= bird.speedX; //管道10ms往左边移动2px/10ms
			switch(stage(score)) {
				case 1:
					gap = 180;
					bonus = 10;
					range = parseInt(Math.random() * 275) + 100;
					break;
				case 2:
					gap = 150;
					bonus = 20;
					range = parseInt(Math.random() * 275) + 75;
					break;
				case 3:
					gap = 120;
					bonus = 50;
					range = parseInt(Math.random() * 250) + 100;
			}
			if (_this.x < -52) {
				_this.x = 800;  //当管道从界面左边出去后回到界面右边，从而不断循环，所以可以算出管道间的间距为（800-4*52）/4 = 148px
				divUp.style.height = range + "px";
				divDown.style.top = range + gap + "px";
				divDown.style.height = 600- gap - range + "px";
			}
			if (!gameover) { //只要游戏不结束，管道就需要不断移动
				divUp.style.left = _this.x + "px";
				divDown.style.left = _this.x + "px";
			}
			if((!gameover)&&(bird.x === _this.x)) { //每过一个管道口就执行一次加分
				score += bonus;
				$("#score span,#over-menu span").html(score);
			}
			var clsUp = (bird.x + 34 > _this.x) && (bird.x < _this.x + 52) && (bird.y < parseInt(divUp.style.height));  //当小鸟进入gap时且碰到上管道时候为true
			var clsDown = (bird.x + 34 > _this.x) && (bird.x < _this.x + 52) && (bird.y + 26 > parseInt(divDown.style.top)); //当小鸟进入gap时且碰到下管道时候为true
			if (clsUp || clsDown) { //碰到管道就算fail了
				gameover = true;
			}
		}, 10)
	}

	var _gameloop = setInterval(function(){ //游戏执行的整个过程中都需要循环执行的部分
		if(gameover){
			clearTimeout(_gameloop);
			$("#over-menu").css("display","block");
		}else{
			bird.speedY = bird.speedY + g;  //小鸟坠落速度增加（加速度为g）
			bird.y = bird.y + bird.speedY; //
			if (bird.y > 574) {  //小鸟触壁判fail
				bird.y = 574;
				gameover = true;
			}
			if (bird.y < 0) { //小鸟触底判fail
				bird.y = 0;
				gameover = true;
			}
			bird.entity.style.top = bird.y + "px";
			sky.position -= bird.speedX; //以小鸟X方向的速度将背景往左边移动
			game.style.backgroundPositionX = sky.position + "px";
		}
	}, 25)
	document.onmousedown = function(e) {  //鼠标点击触发小鸟拍动翅膀
		e = e || window.event;
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
		bird.speedY = -9;
		$("#bird").stop().css("backgroundPositionX", "-113px").delay(225).queue(function(){
			$("#bird").css("backgroundPositionX", "-8px");
			$(this).dequeue();
		});
	}
	for(var i = 0; i < 4; i++){
		new Pipe(400 + 800 / 4 * i);
	}
	function stage(score){ //根据当前分数判断进入第几阶段
		switch(true){
			case score<300:
				return 1;
			case score<1300:
				return 2;
			default:
				return 3;
		}
	}
}