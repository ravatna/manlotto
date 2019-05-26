<?php  
namespace App\Services;

use App\Models\User;
use App\Models\Credit;

use App\Services\AuthService;

class PromotionService
{

	public static function promotion_data($data){
		if($data){
			$data->promotion_info = unserialize($data->promotion_info);
			return $data;
		}
		return null;
	}

}
?>