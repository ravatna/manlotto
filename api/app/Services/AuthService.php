<?php  
namespace App\Services;

use App\Models\User;

use \Firebase\JWT\JWT;
use \Exception;

use App\Configs\MemberConfig;

use App\Services\HttpService;

class AuthService
{

	protected static $key = "agfdsgsryhgfdhgffugjhkuilftstrwfesdgfjrthjfdgh";

	protected $errors = [];

	protected static $current_user = false;

	public function login($username, $password, $remember = false){

		if(!$username || !$password){
			return false;
		}

		$User = User::where('username', '=', $username)->first();
		if(!$User){
			$this->errors[] = 'Username หรือ Password ไม่ถูกต้อง';
			return false;
		}

		if($User->status != 'Active'){
			$this->errors[] = MemberConfig::status($User->status)['notice'];
			return false;
		}

		if($this->check_password($password, $User->password)){
			return $this->login_success($User, $remember);
		}

		$this->errors[] = 'Username หรือ Password ไม่ถูกต้อง';
		return false;
	}

	public function errors(){
		return $this->errors;
	}

	public function error_text($default = ''){
		if(count($this->errors) > 0){
			return implode(", ", $this->errors);
		}else{
			return $default;
		}
	}

	public static function check_password($password, $hashed_password){
		return password_verify($password, $hashed_password);
	}

	protected function login_success($User, $remember = false){

		$User->last_login = date("Y-m-d H:i:s");
		$User->session_id = md5($User->username.time());

		if($User->save()){

			$login = [
				'role' => $User->user_role,
				'user_id' => $User->user_id,
				'session_id' => $User->session_id,
				'expire' => time() + (86400*30)
			];

			$jwt = JWT::encode($login, self::$key);
			$_SESSION['lt_login'] = $jwt;

			if($remember){
				$this->login_remember();
			}

			return true;
		}

		return false;
	}

	protected function login_remember(){
		if(isset($_SESSION['lt_login'])){
			setcookie('lt_login', $_SESSION['lt_login'], time() + (86400 * 30), "/");
		}
	}

	public static function current_login($filed=false, $serialize=false){
		$User = self::get_login();
		if($User){
			if($filed){
				return $serialize ? unserialize($User->{$filed}) : $User->{$filed};
			}else{
				return $User;
			}
		}
		return false;
	}

	protected static function get_login(){

		$current_user = self::$current_user;
		if($current_user){
			return $current_user;
		}

		$jwt = false;
		if(isset($_SESSION['lt_login']) && $_SESSION['lt_login']){
			$jwt = JWT::decode($_SESSION['lt_login'], self::$key, array('HS256'));
		}else
		if(isset($_COOKIE['lt_login']) && $_COOKIE['lt_login']){
			$jwt = JWT::decode($_COOKIE['lt_login'], self::$key, array('HS256'));
		}

		if($jwt){
			$User = User::find($jwt->user_id);
			if($User && $User->session_id == $jwt->session_id && $jwt->expire > time()){
				self::$current_user = $User;
				return $User;
			}

			self::logout();
		}
		
		return false;
	}

	public static function is_login(){
		return self::current_login();
	}

	public static function is_admin(){
		$current_login = self::current_login();
		if(!$current_login){
			return false;
		}
		
        return $current_login->user_role == 'Admin';
	}
	
	public static function is_agent(){
        $current_login = self::current_login();
        if(!$current_login){
			return false;
		}

        return $current_login->user_role == 'Senior' || $current_login->user_role == 'Master' || $current_login->user_role == 'Agent';
    }

    public static function is_member(){
        $current_login = self::current_login();
        if(!$current_login){
			return false;
		}

        return $current_login->user_role == 'Member';
    }

    public static function role_url(){

    	$http = new HttpService();

    	if(self::is_admin()){
    		return $http->admin();
    	}else
    	if(self::is_member()){
    		return $http->member();
    	}else
    	if(self::is_agent()){
    		return $http->agent();
    	}

    	return null;
    }

    public static function logout(){
		if(isset($_SESSION['lt_login'])){
    		unset($_SESSION['lt_login']);
    	}

    	if(isset($_COOKIE['lt_login'])){
    		setcookie('lt_login', 0, time() - 3600, "/");
    	}

    	return true;
    }

}
?>