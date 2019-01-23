<?php
final class captcha{

//This class requires a session to be created on the page and does not create its own

    function __construct(){
        if (!isset($_SESSION[$randomID])) generateID();
        Header("Content-type: json");
        echo json_encode($_SESSION[$randomID['fish']]);
        $_SESSION[$mousePosition] = ['x' => $_GET["x"], 'y' => $_GET["y"]];
    }

    private function generateID(){
        $generatedID =
        [
            'challenge' => null, // Possible options: smallest, biggest, striped
            'generated_at' => date('m/d/Y h:i:s', time()),
            'fish' =>
            [
                ['size' => 1, 'trait' => 'none', 'x' => 20, 'y' => 40, 'left' => true],
                ['size' => 3, 'trait' => 'striped', 'x' => 10, 'y' => 60, 'left' => true],
                ['size' => 2, 'trait' => 'gradient', 'x' => 20, 'y' => 90, 'left' => false],
                ['size' => 4, 'trait' => 'none', 'x' => 50, 'y' => 10, 'left' => true],
                ['size' => 2, 'trait' => 'fast', 'x' => 80, 'y' => 20, 'left' => false],
            ]
        ];

        switch (rand(0,99)%3){
            case 0:
                $generatedID['challenge'] = 'smallest';
            case 1:
                $generatedID['challenge'] = 'largest';
            case 2:
                $generatedID['challenge'] = 'striped';
        }
        
        return $generatedID;
    }
}
    
?>