function captcha()
{
    var pixelsPerSec = 50.0; //$pixelsPerSec must equal this number in captcha.php

    var background = new Image();
    var left = 
    {
        layer : new Image(),
        x : 0 //x position of bottom-leftmost pixel of the orignal layer on the canvas
    };
    var right = 
    {
        layer: new Image(),
        x : 0
    };

    // var user = 
    // {
    //     x,
    //     y
    // }

    var canvas;
    var context;

    this.canvasElement = 
    {
        lastUpdate : Date.now(),
        initialize : function()
        {
            canvas = document.createElement('canvas');
            canvas.width = 420;
            canvas.height = 240;
            context = canvas.getContext("2d");
            document.body.prepend(canvas);
            var tick = setInterval(canvasElement.update, 40);
        },
        update : function()
        {
            var now = Date.now();
            var dt = now - canvasElement.lastUpdate;
            canvasElement.lastUpdate = now;
            left.x -= 50.0*dt/1000; 
            right.x += 50.0*dt/1000;

            if(left.x<=-420){left.x = -1;}
            if(right.x>=420){right.x = 1;}

            context.drawImage(background, 0, 0);

            context.drawImage(left.layer, -left.x, 0, 420+left.x, 240, 0, 0, 420+left.x, 240);
            context.drawImage(left.layer, 0, 0, -left.x, 240, 420+left.x, 0, -left.x, 240);

            context.drawImage(right.layer, 420-right.x, 0, right.x, 240, 0, 0, right.x, 240);
            context.drawImage(right.layer, 0, 0, 420-right.x, 240, right.x, 0, 420-right.x, 240);
        }
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', "/captcha.php", true);
    xhr.send();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState == 4 && xhr.status == 200)
        {
            var response = JSON.parse(xhr.responseText);
            
            background.src = response.background;
            left.layer.src = response.left;
            right.layer.src = response.right;
        }
    }

    canvasElement.initialize();
}
