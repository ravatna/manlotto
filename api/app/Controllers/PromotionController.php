<?php  
namespace App\Controllers;

use App\Controllers\Controller;

use App\Models\Promotion;

use App\Services\AuthService;
use App\Services\PromotionService;

class PromotionController extends Controller
{

	public function save_promotion($request, $response, $args){
        $input = $request->getParsedBody();
		
		$Promotion = new Promotion();
		$Promotion->fill($input);
		$Promotion->promotion_info = serialize($input['promotion_info']);

		if($Promotion->save()){
			return $response->withJson([
				'result' => 'success',
				'promotion_id' => $Promotion->promotion_id
			]);
		}

		return $response->withJson([
			'result' => 'error'
		]);
    }

    public function update_promotion($request, $response, $args){
        $input = $request->getParsedBody();
		
		$Promotion = Promotion::find($args['promotion_id']);
		$Promotion->fill($input);
		$Promotion->promotion_info = serialize($input['promotion_info']);

		if($Promotion->save()){
			return $response->withJson([
				'result' => 'success',
				'promotion_id' => $Promotion->promotion_id
			]);
		}

		return $response->withJson([
			'result' => 'error'
		]);
    }

    public function promotion($request, $response, $args){
    	$Promotion = Promotion::find($args['promotion_id']);
    	return $response->withJson([
			'result' => 'success',
			'promotion' => PromotionService::promotion_data($Promotion)
		]);
    }

    public function promotions($request, $response, $args){

    	$Promotion = Promotion::select("*");

    	if(!AuthService::is_admin()){
    		$Promotion->where("promotion_status", "=", "on");
    	}

    	if(isset($_GET["type"])){
    		$Promotion->where("lottery_type", "=", $_GET["type"]);
    	}else{
    		return $response->withJson([
				'result' => 'invalid'
			]);
    	}

    	$Promotion->orderBy("promotion_id", "ASC");

    	$Promotions = $Promotion->get();
    	$pros = [];
    	foreach($Promotions as $pro){
    		$pros[] = PromotionService::promotion_data($pro);
    	}

    	return $response->withJson([
			'result' => 'success',
			'promotions' => $pros
		]);
    }

}
?>