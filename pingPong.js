/*
//  Ping Pong
//  pingPong.js
//  Created by Ashish Gogna on 4/19/16.
*/

//Global variables
var windowWidth = $(window).width();
var windowHeight = $(window).height();

var gameStarted = 0;

var lastScore = 0;
var score = 0;

//The World
var world = {
    ctx:null,
    fps:20,
    themeColor: "#3B444B",
    mouseX:0,
    mouseY:0
}

world.setup = function()
{
	$('#gameDiv').append('<canvas id="gameCanvas">');
    var $canvas = $('#gameCanvas');
    $canvas.attr('width', windowWidth);
    $canvas.attr('height', windowHeight);
    var canvas = $canvas[0];
    ctx = canvas.getContext('2d');
    
    world.ctx = ctx;

    world.ctx.fillStyle = '#3B444B';
	//ctx.shadowBlur=2;
	//ctx.shadowColor="black";

    //Paint the walls
    world.ctx.fillRect(0, 0, windowWidth, 10);
    world.ctx.fillRect(0, windowHeight-10, windowWidth, 10);

    //Paint the bars
    world.ctx.fillRect(bars.leftBar[0], bars.leftBar[1], bars.leftBar[2], bars.leftBar[3]);
    world.ctx.fillRect(bars.rightBar[0], bars.rightBar[1], bars.rightBar[2], bars.rightBar[3]);
    
    //Paint the ball
	//world.ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
	//world.ctx.fill();

	//Start moving the ball
    requestAnimationFrame(moveObjects);

}

world.reset = function()
{
    location.reload();
}

//The bars
var bars = {

	leftBar: [0, windowHeight/2-(150/2), 10, 150],
	rightBar: [windowWidth-10, windowHeight/2-(150/2), 10, 150]
}

//The ball
var ball = {

	r: 10,
	x: windowWidth/2-(10/2),
	y: windowHeight/2-(10/2),
	dx: 9,
	dy: 9,
	bouncedFromObstacle: 0
}

//The particles
var particles = {

    circles:[],
	r: 2,
	alpha: 1.0,
	intensity: 1
}

//The levels
//Only one block
var levels = {

	levelUpdated: 0,
	currentLevel: 0,
	//0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
	levels: [ [[]], [[(windowWidth/3), windowHeight/2-50, 10, 100], [windowWidth-(windowWidth/3), windowHeight/2-50, 10, 100]], [[(windowWidth/3), (windowHeight/2-50)-100, 10, 100], [windowWidth-(windowWidth/3), (windowHeight/2-50)+100, 10, 100]], [[(windowWidth/3), (windowHeight/2-50)+100, 10, 100], [windowWidth-(windowWidth/3), (windowHeight/2-50)-100, 10, 100]], [[(windowWidth/3), windowHeight-100, 10, 100], [windowWidth-(windowWidth/3), windowHeight-100, 10, 100]], [[(windowWidth/3), 0, 10, 100], [windowWidth-(windowWidth/3), 0, 10, 100]], [[(windowWidth/3), 0, 10, 100], [windowWidth-(windowWidth/3), windowHeight-100, 10, 100]], [[(windowWidth/3), windowHeight-100, 10, 100], [windowWidth-(windowWidth/3), 0, 10, 100]], [[windowWidth/2, 0, 10, 100], [windowWidth/2, windowHeight-100, 10, 100]], /*moving*/[[windowWidth/2, 0, bars.leftBar[2], bars.leftBar[3]]]/**/ ]
	//[[windowWidth/2-(5), windowHeight/2-50, 10, 100]]
	//levels: [[[]], [[windowWidth/2-(5), windowHeight/2-(bars.leftBar[3]/2), 10, windowHeight]]]
}

function moveObjects()
{
	world.ctx.clearRect(0, 10, windowWidth, windowHeight-20);

	ctx.fillStyle = "rgba(59, 68, 75, 1.0)";

    //Paint the bars
    bars.leftBar[1] = world.mouseY-(100/2);
    bars.rightBar[1] = world.mouseY-(100/2);

    world.ctx.fillRect(bars.leftBar[0], bars.leftBar[1], bars.leftBar[2], bars.leftBar[3]);
    world.ctx.fillRect(bars.rightBar[0], bars.rightBar[1], bars.rightBar[2], bars.rightBar[3]);

    if (gameStarted == 0)
    {
    	ball.x = bars.leftBar[2]+ball.r+5;
    	ball.y = world.mouseY-(ball.r/2);

	    //Paint the ball
	    world.ctx.beginPath();
	    world.ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
	    world.ctx.fill();
	    world.ctx.closePath();
    }
    else
    {
    	ball.x += ball.dx;
    	ball.y += ball.dy;

	    //Paint the ball
	    world.ctx.beginPath();
	    world.ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
	    world.ctx.fill();
	    world.ctx.closePath();
    }

    detectCollision();
    updateScore();

    requestAnimationFrame(moveObjects);
}

function detectCollision()
{
	//Ball and walls collision
	if (ball.y >= windowHeight-15 || ball.y <= 15)
	{
		ball.dy = -ball.dy;
	}

	//Ball and bars collision
	//Check if the ball hits one of the bar's x and ball's y is within the bar's y and height
	if ((ball.x >= bars.rightBar[0]-5 && (ball.y>bars.rightBar[1] && ball.y<bars.rightBar[1]+bars.rightBar[3])) || (ball.x <= bars.leftBar[2]+5 && (ball.y>bars.leftBar[1] && ball.y<bars.leftBar[1]+bars.leftBar[3])))
	{
		ball.dx = -ball.dx;

		if (ball.bouncedFromObstacle == 0)
		{
			score++;
	
			if (Math.abs(ball.dx) < 17)
			{
				if (ball.dx > 0)
					ball.dx = ball.dx+0.1;
				else
					ball.dx = ball.dx-0.1;
			}

			if (Math.abs(ball.dy) < 17)
			{
				if (ball.dy > 0)
					ball.dy = ball.dy+0.1;
				else
					ball.dy = ball.dy-0.1;
			}
		}

		ball.bouncedFromObstacle = 0;

		//if (particles.circles.length == 0)
			//burstEffect(ball.x, ball.y);
	}

	//Ball's out
	else if (ball.x > windowWidth || ball.x < 0)
		world.reset();

	//Ball and obstacles collision
	var obstacles = levels.levels[levels.currentLevel];
	for (var i=0; i<obstacles.length; i++)
	{
		var obstacle = obstacles[i];
		var x = obstacle[0];
		var y = obstacle[1];
		var width = obstacle[2];
		var height = obstacle[3];

		if ((ball.x>x-5 && ball.x<x+width+10) && (ball.y>=y && ball.y<=y+height))
		{
			ball.dx = -ball.dx;
			ball.bouncedFromObstacle = 1;
		}
	}

	if (particles.circles.length > 0)
		burstEffect();

	//Update level
	if (levels.currentLevel<10)
	{
		if (score>0 && score%5 == 0 && levels.levelUpdated == 0)
		{
			levels.levelUpdated = 0;
			levels.currentLevel++;
			levels.levelUpdated = 1;

			$('.popup').html("Level " + levels.currentLevel);
			$('.popup').fadeIn(400).delay(500).fadeOut(400);
		}
		else if (score>0 && (score+1)%5 == 0)
		{

			levels.levelUpdated = 0;
		}
		paintLevels(levels.levels[levels.currentLevel]);
	}
}

function paintLevels(level)
{
	levels.levels[9][0][1] = bars.leftBar[1];

	for (var i=0; i<level.length; i++)
	{
		if (i == 1)
		{
			//levels.levels[levels.currentLevel][i][0] = bars.leftBar[0];
			//levels.levels[levels.currentLevel][i][1] = bars.leftBar[1];
						
		}
		var obstacle = level[i];
		world.ctx.fillRect(obstacle[0], obstacle[1], obstacle[2], obstacle[3]);
	}
}

function burstEffect(x, y)
{
	if (particles.circles.length == 0)
	{
		for (var i=0; i<20; i++)
		{
			console.log(x + " = " + windowWidth);

			if (x > windowWidth/2)
				var startX = x-20;
			else if (x < windowWidth/2)
				var startX = x+20;

			var endX = x;

			if (i < 10)
				endY = y+10;

			var startY = y;
			var endY = y+20;

			var randX = getRandomInt(startX, endX);
			var randY = getRandomInt(startY, endY);

			particles.circles.push([randX, randY]);
		}

		particles.alpha = 1.0;
	}
	else
	{
		particles.alpha = particles.alpha - (0.07);

		console.log(particles.alpha);
	}

	ctx.fillStyle = "rgba(59, 68, 75," + particles.alpha + ")";

	for (var i=0; i<particles.circles.length; i++)
	{
		var circle = particles.circles[i];

		if (i > 10)
		{
			if (ball.x > windowWidth/2)
				circle[0] -= 0.6;
			else if (ball.x < windowWidth/2)
				circle[0] += 0.6;
		}
		else
		{
			if (ball.x > windowWidth/2)
				circle[0] -= 0.2;
			else if (ball.x < windowWidth/2)
				circle[0] += 0.2;
		}


		if (ball.dy < 0)
			circle[1] -= 0.3;
		else
			circle[1] += 0.3;

		var circleX = circle[0];
		var circleY = circle[1];

	    //Paint the ball
	    world.ctx.beginPath();
	    world.ctx.arc(circleX, circleY, particles.r, 0, Math.PI*2);
	    world.ctx.fill();
	    world.ctx.closePath();
	}

	if (particles.alpha <= 0)
		particles.circles = [];
}

function updateScore()
{
	$('#score').html(score);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Animation function
window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
    window.setTimeout(callback, 100 / 40);
};
})();

//Mouse coordinates
$(document).mousemove(function(e) {
    
    world.mouseX = e.pageX;
    world.mouseY = e.pageY;
}).mouseover(); 

//Document onload function
$(document).ready(function () {

   	//Mouse click
	$("#gameDiv").click(function(){

			$('.popup').html("Level " + levels.currentLevel);
			$('.popup').fadeIn(400).delay(500).fadeOut(400);

	    gameStarted = 1;

	});

	world.setup();
});