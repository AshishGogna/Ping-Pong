/*
//  Ping Pong
//  pingPong.js
//  Created by Ashish Gogna on 4/19/16.
*/

//Global variables
var windowWidth = $(window).width();
var windowHeight = $(window).height();

var gameStarted = 0;

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

    //Paint the walls
    world.ctx.fillRect(0, 0, windowWidth, 10);
    world.ctx.fillRect(0, windowHeight-10, windowWidth, 10);

    //Paint the bars
    world.ctx.fillRect(bars.leftBar[0], bars.leftBar[1], bars.leftBar[2], bars.leftBar[3]);
    world.ctx.fillRect(bars.rightBar[0], bars.rightBar[1], bars.rightBar[2], bars.rightBar[3]);
    
    //Paint the ball
//    world.ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
//    world.ctx.fill();

	//Start moving the ball
    requestAnimationFrame(moveObjects);

}

var bars = {

	leftBar: [0, windowHeight/2-(150/2), 10, 150],
	rightBar: [windowWidth-10, windowHeight/2-(150/2), 10, 150]
}

var ball = {

	r: 10,
	x: windowWidth/2-(10/2),
	y: windowHeight/2-(10/2)
}

function moveObjects()
{
	world.ctx.clearRect(0, 10, windowWidth, windowHeight-20);

    //Paint the bars
    world.ctx.fillRect(bars.leftBar[0], world.mouseY-(100/2), bars.leftBar[2], bars.leftBar[3]);
    world.ctx.fillRect(bars.rightBar[0], world.mouseY-(100/2), bars.rightBar[2], bars.rightBar[3]);

    if (gameStarted == 0)
    {
	    //Paint the ball
	    world.ctx.beginPath();
	    world.ctx.arc(bars.leftBar[2]+ball.r+5, world.mouseY-(ball.r/2), ball.r, 0, Math.PI*2);
	    world.ctx.fill();
	    world.ctx.closePath();
    }

    requestAnimationFrame(moveObjects);
}

//Animation function
window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
    window.setTimeout(callback, 100 / 60);
};
})();

$(document).mousemove(function(e) {
    
    world.mouseX = e.pageX;
    world.mouseY = e.pageY;
}).mouseover(); 

//Document onload function
$(document).ready(function () {

	world.setup();
});