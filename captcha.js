var user = //information for drawing the net
{
    inFrame : false, //is cursor inside canvas
    x : 0,
    y : 0,
    usingNet : false //is user dragging net
}

function updateCoords(event) //UI trigger for updating net location
{
    if(event.type == 'mousemove') //checks if interaction is with a mouse cursor or touch event
    {
        user.x = event.offsetX; //mouse movement event
        user.y = event.offsetY;
    }
    else //handles touch events for mobile
    {
        user.x = event.touches[0].clientX; //grabs coords for 1st touch point
        user.y = event.touches[0].clientY;
    }
}

function useNet(event) //UI trigger for clicking while mouse in canvas
{
    user.usingNet = true;
    user.inFrame = true;
}

function dropNet(event, inframe) //UI trigger for not clicking and leaving canvas
{
    user.usingNet = false;
    user.inFrame = inframe;
}

function captcha() //the actual captcha 'class' 
{
    var pixelsPerSec = 65.0; //$pixelsPerSec must equal this number in captcha.php
    var success = false; //if true, triggers success state on next update
    var failTimeout = 10000; //timeout in milliseconds
    var printInstructions = true; //if true, will insert plaintext instructions beneath captcha
    var fail = false; //if true, triggers fail state on next update

    var background = new Image(); //initialize image data
    var welcome = new Image();
    var successImg = new Image();
    var failImg = new Image();
    var left = 
    {
        layer : new Image(),
        x : 0 //x pos of top-leftmost pixel of layer
    };
    var right = 
    {
        layer: new Image(),
        x : 0 //x pos of top-leftmost pixel of layer
    };
    var net = 
    {
        loose: new Image(),
        drag: new Image()
    }

    var intervals = //timing events for challenge
    {
        tick: null, //updates/animates canvas
        check: null, //pings server for success state
        timeout: null //fails attempt after a time
    }

    var canvas; //canvas DOM element
    var context; //canvas drawing context
    var captchaDiv = document.getElementById("captcha"); //find <div> block to insert and remove canvas

    this.canvasElement = //events that control canvas
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
            if(printInstructions) //insert instructions into page conditionally
            {
                captchaDiv.appendChild(
                    document.createTextNode("<p>Click and hold cursor on fish for 2 seconds to pass captcha!</p>"));
            }

            document.getElementById("canvas").addEventListener("click", canvasElement.start);
            document.getElementById("canvas").addEventListener("touchend", canvasElement.start); 
        },
        update : function()
        {
            var now = Date.now(); //handle delta time
            var dt = now - canvasElement.lastUpdate;
            canvasElement.lastUpdate = now;

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

            if(success)
            {
                context.drawImage(successImg, canvas.width/2-successImg.width/2, canvas.height/2-successImg.height/2); //display checkmark
                clearInterval(intervals.check); //stops pinging for success
                clearInterval(intervals.tick); //stops updating canvas
                clearTimeout(intervals.timeout); //clear fail state
            }

            if(fail)
            {
                context.drawImage(failImg, 0, 0); //display failure message
                
                clearInterval(intervals.check); //stops pinging for success
                clearInterval(intervals.tick); //stops updating canvas
                clearTimeout(intervals.timeout); //reset fail state
                fail = false;

                retrieveChallenge(); //generate new challenge
                left.x = 0;
                right.x = 0;

                document.getElementById("canvas").addEventListener("click", canvasElement.start);
                document.getElementById("canvas").addEventListener("touchend", canvasElement.start); 
            }
        },
        start : function() //runs when canvas is clicked for the first time
        {
            document.getElementById("canvas").removeEventListener("click", canvasElement.start);
            document.getElementById("canvas").removeEventListener("touchstart", canvasElement.start);
            canvasElement.lastUpdate = Date.now(); //initialize data for animation loop
            intervals.tick = setInterval(canvasElement.update, 34); //start animation loop
            checkSuccess(true); //tells php to start
            intervals.check = setInterval(checkSuccess, 100); //check if captcha has been completed
            intervals.timeout = setTimeout(function(){fail = true;}, failTimeout); //sets fail timeout
        }
    }

    initialize(); //called on page load, might move this to a more conspicuous spot later

    async function initialize() //initializes all image variables above and initializes the canvas
    {
        //retrieve known image data
        Promise.all([ //retrieve static assets
            retrieveAsset("welcome.png"),
            retrieveAsset("success.png"),
            retrieveAsset("net1.png"),
            retrieveAsset("net2.png"),
            retrieveAsset("fail.png")
        ])
        .then(function(blobs) //assign static assets
        {
            welcome.src = blobs[0];
            successImg.src = blobs[1];
            net.loose.src = blobs[2];
            net.drag.src = blobs[3];
            failImg.src = blobs[4];
        })
        .then(function()
        {
            retrieveChallenge(); //TODO: figure out why adding this to a promise chain freezes the chain, despite appearing to complete successfully
            canvasElement.initialize(); //build the challenge
            welcome.onload = function(){ context.drawImage(welcome, 0, 0); }; //draws the welcome image
        })
        .catch(function(error){ console.log(error); });
    }

    function retrieveAsset(assetName) //retrieve static assets
    {
        var request = new Request('captcha-assets/'+assetName); //initialize request
        
        return fetch(request) //fetches, then later returns blob url for asset
        .then(function(response)
        {
            return response.blob(); //extracts blob
        })
        .then(function(blob)
        {
            return URL.createObjectURL(blob); //generates url
        });
    }

    function retrieveChallenge() //retrieve generated image data
    {
        var challengeXHR = new XMLHttpRequest(); //initial request to server to generate and begin challenge
        challengeXHR.withCredentials = true;
        challengeXHR.open('GET', "/captcha.php?new='true'", true); //will call captcha.php with no parameters
        challengeXHR.send(); //sends request
        challengeXHR.onreadystatechange = function() //listening for response
        {
            if(challengeXHR.readyState == 4 && challengeXHR.status == 200) //if response is valid
            {
                var response = JSON.parse(challengeXHR.responseText); //parse response as a json
                background.src = response.background; //extract image data from parsed json
                left.layer.src = response.left;
                right.layer.src = response.right;
            }
        }   
    }

    function checkSuccess(first) //ping server for success state
    {
        if(user.usingNet || first){ //only calls if user is actively attempting solution
            var successXHR = new XMLHttpRequest(); //request to server to check for a success
            successXHR.withCredentials = true;
            successXHR.open('GET', "/captcha.php?x="+user.x+"&y="+user.y, true); //will call captcha.php with user data
            successXHR.send(); //sends request
            successXHR.onreadystatechange = function() //listening for response
            {
                if(successXHR.readyState == 4 && successXHR.status == 200) //if response is valid
                {
                    success = successXHR.responseText == "true"; //checks for success response from server
                }
            }
        }
    }
}
