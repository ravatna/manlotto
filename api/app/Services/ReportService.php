<?php  
namespace App\Services;

use App\Models\Ticket;

use App\Services\AuthService;

class ReportService
{

	public static function report($lottery_id){
		
		$role = AuthService::current_login('user_role');
		$user_id = AuthService::current_login('user_id');

		$report = [];
		$report['member'] 	= self::member($role, $user_id, $lottery_id);
		$report['agent'] 	= self::agent($role, $user_id, $lottery_id);
		$report['master'] 	= self::master($role, $user_id, $lottery_id);
		$report['senior'] 	= self::senior($role, $user_id, $lottery_id);
		$report['admin'] 	= self::admin($role, $user_id, $lottery_id);

		return $report;
	}

	public static function member($role, $user_id, $lottery_id){

		switch ($role) {
			case 'Member':
				$Ticket = Ticket::where('lottery_id', '=', $lottery_id)->where('status', '<>', 'Cancel')->where('user_id', '=', $user_id);
			break;
			
			case 'Agent':
				$Ticket = Ticket::where('lottery_id', '=', $lottery_id)->where('status', '<>', 'Cancel')->where('ag_id', '=', $user_id);
			break;

			case 'Master':
				$Ticket = Ticket::where('lottery_id', '=', $lottery_id)->where('status', '<>', 'Cancel')->where('ma_id', '=', $user_id);
			break;

			case 'Senior':
				$Ticket = Ticket::where('lottery_id', '=', $lottery_id)->where('status', '<>', 'Cancel')->where('se_id', '=', $user_id);
			break;

			case 'Admin':
				$Ticket = Ticket::where('lottery_id', '=', $lottery_id)->where('status', '<>', 'Cancel');
			break;
		}
		
		if(isset($Ticket)){
			return [
				'bet' => round($Ticket->sum('total_amount'), 2, PHP_ROUND_HALF_UP),
				'discount' => round($Ticket->sum('total_discount'), 2, PHP_ROUND_HALF_UP),
				'total' => round($Ticket->sum('total_credit'), 2, PHP_ROUND_HALF_UP)
			];
		}

		return false;
	}

	public static function agent($role, $user_id, $lottery_id){
		
		switch ($role) {
			case 'Agent':
				$Ticket = Ticket::where('lottery_id', '=', $lottery_id)->where('status', '<>', 'Cancel')->where('ag_id', '=', $user_id);
			break;

			case 'Master':
				$Ticket = Ticket::where('lottery_id', '=', $lottery_id)->where('status', '<>', 'Cancel')->where('ma_id', '=', $user_id);
			break;

			case 'Senior':
				$Ticket = Ticket::where('lottery_id', '=', $lottery_id)->where('status', '<>', 'Cancel')->where('se_id', '=', $user_id);
			break;

			case 'Admin':
				$Ticket = Ticket::where('lottery_id', '=', $lottery_id)->where('status', '<>', 'Cancel');
			break;
		}
		
		if(isset($Ticket)){
			$receive = round($Ticket->sum('ag_receive'), 2, PHP_ROUND_HALF_UP);
			$commission = round($Ticket->sum('ag_commission'), 2, PHP_ROUND_HALF_UP);
			return [
				'receive' => $receive,
				'commission' => $commission,
				'total' => $receive+$commission
			];
		}

		return false;
	}

	public static function master($role, $user_id, $lottery_id){
		
		switch ($role) {
			case 'Master':
				$Ticket = Ticket::where('lottery_id', '=', $lottery_id)->where('status', '<>', 'Cancel')->where('ma_id', '=', $user_id);
			break;

			case 'Senior':
				$Ticket = Ticket::where('lottery_id', '=', $lottery_id)->where('status', '<>', 'Cancel')->where('se_id', '=', $user_id);
			break;

			case 'Admin':
				$Ticket = Ticket::where('lottery_id', '=', $lottery_id)->where('status', '<>', 'Cancel');
			break;
		}
		
		if(isset($Ticket)){
			$receive = round($Ticket->sum('ma_receive'), 2, PHP_ROUND_HALF_UP);
			$commission = round($Ticket->sum('ma_commission'), 2, PHP_ROUND_HALF_UP);
			return [
				'receive' => $receive,
				'commission' => $commission,
				'total' => $receive+$commission
			];
		}

		return false;
	}

	public static function senior($role, $user_id, $lottery_id){
		
		switch ($role) {
			case 'Senior':
				$Ticket = Ticket::where('lottery_id', '=', $lottery_id)->where('status', '<>', 'Cancel')->where('se_id', '=', $user_id);
			break;

			case 'Admin':
				$Ticket = Ticket::where('lottery_id', '=', $lottery_id)->where('status', '<>', 'Cancel');
			break;
		}
		
		if(isset($Ticket)){
			$receive = round($Ticket->sum('se_receive'), 2, PHP_ROUND_HALF_UP);
			$commission = round($Ticket->sum('se_commission'), 2, PHP_ROUND_HALF_UP);
			return [
				'receive' => $receive,
				'commission' => $commission,
				'total' => $receive+$commission
			];
		}

		return false;
	}

	public static function admin($role, $user_id, $lottery_id){
		
		switch ($role) {
			case 'Agent':
				$Ticket = Ticket::where('lottery_id', '=', $lottery_id)->where('status', '<>', 'Cancel')->where('ag_id', '=', $user_id);
				// master + sesior + admin
				$receive = round( $Ticket->sum('ma_receive')+$Ticket->sum('se_receive')+$Ticket->sum('ad_receive') , 2, PHP_ROUND_HALF_UP);
				$commission = round( $Ticket->sum('ma_commission')+$Ticket->sum('se_commission')+$Ticket->sum('ad_commission') , 2, PHP_ROUND_HALF_UP);
			break;

			case 'Master':
				$Ticket = Ticket::where('lottery_id', '=', $lottery_id)->where('status', '<>', 'Cancel')->where('ma_id', '=', $user_id);
				// senior + admin
				$receive = round( $Ticket->sum('se_receive')+$Ticket->sum('ad_receive') , 2, PHP_ROUND_HALF_UP);
				$commission = round( $Ticket->sum('se_commission')+$Ticket->sum('ad_commission') , 2, PHP_ROUND_HALF_UP);
			break;

			case 'Senior':
				$Ticket = Ticket::where('lottery_id', '=', $lottery_id)->where('status', '<>', 'Cancel')->where('se_id', '=', $user_id);
				$receive = round( $Ticket->sum('ad_receive'), 2, PHP_ROUND_HALF_UP);
				$commission = round( $Ticket->sum('ad_commission'), 2, PHP_ROUND_HALF_UP);
			break;

			case 'Admin':
				$Ticket = Ticket::where('lottery_id', '=', $lottery_id)->where('status', '<>', 'Cancel');
				$receive = round( $Ticket->sum('ad_receive'), 2, PHP_ROUND_HALF_UP);
				$commission = round( $Ticket->sum('ad_commission'), 2, PHP_ROUND_HALF_UP);
			break;
		}
		
		if(isset($Ticket)){
			return [
				'receive' => $receive,
				'commission' => $commission,
				'total' => $receive+$commission
			];
		}

		return false;
	}

	public static function report_by_member_mem($Ticket){
		return [
            'bet' => round($Ticket->sum('total_amount'), 2, PHP_ROUND_HALF_UP),
            'discount' => round($Ticket->sum('total_discount'), 2, PHP_ROUND_HALF_UP),
            'total' => round($Ticket->sum('total_credit'), 2, PHP_ROUND_HALF_UP)
        ];
	}

	public static function report_by_member_ag($Ticket, $current_role){
		$ag_receive = $Ticket->sum('ag_receive');
        $ag_commission = $Ticket->sum('ag_commission');
        return [
            'receive' => round($ag_receive, 2, PHP_ROUND_HALF_UP),
            'commission' => round($ag_commission, 2, PHP_ROUND_HALF_UP),
            'total' => round($ag_receive+$ag_commission, 2, PHP_ROUND_HALF_UP)
        ];
	}

	public static function report_by_member_ma($Ticket, $current_role){
		switch($current_role){
			case 'Master':
			case 'Senior':
			case 'Admin':
				$ma_receive = $Ticket->sum('ma_receive');
		        $ma_commission = $Ticket->sum('ma_commission');
		        return [
		            'receive' => round($ma_receive, 2, PHP_ROUND_HALF_UP),
		            'commission' => round($ma_commission, 2, PHP_ROUND_HALF_UP),
		            'total' => round($ma_receive+$ma_commission, 2, PHP_ROUND_HALF_UP)
		        ];
			break;
		}
		return false;
	}

	public static function report_by_member_se($Ticket, $current_role){
        switch($current_role){
			case 'Senior':
			case 'Admin':
				$se_receive = $Ticket->sum('se_receive');
		        $se_commission = $Ticket->sum('se_commission');
		        return [
		            'receive' => round($se_receive, 2, PHP_ROUND_HALF_UP),
		            'commission' => round($se_commission, 2, PHP_ROUND_HALF_UP),
		            'total' => round($se_receive+$se_commission, 2, PHP_ROUND_HALF_UP)
		        ];
			break;
		}
		return false;
	}

	public static function report_by_member_ad($Ticket, $current_role){
		switch($current_role){
			case 'Senior':
			case 'Admin':
				$ad_receive = $Ticket->sum('ad_receive');
		        $ad_commission = $Ticket->sum('ad_commission');
		        return [
		            'receive' => round($ad_receive, 2, PHP_ROUND_HALF_UP),
		            'commission' => round($ad_commission, 2, PHP_ROUND_HALF_UP),
		            'total' => round($ad_receive+$ad_commission, 2, PHP_ROUND_HALF_UP)
		        ];
		    break;

		    case 'Master':
		    	$ad_receive = $Ticket->sum('se_receive') + $Ticket->sum('ad_receive');
		        $ad_commission = $Ticket->sum('se_commission') + $Ticket->sum('ad_commission');
		        return [
		            'receive' => round($ad_receive, 2, PHP_ROUND_HALF_UP),
		            'commission' => round($ad_commission, 2, PHP_ROUND_HALF_UP),
		            'total' => round($ad_receive+$ad_commission, 2, PHP_ROUND_HALF_UP)
		        ];
		    break;

		    case 'Agent':
		    	$ad_receive = $Ticket->sum('ma_receive') + $Ticket->sum('se_receive') + $Ticket->sum('ad_receive');
		        $ad_commission = $Ticket->sum('ma_commission') + $Ticket->sum('se_commission') + $Ticket->sum('ad_commission');
		        return [
		            'receive' => round($ad_receive, 2, PHP_ROUND_HALF_UP),
		            'commission' => round($ad_commission, 2, PHP_ROUND_HALF_UP),
		            'total' => round($ad_receive+$ad_commission, 2, PHP_ROUND_HALF_UP)
		        ];
		    break;
	    }
	    return false;
	}

}
?>