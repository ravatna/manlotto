<?php  
namespace App\Services;

use \Mobicms\Captcha\Captcha;

class CaptchaService
{

	public static function get(){

		$captcha = new Captcha();
		$captcha->width = 200;
		$captcha->height = 50;
		$captcha->fontSize = 24;

		$captcha->lenghtMin = 4;
		$captcha->lenghtMax = 4;

		$captcha->customFonts = [
			'tonight.ttf' => ['size' => 28, 'case' => 0]
		];

		$captcha->letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

		$code = $captcha->generateCode();
		$_SESSION['code'] = $code;
        return $captcha->generateImage($code);
    }

    public static function verify($code){

    	if(isset($_SESSION['code'])){
    		return $code == $_SESSION['code'];
    	}
    	
    	return false;
    }

}
?>