<?php  
namespace App\Services;

use App\Models\Lottery;

use App\Configs\LotteryConfig;

use App\Services\DateTimeService;
use App\Services\AuthService;

class LotteryService
{

	public static function status($lottery){
        if($lottery->lottery_status == 'success')
        {
            return [
                'text' => 'ออกผลแล้ว',
                'html' => '<span class="label label-primary">ออกผลแล้ว</span>',
                'user_status' => 'close',
                'admin_status' => 'success'
            ];
        }
        else if($lottery->lottery_status == 'process')
        {
            return [
                'text' => 'กำลังออกผล',
                'html' => '<span class="label label-warning">กำลังออกผล</span>',
                'user_status' => 'close',
                'admin_status' => 'process'
            ];
        }
        else if($lottery->lottery_status == 'close')
        {
            return [
                'text' => 'ปิดรับแทง',
                'html' => '<span class="label label-danger">ปิดรับแทง</span>',
                'user_status' => 'close',
                'admin_status' => 'close'
            ];
        }
        else if($lottery->lottery_status == 'open')
        {
            if(time() > strtotime($lottery->close_date))
            {
                return [
                    'text' => 'รอออกผล',
                    'html' => '<span class="label label-warning">รอออกผล</span>',
                    'user_status' => 'close',
                    'admin_status' => 'waiting-result'
                ];
            }
            else if(time() < strtotime($lottery->open_date))
            {
                return [
                    'text' => 'รอเปิดแทง',
                    'html' => '<span class="label label-info">รอเปิดแทง</span>',
                    'user_status' => 'close',
                    'admin_status' => 'waiting-open'
                ];
            }
            else
            {
                return [
                    'text' => 'เปิดรับแทง',
                    'html' => '<span class="label label-success">เปิดรับแทง</span>',
                    'user_status' => 'open',
                    'admin_status' => 'open'
                ];
            }
        }
    }

    /**
     * lottery_data
     */
    public static function lottery_data($lottery){
        
        $lottery->lottery_options = unserialize($lottery->lottery_options);
        $lottery->lottery_result = unserialize($lottery->lottery_result);

        $data = [
            'lottery_id' => $lottery->lottery_id,
            'name' => DateTimeService::thai_date($lottery->lottery_date),
            'type' => $lottery->lottery_type,
            'status' => self::status($lottery),
            'lottery_date' => $lottery->lottery_date,
            'lottery_status' => $lottery->lottery_status,
            'open_date' => DateTimeService::general_format($lottery->open_date),
            'close_date' => DateTimeService::general_format($lottery->close_date),
            'open_date_format' => $lottery->open_date,
            'close_date_format' => $lottery->close_date,
            'options' => $lottery->lottery_options,
            'results' => $lottery->lottery_result,
            'open_options' => self::open_options($lottery->lottery_type)
        ];

        if(AuthService::is_admin()){
            $data['db'] = $lottery;
        }

        return $data;
    }

    public static function open_options($type){
        $opens = [];
        
        if(count(LotteryConfig::$groups[$type]) > 0){
         foreach(LotteryConfig::$groups[$type] as $key => $val){
             $opens[] = $key;
         }
        }
        return $opens;
    }

    public static function last_lottery($lottery_type){
        $date = date("Y-m-d H:i:s");
        
        // กำลังเปิดรับแทง
		$Lottery = Lottery::where('lottery_type', '=', $lottery_type)
						->where('open_date', '<=', $date)
						->where('close_date', '>', $date)
						->where('lottery_status', '=', 'open')
						->orderBy('close_date', 'asc')
						->first();

		if(!$Lottery){
            // ปิดรับแล้ว รอออกผล
			$Lottery = Lottery::where('lottery_type', '=', $lottery_type)
						->where('open_date', '<=', $date)
						->where('close_date', '<', $date)
                        ->where('lottery_status', '=', 'open')
                        ->orderBy('close_date', 'desc')
						->first();
        }
        
        if(!$Lottery){
            // ออกผลแล้ว
			$Lottery = Lottery::where('lottery_type', '=', $lottery_type)
						->where('open_date', '<=', $date)
						->where('close_date', '<', $date)
                        ->where('lottery_status', '=', 'success')
                        ->orderBy('close_date', 'desc')
						->first();
        }

		if($Lottery){
			return self::lottery_data($Lottery);
		}
		
		return null;
	}

    public static function lottery_name($lottery){    
        return LotteryConfig::$type_name[$lottery->lottery_type]['name'].' งวดวันที่ '.DateTimeService::thai_date($lottery->lottery_date);
    }

    public static function number_type($type){
        $number_type_name = [
            'run_top' => 'วิ่งบน',
            'run_bottom' => 'วิ่งล่าง',
            'two_number_top' => '2 ตัวบน',
            'two_number_bottom' => '2 ตัวล่าง',
            'two_number_tode' => '2 ตัวโต๊ด',
            'three_number_top' => '3 ตัวบน',
            'three_number_tode' => '3 ตัวโต๊ด',
            'three_number_front' => '3 ตัวหน้า',
            'three_number_bottom' => '3 ตัวล่าง'
        ];

        return $number_type_name[$type];
    }

    public static function check_setting($input_setting){
        $agent_setting = AuthService::current_login('bet_setting', true);
        foreach($input_setting as $key_setting => $val_setting){
            if($val_setting['min'] > $agent_setting[$key_setting]['min'] || $val_setting['max'] > $agent_setting[$key_setting]['max']){
                return false;
            }
        }
        return true;
    }

    public static function check_opens($input_opens){
        $agent_opens = AuthService::current_login('bet_opens', true);
        foreach($input_opens as $key_open => $val_open){
            
            if(!isset($val_open['option'])) continue;

            foreach($val_open['option'] as $key_option => $val_option){
                
                if($val_option['pay'] > $agent_opens[$key_open]['option'][$key_option]['pay']){
                    return false;
                }

                if($val_option['discount'] > $agent_opens[$key_open]['option'][$key_option]['discount']){
                    return false;
                }

                
            }
        }
        return true;
    }

    public static function lottery_opens(){

        if(AuthService::is_admin()){
            return LotteryConfig::$groups;
        }else{
            $group_opens = [];
            foreach(AuthService::current_login('bet_opens', true) as $key => $group){
                if($group['is_open']){
                    $group_opens[$key] = $group;
                }
            }
            return $group_opens;
        }

    }

    public static function lottery_awards($lottery_type){
        $awards = [];
        foreach(LotteryConfig::$groups[$lottery_type] as $key => $option){
            $option_awards = [];
            for($i=1; $i<=$option['award']; $i++){
                $option_awards[] = "";
            }
            $awards[$key] = $option_awards;
        }
        return $awards;
    }

}
?>