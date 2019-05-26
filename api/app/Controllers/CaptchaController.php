<?php  
namespace App\Controllers;

use App\Controllers\Controller;

use App\Services\CaptchaService;

class CaptchaController extends Controller
{

	public function get($request, $response, $args){
		return $response->withJson([
			'result' => 'success',
			'captcha' => CaptchaService::get()
		]);
	}

}
?>