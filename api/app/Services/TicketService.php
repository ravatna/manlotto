<?php  
namespace App\Services;

use App\Configs\LotteryConfig;

use App\Models\User;
use App\Models\Credit;
use App\Models\Lottery;
use App\Models\Ticket;
use App\Models\TicketNumber;
use App\Models\Summary;

use App\Services\AuthService;
use App\Services\CreditService;
use App\Services\LotteryService;

class TicketService
{

	public static function can_cancel($close_date, $created_at){
		
		$now = time();
		$create_time = strtotime($created_at);
		$close_time = strtotime($close_date);

		$min_to_close = ($close_time - $now)/60;
		if($min_to_close < 30){
			return false;
		}

		$min_to_create = ($now - $create_time)/60;
		if($min_to_create > 30){
			return false;
		}

		return true;
	}

	public static function cancel_ticket($ticket_id){
		
		$Ticket = Ticket::with('lottery')->find($ticket_id);
		if($Ticket){
			$Ticket->status = 'Cancel';
			if($Ticket->save()){
				
				$return_credit = TicketNumber::where('ticket_id', '=', $Ticket->ticket_id)->where('t_status', '<>', 'Cancel')->sum('t_credit');

				TicketNumber::where('ticket_id', '=', $Ticket->ticket_id)
					->where('t_status', '=', 'New')
					->update(['t_status' => 'Cancel']);

				self::update_total_amount($ticket_id);

				CreditService::update_credit([
                    'user_id'       => $Ticket->user_id, 
                    'credit_type'   => 'cancel-ticket', 
                    'credit_amount' => $return_credit, 
                    'credit_note'   => LotteryService::lottery_name($Ticket->lottery)." โพย {$Ticket->ticket_id}", 
                    'credit_ref_id' => $Ticket->ticket_id
                ]);

				return true;
			}

			return false;
		}

		return null;
	}

	public static function update_total_amount($ticket_id){

		$Ticket = Ticket::find($ticket_id);

		if($Ticket){

			$TicketNumber = TicketNumber::where('ticket_id', '=', $ticket_id)->where('t_status', '<>', 'Cancel');

			$Ticket->total_amount 	= $TicketNumber->sum('t_amount');
			$Ticket->total_discount = $TicketNumber->sum('t_discount');
			$Ticket->total_credit 	= $TicketNumber->sum('t_credit');
			$Ticket->result_amount 	= $TicketNumber->sum('t_result');

			$Ticket->ag_receive 	= $TicketNumber->sum('ag_receive');
			$Ticket->ag_commission 	= $TicketNumber->sum('ag_commission');
			$Ticket->ag_win 		= $TicketNumber->sum('ag_win');
			$Ticket->ag_diff_win 	= $TicketNumber->sum('ag_diff_win');

			$Ticket->ma_receive 	= $TicketNumber->sum('ma_receive');
			$Ticket->ma_commission 	= $TicketNumber->sum('ma_commission');
			$Ticket->ma_win 		= $TicketNumber->sum('ma_win');
			$Ticket->ma_diff_win 	= $TicketNumber->sum('ma_diff_win');

			$Ticket->se_receive 	= $TicketNumber->sum('se_receive');
			$Ticket->se_commission 	= $TicketNumber->sum('se_commission');
			$Ticket->se_win 		= $TicketNumber->sum('se_win');
			$Ticket->se_diff_win 	= $TicketNumber->sum('se_diff_win');

			$Ticket->ad_receive 	= $TicketNumber->sum('ad_receive');
			$Ticket->ad_commission 	= $TicketNumber->sum('ad_commission');
			$Ticket->ad_win 		= $TicketNumber->sum('ad_win');

			if($Ticket->total_amount == 0){
				$Ticket->status = 'Cancel';
			}

			return $Ticket->save();
		}

		return false;
	}

	public static function get_ticket($ticket_id){

		$Ticket = Ticket::with('numbers')->select(
					"tickets.ticket_id",
					"tickets.lottery_id",
					"tickets.ticket_name",
					"tickets.total_amount",
					"tickets.total_discount",
					"tickets.total_credit",
					"tickets.result_amount",
					"tickets.status",
					"tickets.created_at",
					"lottery.lottery_type",
					"lottery.lottery_date",
					"lottery.close_date"
				);

		$Ticket->where('tickets.ticket_id', '=', $ticket_id);

		if(AuthService::is_member()){
			$Ticket->where('tickets.user_id', '=', AuthService::current_login('user_id'));
		}

		$Ticket->join("lottery", "lottery.lottery_id", "=", "tickets.lottery_id");

		return $Ticket->first();
	}

	public static function get_tickets($from, $to){
		
		$Ticket = Ticket::select(
					"tickets.ticket_id",
					"tickets.lottery_id",
					"tickets.ticket_name",
					"tickets.total_amount",
					"tickets.total_discount",
					"tickets.total_credit",
					"tickets.result_amount",
					"tickets.status",
					"tickets.created_at",
					"lottery.lottery_type",
					"lottery.lottery_date",
					"lottery.close_date"
				);

		if(AuthService::is_member()){
			$Ticket->where('tickets.user_id', '=', AuthService::current_login('user_id'));
		}
			
		$Ticket->where("tickets.created_at", ">=", $from);
		$Ticket->where("tickets.created_at", "<=", $to);

		$Ticket->join("lottery", "lottery.lottery_id", "=", "tickets.lottery_id");
		$Ticket->orderBy('tickets.created_at', 'desc');
		
		return $Ticket->get();
	}


	public static function get_tickets_filter($from, $to, $lotto_filter){
		
		$Ticket = Ticket::select(
					"tickets.ticket_id",
					"tickets.lottery_id",
					"tickets.ticket_name",
					"tickets.total_amount",
					"tickets.total_discount",
					"tickets.total_credit",
					"tickets.result_amount",
					"tickets.status",
					"tickets.created_at",
					"lottery.lottery_type",
					"lottery.lottery_date",
					"lottery.close_date"
				);

		if(AuthService::is_member()){
			$Ticket->where('tickets.user_id', '=', AuthService::current_login('user_id'));
		}
		
		// echo $to.",".$from.",".$lotto_filter;

		$Ticket->where("tickets.created_at", ">=", $from);
		$Ticket->where("tickets.created_at", "<=", $to);
		$Ticket->where("lottery.lottery_type", "=" ,$lotto_filter);

		$Ticket->join("lottery", "lottery.lottery_id", "=", "tickets.lottery_id");
		$Ticket->orderBy('tickets.created_at', 'desc');
		
		return $Ticket->get();
	} // get_tickets_filter


	public static function UpdateWin($lottery_id){
		$Lottery = Lottery::find($lottery_id);
		$results = unserialize($Lottery->lottery_result);

		foreach(LotteryConfig::$groups[$Lottery->lottery_type] as $type => $option){
			$result_numbers = $results[$type];
			TicketNumber::where('lottery_id', '=', $lottery_id)
				->where('t_type', '=', $type)
				->where('t_status', '<>', 'Cancel')
				->whereIn('t_number', $result_numbers)
				->update([
					'is_win' => 'yes'
				]);
        }
	}

	public static function SaveSummary($role, $user_id, $Lottery){

		$user_summary = Ticket::where("{$role}_id", '=', $user_id)
                        ->where('lottery_id', '=', $Lottery->lottery_id)
                        ->where('status', '<>', 'Cancel');

        $Summary = Summary::where('user_id', '=', $user_id)
                        ->where('lottery_id', '=', $Lottery->lottery_id)
                        ->first();
        
        if(!$Summary){
            $Summary = new Summary();
            $Summary->user_id = $user_id;
            $Summary->lottery_id = $Lottery->lottery_id;
        }

        $Summary->receive 		= $user_summary->sum("{$role}_receive");
        $Summary->commission 	= $user_summary->sum("{$role}_commission");
        $Summary->win 			= $user_summary->sum("{$role}_win");
        $Summary->diff_win 		= $user_summary->sum("{$role}_diff_win");
        $Summary->save();

        // เพิ่มเครดิตให้สามาชิกที่ถูกรางวัล
        CreditService::update_credit([
            'user_id'       => $user_id, 
            'credit_type'   => 'Summary', 
            'credit_amount' => ($Summary->receive + $Summary->commission - $Summary->win + $Summary->diff_win), 
            'credit_note'   => LotteryService::lottery_name($Lottery), 
            'credit_ref_id' => $Lottery->lottery_id
        ]);

	}

}
?>