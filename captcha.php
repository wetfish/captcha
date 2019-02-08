<?php
//This class requires a session to be created on the page and does not create its own

session_start(); //temporary session for testing purposes
$captcha = new captcha(); //temporary constructor for testing purposes


class captcha
{
    
    function __construct()
    {   
        if(!isset($_SESSION['randomID'])) //checks to see if the captcha has already been created
        {
            $_SESSION['randomID']=$this->generateID();
            $this->generateCaptcha();
        } 
        else //if session has been created, it polls for the mouse position and checks to see if the success condition has been met yet
        {
            //$_SESSION['mousePosition'] = ['x' => $_GET["x"], 'y' => $_GET["y"]];
            //checkSuccess();
        }
        
    }

    private function generateID()
    {
        $challenges = array('striped', 'dead', 'backwards');
        $traits = array('striped', 'dead', 'backwards', 'none');
        $challenge = $challenges[array_rand($challenges)];
        $generatedID = //instantiate the random data for the captcha
        [
            'challenge' => $challenge,
            'generated_at' => date('m/d/Y h:i:s', time()),
            'fish' =>
            [
                ['trait' => $challenge, 'x' => rand(0,324), 'y' => rand(5,120), 'left' => (bool)rand(0,1)],
                ['trait' => $traits[array_rand($traits)], 'x' => rand(0,324), 'y' => rand(5,120), 'left' => (bool)rand(0,1)],
                ['trait' => $traits[array_rand($traits)], 'x' => rand(0,324), 'y' => rand(5,120), 'left' => (bool)rand(0,1)],
                ['trait' => $traits[array_rand($traits)], 'x' => rand(0,324), 'y' => rand(5,120), 'left' => (bool)rand(0,1)],
                ['trait' => $traits[array_rand($traits)], 'x' => rand(0,324), 'y' => rand(5,120), 'left' => (bool)rand(0,1)],
            ]
        ];
        
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

        $textColor = imagecolorallocate($layers[0], 160, 15, 150);
        $font = imagettftext($layers[0], 30, 0, 15, 220, $textColor, './dpcomic.ttf', "Catch the " . $_SESSION['randomID']['challenge'] . " fish!");

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
            'left' => captcha::getLayerBase64($layers[2]),
            'welcome' => captcha::getLayerBase64(imagecreatefrompng('./welcome.png'))
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
            case 'backwards':
                imageflip($fishImages[0], IMG_FLIP_HORIZONTAL);
                imagecopy($layer, $fishImages[0], $fishy['x'], $fishy['y'], 0, 0, $fish_width, $fish_height);
                imageflip($fishImages[0], IMG_FLIP_HORIZONTAL);
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