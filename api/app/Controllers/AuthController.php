<?php  
namespace App\Controllers;

use App\Controllers\Controller;

use App\Models\User;

use App\Services\CaptchaService;
use App\Services\AuthService;
use App\Services\CreditService;

class AuthController extends Controller
{

	public function login($request, $response, $args){
        $input = $request->getParsedBody();
		
		/*if(!CaptchaService::verify($input['scr_code'])){
			return $response->withJson([
				'result' 	=> 'error-scr',
				'filed' 	=> 'scr_code',
				'errorText' => 'รหัสป้องกันไม่ถูกต้อง'
			]);
		}*/

		$Auth = new AuthService();
		
		if($Auth->login($input['username'], $input['password'], $input['remember'])){
			return $this->current_login($request, $response, $args);
		}else{
			return $response->withJson([
				'result' 	=> 'error',
				'errorText' => $Auth->error_text()
			]);
		}
    }
    
    public function current_login($request, $response, $args){
		$Auth = new AuthService();
        if($Auth->is_login()){

        	$profile = [
				'role' 			=> $Auth->current_login('user_role'),
				'fullname' 		=> $Auth->current_login('fullname'),
				'credit' 		=> $Auth->current_login('credit'),
				'balance' 		=> $Auth->current_login('balance'),
				'last_login' 	=> $Auth->current_login('last_login'),
				'member_url' 	=> $Auth->role_url()
			];

			if($Auth->is_agent()){
				$profile['credit_balance'] = CreditService::credit_balance();
				$profile['used_credit'] = CreditService::used_credit();
			}
			
            return $response->withJson([
				'result' 	=> 'success',
				'profile' 	=> $profile
			]);
        }

        return $response->withJson([
            'result' 	=> 'error',
            'profile' 	=> null
        ]);
	}
	
	public function profile($request, $response, $args){
		$Auth = new AuthService();
        if($Auth->is_login()){
            return $response->withJson([
				'result' 	=> 'success',
				'profile' 	=> [
					'username' 		=> $Auth->current_login('username'),
					'fullname' 		=> $Auth->current_login('fullname'),
					'tel' 		=> $Auth->current_login('tel'),
					'line' 		=> $Auth->current_login('line')
				]
			]);
        }

        return $response->withJson([
            'result' 	=> 'error',
            'profile' 	=> null
        ]);
	}

	public function save_profile($request, $response, $args){

		$input = $request->getParsedBody();
		$Update = AuthService::current_login();
		$Update->fullname 	= $input['fullname'];
		$Update->tel 		= $input['tel'];
		$Update->line 		= $input['line'];
		
		if($Update->save()){
			return $response->withJson([
				'result' => 'success'
			]);
		}

		return $response->withJson([
			'result' => 'error'
		]);
	}

	public function save_password($request, $response, $args){
		
		$input = $request->getParsedBody();
		$Account = AuthService::current_login();

		if(!AuthService::check_password($input['old'], $Account->password)){
			return $response->withJson([
				'result' => 'old-error'
			]);
		}

		if(User::update_password($Account->user_id, $input['new'])){
			return $response->withJson([
				'result' => 'success'
			]);
		}

		return $response->withJson([
			'result' => 'error'
		]);
	}

    public function logout($request, $response, $args){
        AuthService::logout();
        return $response->withJson([
            'result' => 'success'
        ]);
    }

}
?>