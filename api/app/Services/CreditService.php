<?php  
namespace App\Services;

use App\Models\User;
use App\Models\Credit;

use App\Services\AuthService;

class CreditService
{

	public static function update_credit($data){
		$User = User::find($data['user_id']);

		$Credit = new Credit();
		$Credit->fill($data);

		$Credit->credit_balance = $User->balance + $Credit->credit_amount;
		
		$Credit->action_by_user_id = AuthService::current_login('user_id');
		$Credit->action_by_name = AuthService::current_login('user_role');

		if($Credit->save()){
			$User->balance = $Credit->credit_balance;
			return $User->save();
		}

		return false;
	}

	public static function credit_balance(){
		$credit = AuthService::current_login('credit');
		$used_credit = self::used_credit();
		return $credit + $used_credit;
	}

	public static function used_credit(){
		return -(User::where('ref_user_id', '=', AuthService::current_login('user_id'))->sum('credit'));
	}

}
?>