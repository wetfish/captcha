function captcha(){

    var fishies;

    this.CaptchaElement = {
        canvas : document.createElement("captcha"),
        initialize : function(){
            this.canvas.width = 350;
            this.canvas.height = 150;
            this.context = this.canvas.getContext("2d");
            document.body.insertBefore(this.canvas, document.body.childNodes[0]);
            this.interval = setInterval(updateCanvas, 20);
        },
        clear : function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    function Fish(x, y, size, left, trait){
        this.x = x;
        this.y = x;
        this.size = size;
        this.left = left;
        this.trait = trait;
        this.sprite = new Image();

        this.speed = 2;
        if(trait == "fast"){this.speed = 4;}

        this.update = function(){
            if (this.left){ x -= speed;}
            else{ x += speed;}
            ctx = captchaElement.context;
            ctx.drawImage(this.sprite, x, y);
        }
    }

    function updateCanvas() {
        CaptchaElement.clear();
        for (let i = 0; i < fishies.length; i++) {
            fishies[i].update();
        }
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://wiki.wetfish.net/captcha.php", true);
    xhr.send();
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200){
            var response = JSON.parse(xhr.responseText);
            for (let i = 0; i < response[0].length; i++) {
                const ifish = response[i];
                fishies[i] = Fish(ifish.x, ifish.y, ifish.size, ifish.left, ifish.trait);
            }
        }
    }

    CaptchaElement.initialize();
}
