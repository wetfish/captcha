function captcha()
{
    var pixelsPerSec = 50.0; //$pixelsPerSec must equal this number in captcha.php

    var background = new Image();
    var left = 
    {
        layer : new Image(),
        x : 0 //x pos of bottom-leftmost pixel of layer
    };
    var right = 
    {
        layer: new Image(),
        x : 0
    };

    var canvas;
    var context;

    this.canvasElement = 
    {
        initialize : function()
        {
            var captchaDiv = document.getElementById("captcha"); //find <div> block to insert canvas
            canvas = document.createElement("canvas"); //initialize canvas
            canvas.width = 420;
            canvas.height = 240;
            context = canvas.getContext("2d"); //initialize context to draw to

            canvas.setAttribute("onmousemove", "updateCoords(event)"); //tracks mouse position
            canvas.setAttribute("onmousedown", "useNet(event)"); //handles when a user starts to drag net
            canvas.setAttribute("onmouseup", "dropNet(event)"); //handles when user stops dragging net
            canvas.setAttribute("onmouseleave", "dropNet(event)"); //drops net if user enters/leaves element
            canvas.setAttribute("onmouseenter", "dropNet(event)");

            canvas.setAttribute("ontouchmove", "updateCoords(event)"); //same as above, but for touch events
            canvas.setAttribute("ontouchstart", "useNet(event)");
            canvas.setAttribute("ontouchend", "dropNet(event)");
            canvas.setAttribute("ontouchcancel", "dropNet(event)");
            
            captchaDiv.append(canvas); //insert canvas into page

            this.lastUpdate = Date.now(); //initialize data for animation loop
            var tick = setInterval(canvasElement.update, 40); //start animation loop
        },
        update : function()
        {
            var now = Date.now(); //handle delta time
            var dt = now - canvasElement.lastUpdate;
            canvasElement.lastUpdate = now;

            left.x -= 50.0*dt/1000; //update positions of layers
            right.x += 50.0*dt/1000;

            if(left.x<=-420){left.x = -1;}
            if(right.x>=420){right.x = 1;}

            context.drawImage(background, 0, 0); //draw all layers

            context.drawImage(left.layer, -left.x, 0, 420+left.x, 240, 0, 0, 420+left.x, 240);
            context.drawImage(left.layer, 0, 0, -left.x, 240, 420+left.x, 0, -left.x, 240);

            context.drawImage(right.layer, 420-right.x, 0, right.x, 240, 0, 0, right.x, 240);
            context.drawImage(right.layer, 0, 0, 420-right.x, 240, right.x, 0, 420-right.x, 240);
        }
    }

    var challengeXHR = new XMLHttpRequest(); //initial request to server to generate and begin challenge
    challengeXHR.open('GET', "/captcha.php", true); //will call captcha.php with no parameters
    challengeXHR.send(); //sends request
    challengeXHR.onreadystatechange = function() //listening for response
    {
        if (challengeXHR.readyState == 4 && challengeXHR.status == 200) //if response is valid
        {
            var response = JSON.parse(challengeXHR.responseText); //parse response as a json
            
            background.src = response.background; //extract image data from parsed json
            left.layer.src = response.left;
            right.layer.src = response.right;
        }
    }

    canvasElement.initialize(); //build the challenge

    
}

var user = 
{
    x : 0,
    y : 0,
    net : false //is user dragging net
}

function updateCoords(event)
{
    if(event.type == 'mousemove') //checks if interaction is with a mouse cursor or touch event
    {
        user.x = event.offsetX;
        user.y = event.offsetY;
    }
    else
    {
        user.x = event.touches[0].offsetX;
        user.Y = event.touches[0].offsetY;
    }
}

function useNet(event)
{
    user.net = true;
}

function dropNet(event)
{
    user.net = false;
}