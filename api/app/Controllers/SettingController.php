<?php  
namespace App\Controllers;

use App\Controllers\Controller;

use App\Configs\LotteryConfig;

use App\Models\Lottery;
use App\Models\ReceiveLimit;

use App\Services\AuthService;
use App\Services\LimitService;

class SettingController extends Controller
{

    public function get_limit($request, $response, $args){
        $lottery = Lottery::find($args['lottery_id']);
        return $response->withJson([
            'result' => 'success',
            'limit' => LimitService::user_lottery_limit($lottery, AuthService::current_login('user_id'))
        ]);
    }

    public function get_limits($request, $response, $args){

        $lotteries = [];
        foreach(LotteryConfig::$groups as $group_key => $group_options){

            $limit = ReceiveLimit::select('limit_id', 'lottery_type', 'limit_option')
                        ->where('user_id', '=', AuthService::current_login('user_id'))
                        ->where('lottery_type', '=', $group_key)
                        ->where('lottery_id', '=', 0)
                        ->first();

            if($limit){
                $limit->limit_option = unserialize($limit->limit_option);
                $limit->length = count($limit->limit_option);
                $lotteries[$group_key] = $limit;
            }else{

                $group_limit = [];
                foreach($group_options as $option_key => $option){
                    $group_limit[$option_key] = 0;
                }

                $lotteries[$group_key] = [
                    'limit_id' => 0,
                    'lottery_type' => $group_key,
                    'limit_option' => $group_limit,
                    'length' => count($group_limit)
                ];
            }

        }

        return $response->withJson([
            'result' => 'success',
            //'options' => LotteryConfig::get_options(),
            'lotteries' => $lotteries
        ]);
    }

    public function save_limits($request, $response, $args){
        $input = $request->getParsedBody();
        foreach($input as $group){

            if($group['limit_id'] > 0){
                $Limit = ReceiveLimit::find($group['limit_id']);
            }else{
                $Limit = new ReceiveLimit();
            }

            $Limit->user_id = AuthService::current_login('user_id');
            $Limit->lottery_type = $group['lottery_type'];
            $Limit->limit_option = serialize($group['limit_option']);
            $Limit->save();
        }

        return $response->withJson([
            'result' => 'success'
        ]);
    }

    public function save_limit($request, $response, $args){
        $input = $request->getParsedBody();

        if($input['limit_id'] > 0){
            $Limit = ReceiveLimit::find($input['limit_id']);
        }else{
            $Limit = new ReceiveLimit();
        }

        $Limit->user_id = AuthService::current_login('user_id');
        $Limit->lottery_type = $input['lottery_type'];
        $Limit->lottery_id = $input['lottery_id'];
        $Limit->limit_option = serialize($input['limit_option']);
        $Limit->save();

        return $response->withJson([
            'result' => 'success'
        ]);
    }

}
?>