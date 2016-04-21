/*
//  Ping Pong
//  pingPong.js
//  Created by Ashish Gogna on 4/19/16.
*/

//Global variables
var windowWidth = $(window).width();
var windowHeight = $(window).height();

var gameStarted = 0;

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
    //location.reload();
}

var bars = {

	leftBar: [0, windowHeight/2-(150/2), 10, 150],
	rightBar: [windowWidth-10, windowHeight/2-(150/2), 10, 150]
}

var ball = {

	r: 10,
	x: windowWidth/2-(10/2),
	y: windowHeight/2-(10/2),
	dx: 9,
	dy: 9,
	hitX:0,
	hitY:0
}

var particles = {

    circles:[],
	r: 2
}

function moveObjects()
{
	world.ctx.clearRect(0, 10, windowWidth, windowHeight-20);

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

		if (particles.circles.length == 0)
			burstEffect(ball.x, ball.y);
	}

	//Ball's out
	else if (ball.x > windowWidth || ball.x < 0)
		world.reset();

	if (particles.circles.length > 0)
		burstEffect();
}

function burstEffect(x, y)
{
	if (particles.circles.length == 0)
	{
		for (var i=0; i<20; i++)
		{
			console.log(x + " = " + windowWidth);

			if (x > windowWidth/2)
				var startX = x-30;
			else if (x < windowWidth/2)
				var startX = x+30;

			var endX = x;

			if (i < 10)
			{
				endY = y+10;
			}

			var startY = y;
			var endY = y+30;

			var randX = getRandomInt(startX, endX);
			var randY = getRandomInt(startY, endY);

			particles.circles.push([randX, randY]);
		}
	}

	for (var i=0; i<particles.circles.length; i++)
	{
		var circle = particles.circles[i];
		
		var circleX = circle[0];
		var circleY = circle[1];

	    //Paint the ball
	    world.ctx.beginPath();
	    world.ctx.arc(circleX, circleY, particles.r, 0, Math.PI*2);
	    world.ctx.fill();
	    world.ctx.closePath();
	}
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

	    gameStarted = 1;
	});

	world.setup();
});