function captcha()
{
    var maxFrameRate = 25;

    var background = document.getElementById("bglayer");
    var left = 
    {
        layer : document.getElementById("left"),
        x : 0 //x position of bottom-leftmost pixel of the orignal layer on the canvas
    };
    var right = 
    {
        layer: document.getElementById("right"),
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
        initialize : function()
        {
            canvas = document.createElement('canvas');
            canvas.width = 420;
            canvas.height = 240;
            context = canvas.getContext("2d");
            document.body.prepend(canvas);
            this.update();
        },
        update : function()
        {
            setTimeout(function()
            {
                left.x -= 2;
                right.x += 2;

                if(left.x<=-420){left.x = -1;}
                if(right.x>=420){right.x = 1;}

                context.drawImage(background, 0, 0);

                context.drawImage(left.layer, -left.x, 0, 420+left.x, 240, 0, 0, 420+left.x, 240);
                context.drawImage(left.layer, 0, 0, -left.x, 240, 420+left.x, 0, -left.x, 240);

                context.drawImage(right.layer, 420-right.x, 0, right.x, 240, 0, 0, right.x, 240);
                context.drawImage(right.layer, 0, 0, 420-right.x, 240, right.x, 0, 420-right.x, 240);

                requestAnimationFrame(canvasElement.update);
            }, 1000/maxFrameRate);
        }
    }
    canvasElement.initialize();



    // var xhr = new XMLHttpRequest();
    // xhr.open('GET', "/captcha.php", true);
    // xhr.send();
    // xhr.onreadystatechange = function()
    // {
    //     if (xhr.readyState == 4 && xhr.status == 200)
    //     {   
    //         var reader = new FileReader();
    //         var response = JSON.parse(xhr.responseText);
            
    //         bg = reader.readAsDataURL(response.background);
    //         left = layer(reader.readAsDataURL(response.left), true);
    //         right = layer(reader.readAsDataURL(response.right), false);
    //     }
    // }
}
