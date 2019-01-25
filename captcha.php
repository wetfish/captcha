<?php
final class captcha{

//This class requires a session to be created on the page and does not create its own

    function __construct(){
        if (!isset($_SESSION[$randomID])) generateID();
        Header("Content-type: image/png");
        generateCaptcha();
        $_SESSION[$mousePosition] = ['x' => $_GET["x"], 'y' => $_GET["y"]];
    }

    private function generateID(){
        $generatedID = [
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

        switch (rand(0,99)%3){
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
        
        return $generatedID;
    }

    private function generateCaptcha(){
        $layers = [
            'bg' => imagecreatefrompng('./bglayer'),
            'left' => imagecreatetruecolor(420, 240),
            'right' => imagecreatetruecolor(420, 240)
        ];
        $fishes = [
            'normal' => imagecreatefrompng('./normal'),
            'striped' => imagecreatefrompng('./stripe')
        ];
        $font = imageloadfont('./dpcommic.ttf');
        $textColor = imagecolorallocate($bg, 160, 15, 150);
        $fish_w = 96;
        $fish_h = 54;

        imagestring($bg, $font, 25, 225, "Catch the " . $_SESSION[$randomID['challenge']] . " fish!", $textColor);

        for ($i=1; $i <= 2; $i++) {
            if($i>1)foreach($fishes as $f){imageflip($f, $IMG_FLIP_HORIZONTAL);} 
            foreach($_SESSION[$randomID[$fish]] as $fishy){
                switch(fishy['trait']){
                    case 'none':
                        imagecopy($layers[$i], $normal, fishy['x'], fishy['y'], 0, 0, $fish_w, $fish_h);
                        break;
                    case 'striped':
                        imagecopy($layers[$i], $striped, fishy['x'], fishy['y'], 0, 0, $fish_w, $fish_h);
                        break;
                    case 'big':
                        imagecopyresized($layers[$i], $normal, fishy['x'], fishy['y'], 0, 0, floor($fish_h*1.5), floor($fish_h*1.5),$fish_w, $fish_h);
                        break;
                    case 'dead':
                        $deadfish = imageflip($normal, $IMG_FLIP_VERTICAL);
                        imagecopy($layers[$i], $deadfish, fishy['x'], fishy['y'], 0, 0, $fish_w, $fish_h);
                        break;
                }
            }
        }
        foreach($layers as $img){
            imagepng($img);
            imagedestroy($img);
        }
    }
}
    
?>