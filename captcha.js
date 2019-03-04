function captcha()
{
    var pixelsPerSec = 50.0; //$pixelsPerSec must equal this number in captcha.php
    var success = false;

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
    var nets = 
    {
        loose: new Image(),
        drag: new Image()
    }

    var intervals = 
    {
        tick: null,
        check: null
    }

    var canvas;
    var context;
    var captchaDiv = document.getElementById("captcha"); //find <div> block to insert and remove canvas

    this.canvasElement = 
    {
        initialize : function()
        {
            canvas = document.createElement("canvas"); //initialize canvas
            canvas.width = 420;
            canvas.height = 240;
            context = canvas.getContext("2d"); //initialize context to draw to

            canvas.setAttribute("id", "canvas");

            canvas.setAttribute("onmousemove", "updateCoords(event)"); //tracks mouse position
            canvas.setAttribute("onmousedown", "useNet(event)"); //handles when a user starts to drag net
            canvas.setAttribute("onmouseup", "dropNet(event, true)"); //handles when user stops dragging net
            canvas.setAttribute("onmouseleave", "dropNet(event, false)"); //drops net if user enters/leaves element, and sets to invisible
            canvas.setAttribute("onmouseenter", "dropNet(event, true)"); //drops net and sets to visible

            canvas.setAttribute("ontouchmove", "updateCoords(event)"); //same as above, but for touch events
            canvas.setAttribute("ontouchstart", "useNet(event)");
            canvas.setAttribute("ontouchend", "dropNet(event, false)");
            canvas.setAttribute("ontouchcancel", "dropNet(event, false)");
            
            captchaDiv.append(canvas); //insert canvas into page

            this.lastUpdate = Date.now(); //initialize data for animation loop
            intervals.tick = setInterval(canvasElement.update, 40); //start animation loop
            intervals.check = setInterval(checkSuccess, 2000); //check if captcha has been completed
        },
        update : function()
        {
            var now = Date.now(); //handle delta time
            var dt = now - canvasElement.lastUpdate;
            canvasElement.lastUpdate = now;

            if(success)
            {
                clearInterval(intervals.check);
                clearInterval(intervals.tick);
                captchaDiv.removeChild(document.getElementById("canvas"));
                captchaDiv.append(document.createTextNode("Success!"));
            }

            left.x -= pixelsPerSec*dt/1000; //update positions of layers
            right.x += pixelsPerSec*dt/1000;

            if(left.x<=-420){left.x = -1;}
            if(right.x>=420){right.x = 1;}

            context.drawImage(background, 0, 0); //draw all layers

            context.drawImage(left.layer, -left.x, 0, 420+left.x, 240, 0, 0, 420+left.x, 240);
            context.drawImage(left.layer, 0, 0, -left.x, 240, 420+left.x, 0, -left.x, 240);

            context.drawImage(right.layer, 420-right.x, 0, right.x, 240, 0, 0, right.x, 240);
            context.drawImage(right.layer, 0, 0, 420-right.x, 240, right.x, 0, 420-right.x, 240);

            if(user.inframe)
            {
                if(user.net) context.drawImage(nets.drag, user.x-nets.drag.width/2, user.y-nets.drag.height/3);
                else context.drawImage(nets.loose, user.x-nets.loose.width/2, user.y-nets.drag.height/3);
            }
        }
    }

    function checkSuccess() 
    {
        var successXHR = new XMLHttpRequest(); //request to server to check for a success
        successXHR.withCredentials = true;
        successXHR.open('GET', "/captcha.php?x="+user.x+"&y="+user.y+"&net="+user.net, true); //will call captcha.php with user data
        successXHR.send(); //sends request
        successXHR.onreadystatechange = function() //listening for response
        {
            if (successXHR.readyState == 4 && successXHR.status == 200) //if response is valid
            {
                success = successXHR.responseText == "true";
            }
        }
    }

    var challengeXHR = new XMLHttpRequest(); //initial request to server to generate and begin challenge
    challengeXHR.withCredentials = true;
    challengeXHR.open('GET', "/captcha.php?new=\'true\'", true); //will call captcha.php with no parameters
    challengeXHR.send(); //sends request
    challengeXHR.onreadystatechange = function() //listening for response
    {
        if (challengeXHR.readyState == 4 && challengeXHR.status == 200) //if response is valid
        {
            var response = JSON.parse(challengeXHR.responseText); //parse response as a json
            
            background.src = response.background; //extract image data from parsed json
            left.layer.src = response.left;
            right.layer.src = response.right;
            nets.loose.src = response.loose;
            nets.drag.src = response.drag;
        }
    }

    canvasElement.initialize(); //build the challenge    
}

var user = 
{
    inframe : false,
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
    user.inframe = true;
}

function dropNet(event, inframe)
{
    user.net = false;
    user.inframe = inframe;
}