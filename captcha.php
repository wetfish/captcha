<?php
//This class requires a session to be created on the page and does not create its own

session_start(); //temporary session for testing purposes
$captcha = new captcha(); //temporary constructor for testing purposes

class captcha
{
    function __construct()
    {   
        $_SESSION['randomID']=$this->generateID();
        $this->generateCaptcha();
        if(!isset($_SESSION['randomID'])) //checks to see if the captcha has already been created
        {
            
            
        } 
        else //if session has been created, it polls for the mouse position and checks to see if the success condition has been met yet
        {
            //$_SESSION['mousePosition'] = ['x' => $_GET["x"], 'y' => $_GET["y"]];
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
                ['size' => 1, 'trait' => 'none', 'x' => 300, 'y' => 40, 'left' => true],
                ['size' => 3, 'trait' => 'striped', 'x' => 10, 'y' => 60, 'left' => true],
                ['size' => 2, 'trait' => 'none', 'x' => 200, 'y' => 90, 'left' => false],
                ['size' => 4, 'trait' => 'none', 'x' => 100, 'y' => 10, 'left' => true],
                ['size' => 2, 'trait' => 'dead', 'x' => 30, 'y' => 20, 'left' => false],
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
        return $generatedID;
    }

    private function generateCaptcha()
    {
        $fishImages = 
        [
            0 => imagecreatefrompng('./normal.png'),
            1 => imagecreatefrompng('./stripe.png')
        ];
        $layers = 
        [
            0 => imagecreatefrompng('./bglayer.png'),
            1 => imagecreatetruecolor(420, 240),
            2 => imagecreatetruecolor(420, 240)
        ];

        //imagettfbox(30, 0, './dpcomic.ttf', "Catch the " . $_SESSION['randomID']['challenge'] . " fish!");
        $textColor = imagecolorallocate($layers[0], 160, 15, 150);
        $font = imagettftext($layers[0], 30, 0, 20, 220, $textColor, './dpcomic.ttf', "Catch the " . $_SESSION['randomID']['challenge'] . " fish!");

        
        for($i=1; $i <= 2; $i++) 
        {   
            imagealphablending($layers[$i],false);
            $transparency = imagecolorallocatealpha($layers[$i], 0, 0, 0, 127);
            imagefilledrectangle($layers[$i], 0, 0, 420, 240, $transparency);
            imagealphablending($layers[$i],true);
            imagesavealpha($layers[$i], true);
            
            if($i>1)
            {
                for($j=0; $j<count($fishImages); $j++)
                {
                    imageflip($fishImages[$j], IMG_FLIP_HORIZONTAL);
                }
            } 
            foreach($_SESSION['randomID']['fish'] as $fishy)
            {
                if($i==1 && !$fishy['left'])
                {
                    $this -> drawFish($fishImages, $layers[$i], $fishy);
                }
                if($i==2 && $fishy['left'])
                {
                    $this -> drawFish($fishImages, $layers[$i], $fishy);
                }
            }
            
        }
        Header("Content-type: application/json");
        $response_json = array
        (
            'background' => captcha::getLayerBase64($layers[0]),
            'right' => captcha::getLayerBase64($layers[1]),
            'left' => captcha::getLayerBase64($layers[2])
        );
        echo json_encode($response_json);
    }

    private function drawFish($fishImages, $layer, $fishy){
        $fish_width = 96;
        $fish_height = 54;
        switch($fishy['trait'])
        {
            case 'none':
                imagecopy($layer, $fishImages[0], $fishy['x'], $fishy['y'], 0, 0, $fish_width, $fish_height);
                break;
            case 'striped':
                imagecopy($layer, $fishImages[1], $fishy['x'], $fishy['y'], 0, 0, $fish_width, $fish_height);
                break;
            case 'big':
                imagecopyresized($layers, $fishImages[0], $fishy['x'], $fishy['y'], 0, 0,
                floor($fish_height*1.5), floor($fish_height*1.5),$fish_width, $fish_height);
                break;
            case 'dead':
                imageflip($fishImages[0], IMG_FLIP_VERTICAL);
                imagecopy($layer, $fishImages[0], $fishy['x'], $fishy['y'], 0, 0, $fish_width, $fish_height);
                imageflip($fishImages[0], IMG_FLIP_VERTICAL);
                break;
        }
    }

    private static function getLayerBase64($img){
        ob_start(); 
        imagepng($img);
        $data = base64_encode(ob_get_contents());
        ob_end_clean();
        imagedestroy($img);
        return 'data:image/png;base64,' . $data;
    }

    private function checkSuccess()
    {

    }
}

?>