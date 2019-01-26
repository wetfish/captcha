<?php
//This class requires a session to be created on the page and does not create its own

session_start(); //temporary session for testing purposes
$captcha = new captcha(); //temporary constructor for testing purposes

class captcha
{
    function __construct()
    {
        echo 'dead for sure';
        if(!isset($_SESSION['randomID'])) //checks to see if the captcha has already been created
        {
            $_SESSION['randomID']=$this->generateID();
            $this->generateCaptcha();
        } 
        else //if session has been created, it polls for the mouse position and checks to see if the success condition has been met yet
        {
            $_SESSION['mousePosition'] = ['x' => $_GET["x"], 'y' => $_GET["y"]];
            //checkSuccess();
        }
        
    }

    private function generateID()
    {
        $generatedID = //instantiate the random data for the captcha
        [
            'challenge' => null, // Possible options: smallest, biggest, striped
            'generated_at' => date('m/d/Y h:i:s', time()),
            'fish' =>
            [
                ['size' => 1, 'trait' => 'none', 'x' => 20, 'y' => 40, 'left' => true],
                ['size' => 3, 'trait' => 'striped', 'x' => 10, 'y' => 60, 'left' => true],
                ['size' => 2, 'trait' => 'none', 'x' => 20, 'y' => 90, 'left' => false],
                ['size' => 4, 'trait' => 'none', 'x' => 50, 'y' => 10, 'left' => true],
                ['size' => 2, 'trait' => 'dead', 'x' => 80, 'y' => 20, 'left' => false],
            ]
        ];

        //this is some pretty stupid randomization that will be replaced with something more sensible
        switch (rand(0,99)%3)
        {
            case 0:
                $generatedID['challenge'] = 'smallest';
                break;
            case 1:
                $generatedID['challenge'] = 'largest';
                break;
            case 2:
                $generatedID['challenge'] = 'striped';
                break;
        }
        Header('Content-type: text');
        return $generatedID;
    }

    private function generateCaptcha()
    {
        $layers = 
        [
            'bg' => imagecreatefrompng('./bglayer.png'),
            'left' => imagecreatetruecolor(420, 240),
            'right' => imagecreatetruecolor(420, 240)
        ];
        $fishes = 
        [
            'normal' => imagecreatefrompng('./normal.png'),
            'striped' => imagecreatefrompng('./stripe.png')
        ];
        $font = imageloadfont('./dpcomic.ttf');
        $textColor = imagecolorallocate($layers['bg'], 160, 15, 150);
        $fish_w = 96;
        $fish_h = 54;

        imagestring($layers['bg'], $font, 25, 225, "Catch the " . $_SESSION['randomID']['challenge'] . " fish!", $textColor);

        for($i=1; $i <= 2; $i++) 
        {
            if($i>1)
            {
                foreach($fishes as $fish)
                {
                    imageflip($fish, IMG_FLIP_HORIZONTAL);
                }
            } 
            foreach($_SESSION['randomID']['fish'] as $fishy)
            {
                switch($fishy['trait'])
                {
                    case 'none':
                        imagecopy($layers[$i], $normal, $fishy['x'], $fishy['y'], 0, 0, $fish_w, $fish_h);
                        break;
                    case 'striped':
                        imagecopy($layers[$i], $striped, $fishy['x'], $fishy['y'], 0, 0, $fish_w, $fish_h);
                        break;
                    case 'big':
                        imagecopyresized($layers[$i], $normal, $fishy['x'], $fishy['y'], 0, 0, floor($fish_h*1.5), floor($fish_h*1.5),$fish_w, $fish_h);
                        break;
                    case 'dead':
                        $deadfish = imageflip($normal, IMG_FLIP_VERTICAL);
                        imagecopy($layers[$i], $deadfish, $fishy['x'], $fishy['y'], 0, 0, $fish_w, $fish_h);
                        break;
                }
            }
        }
        Header("Content-type: image/png");
        foreach($layers as $img)
        {
            imagepng($img);
            imagedestroy($img);
        }
    }

    private function checkSuccess()
    {

    }
}

?>