function captcha()
{

    var bg;
    var left;
    var right;
    const speed = 2;

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

    function layer(layer, left)
    {
        this.layer = layer;
        this.left = left;
        this.x = 0;
        this.update = function()
        {
            if (this.left)
            { 
                this.x -= speed;
            }
            else
            { 
                this.x += speed;
            }
            ctx = captchaElement.context;
            ctx.drawImage(this.sprite, this.x, 60);
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
    xhr.open('GET', "/captcha.php", true);
    xhr.send();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState == 4 && xhr.status == 200)
        {   
            var reader = new FileReader();
            var response = JSON.parse(xhr.responseText);
            
            bg = reader.readAsDataURL(response.background);
            left = layer(reader.readAsDataURL(response.left), true);
            right = layer(reader.readAsDataURL(response.right), false);
        }
    }
}
