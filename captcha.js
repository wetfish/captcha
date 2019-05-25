function captcha()
{
    var pixelsPerSec = 50.0; //$pixelsPerSec must equal this number in captcha.php
    var success = false;

    var background = new Image();
    var welcome = new Image();
    var left = 
    {
        layer : new Image(),
        x : 0 //x pos of bottom-leftmost pixel of layer
    };
    var right = 
    {
        layer: new Image(),
        x : 0 //x pos of bottom-leftmost pixel of layer
    };
    var net = 
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
            canvas.setAttribute("ontouchenter", "dropNet(event, false)");
            canvas.setAttribute("ontouchleave", "dropNet(event, false)");
            
            captchaDiv.append(canvas); //insert canvas into page

            document.getElementById("canvas").addEventListener("click", canvasElement.start);
            document.getElementById("canvas").addEventListener("touchend", canvasElement.start); 
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

            //update positions of layers
            left.x -= pixelsPerSec*dt/1000; 
            right.x += pixelsPerSec*dt/1000;

            if(left.x<=-canvas.width){left.x = -1;}
            if(right.x>=canvas.width){right.x = 1;}
            
            //draw all layers
            context.drawImage(background, 0, 0); 

            context.drawImage(left.layer, -left.x, 0, canvas.width+left.x, canvas.height, 0, 0, canvas.width+left.x, canvas.height);
            context.drawImage(left.layer, 0, 0, -left.x, canvas.height, canvas.width+left.x, 0, -left.x, canvas.height);

            context.drawImage(right.layer, canvas.width-right.x, 0, right.x, canvas.height, 0, 0, right.x, canvas.height);
            context.drawImage(right.layer, 0, 0, canvas.width-right.x, canvas.height, right.x, 0, canvas.width-right.x, canvas.height);

            //draw net
            if(user.inFrame)
            {
                if(user.usingNet) context.drawImage(net.drag, user.x-net.drag.width/2, user.y-net.drag.height/3);
                else context.drawImage(net.loose, user.x-net.loose.width/2, user.y-net.drag.height/3);
            }
        },
        start : function()
        {
            document.getElementById("canvas").removeEventListener("click", canvasElement.start);
            document.getElementById("canvas").removeEventListener("touchstart", canvasElement.start);
            canvasElement.lastUpdate = Date.now(); //initialize data for animation loop
            intervals.tick = setInterval(canvasElement.update, 34); //start animation loop
            checkSuccess(true); //tells php to start
            intervals.check = setInterval(checkSuccess, 100); //check if captcha has been completed
        }
    }

    function checkSuccess(first) 
    {
        if(user.usingNet || first){
            var successXHR = new XMLHttpRequest(); //request to server to check for a success
            successXHR.withCredentials = true;
            successXHR.open('GET', "/captcha.php?x="+user.x+"&y="+user.y, true); //will call captcha.php with user data
            successXHR.send(); //sends request
            successXHR.onreadystatechange = function() //listening for response
            {
                if (successXHR.readyState == 4 && successXHR.status == 200) //if response is valid
                {
                    success = successXHR.responseText == "true";
                }
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
            
            //TODO: make all but left and right be retrieved from webpage
            background.src = response.background; //extract image data from parsed json
            welcome.src = response.welcome;
            left.layer.src = response.left;
            right.layer.src = response.right;
            net.loose.src = response.loose;
            net.drag.src = response.drag;

            context.drawImage(welcome, 0, 0);
        }
    }

    canvasElement.initialize(); //build the challenge    
}

var user = 
{
    inFrame : false,
    x : 0,
    y : 0,
    usingNet : false //is user dragging net
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
        user.x = event.touches[0].clientX;
        user.y = event.touches[0].clientY;
    }
}

function useNet(event)
{
    user.usingNet = true;
    user.inFrame = true;
}

function dropNet(event, inframe)
{
    user.usingNet = false;
    user.inFrame = inframe;
}