<?php  
namespace App\Services;

use App\Configs\LotteryConfig;

use App\Models\Lottery;
use App\Models\ReceiveLimit;
use App\Models\TicketNumber;

class LimitService
{

	public static function user_lottery_limit($lottery, $user_id){

        $limit = ReceiveLimit::select('limit_id', 'lottery_type', 'lottery_id', 'limit_option')
                    ->where('user_id', '=', $user_id)
                    ->where('lottery_id', '=', $lottery->lottery_id)
                    ->first();

        if(!$limit){
            $limit = ReceiveLimit::select('limit_id', 'lottery_type', 'lottery_id', 'limit_option')
                        ->where('user_id', '=', $user_id)
                        ->where('lottery_type', '=', $lottery->lottery_type)
                        ->where('lottery_id', '=', 0)
                        ->first();

            if($limit){
                $limit->limit_id = 0;
                $limit->lottery_id = $lottery->lottery_id;
            }
        }

        if(!$limit){
            $limit = [
                'limit_id' => 0,
                'lottery_type' => $lottery->lottery_type,
                'lottery_id' => $lottery->lottery_id,
                'limit_option' => []
            ];
            foreach(LotteryConfig::$groups[$lottery->lottery_type] as $option_key => $option){
                $limit['limit_option'][$option_key] = 0;
            }
        }else{
            $limit->limit_option = unserialize($limit->limit_option);
        }

        return $limit;
    }

    public static function ag_received($ag_id, $lottery_id, $number_type, $number){
        return TicketNumber::where('ag_id', '=', $ag_id)
                    ->where('lottery_id', '=', $lottery_id)
                    ->where('t_type', '=', $number_type)
                    ->where('t_number', '=', $number)
                    ->where('t_status', '<>', 'Cancel')
                    ->sum('ag_receive');
    }

    public static function ma_received($ma_id, $lottery_id, $number_type, $number){
        return TicketNumber::where('ma_id', '=', $ma_id)
                    ->where('lottery_id', '=', $lottery_id)
                    ->where('t_type', '=', $number_type)
                    ->where('t_number', '=', $number)
                    ->where('t_status', '<>', 'Cancel')
                    ->sum('ma_receive');
    }

    public static function se_received($se_id, $lottery_id, $number_type, $number){
        return TicketNumber::where('se_id', '=', $se_id)
                    ->where('lottery_id', '=', $lottery_id)
                    ->where('t_type', '=', $number_type)
                    ->where('t_number', '=', $number)
                    ->where('t_status', '<>', 'Cancel')
                    ->sum('se_receive');
    }

    public static function ad_received($ad_id, $lottery_id, $number_type, $number){
        return TicketNumber::where('ad_id', '=', $ad_id)
                    ->where('lottery_id', '=', $lottery_id)
                    ->where('t_type', '=', $number_type)
                    ->where('t_number', '=', $number)
                    ->where('t_status', '<>', 'Cancel')
                    ->sum('ad_receive');
    }

}
?>