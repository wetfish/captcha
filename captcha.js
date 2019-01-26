function captcha()
{

    var bg;
    var left;
    var right;

    this.CaptchaElement = 
    {
        canvas : document.createElement('canvas'),
        initialize : function()
        {
            this.canvas.width = 420;
            this.canvas.height = 240;
            this.context = this.canvas.getContext("2d");
            document.body.appendChild(this.canvas);
            this.refreshrate = setInterval(updateCanvas, 24);
        },
        clear : function() 
        {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    function layer()
    {
        this.sprite = new Image();
        this.update = function()
        {
            if (this.left)
            { 
                x -= speed;
            }
            else
            { 
                x += speed;
            }
            ctx = captchaElement.context;
            ctx.drawImage(this.sprite, x, y);
        }
    }

    function updateCanvas() 
    {
        CaptchaElement.clear();
        bg.update();
        left.update();
        right.update();
    }
    CaptchaElement.initialize();

    var xhr = new XMLHttpRequest();
    xhr.open('GET', "./captcha.php", true);
    xhr.send();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState == 4 && xhr.status == 200)
        {
            
        }
    }
}
