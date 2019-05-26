<?php  
namespace App\Controllers;

use Illuminate\Database\Capsule\Manager as DB;

use App\Controllers\Controller;

use App\Models\Lottery;
use App\Models\Ticket;
use App\Models\TicketNumber;

use App\Services\LotteryService;
use App\Services\AuthService;
use App\Services\CreditService;
use App\Services\TicketService;
use App\Services\MemberService;
use App\Services\LimitService;

use App\Configs\MemberConfig;

class TicketController extends Controller
{

	public function save_ticket($request, $response, $args){
        $input = $request->getParsedBody();
       

       // $input = '{"ticket_id":"0","lottery_id":25,"name":"xxxxxx","numbers":[{"type":"three_number_top","number":"111","amount":11,"discount":"1.65","pay":650,"return":7150},{"type":"three_number_tode","number":"111","amount":1,"discount":"0.15","pay":130,"return":130}],"use_credit":0,"discount":0,"total_amount":10.2}';


        $lottery = Lottery::find($input['lottery_id']);

        if($lottery){

        	// ตรวจสอบสถานะ ของ ล็อตเตอร์รี่
            $status = LotteryService::status($lottery);
            
			if($status['user_status'] != 'open'){
				return $response->withJson([
					'result' => 'error',
					'title' => 'ไม่สามารถทำรายการได้!',
					'errorText' => 'หวยงวดนี้ปิดรับแทงแล้ว'
				]);
            }
            
			// ตรวจสอบสมาชิก
            $account = AuthService::current_login();
            
			if(!$account){
				return $response->withJson([
					'result' => 'error',
					'title' => 'ไม่สามารถทำรายการได้!',
					'errorText' => 'กรุณาเข้าสู่ระบบ'
				]);
            }
            
			// ตรวจสอบสถานะสมาชิก
			if($account->status != 'Active'){
				return $response->withJson([
					'result' => 'error',
					'title' => 'ไม่สามารถทำรายการได้!',
					'errorText' => MemberConfig::status($account->status)['notice']
				]);
            }
            
			// ตรวจสอบเครดิต
			if( ($account->credit + $account->balance) < $input['total_amount']){
				return $response->withJson([
					'result' => 'error',
					'title' => 'ไม่สามารถทำรายการได้!',
					'errorText' => 'ยอดเครดิตไม่พอ กรุณาตรวจสอบเครดิตของท่าน'
				]);
			}

            $referers = [];
            $referer = MemberService::get_referer(AuthService::current_login('user_id'));
            while($referer){
                $referers[$referer['user_role']] = $referer;
                $referer = MemberService::get_referer($referer['user_id']);
            }


            

			if($input['ticket_id'] > 0){
				$Ticket 				= Ticket::find($input['ticket_id']);
				$Ticket->ticket_name 	= $input['name'];
				$Ticket->total_amount 	= $Ticket->total_amount + $input['total_amount'];
				$Ticket->status 		= 'New';
			}else{
				$Ticket 				= new Ticket();
				$Ticket->ticket_name 	= $input['name'];
				$Ticket->user_id 		= $account->user_id;
				$Ticket->lottery_id 	= $lottery->lottery_id;
				$Ticket->total_amount 	= $input['total_amount'];
				$Ticket->result_amount 	= null;
				$Ticket->status 		= 'New';

                if(isset($referers['Agent'])){
                    $Ticket->ag_id = $referers['Agent']['user_id'];
                }

                if(isset($referers['Master'])){
                    $Ticket->ma_id = $referers['Master']['user_id'];
                }

                if(isset($referers['Senior'])){
                    $Ticket->se_id = $referers['Senior']['user_id'];
                }

                if(isset($referers['Admin'])){
                    $Ticket->ad_id = $referers['Admin']['user_id'];
                }

			}

            if(isset($referers['Agent'])){
                $ag_limits = LimitService::user_lottery_limit($lottery, $Ticket->ag_id)['limit_option'];
            }

            if(isset($referers['Master'])){
                $ma_limits = LimitService::user_lottery_limit($lottery, $Ticket->ma_id)['limit_option'];
            }

            if(isset($referers['Senior'])){
                $se_limits = LimitService::user_lottery_limit($lottery, $Ticket->se_id)['limit_option'];
            }

            if(isset($referers['Admin'])){
                $ad_limits = LimitService::user_lottery_limit($lottery, $Ticket->ad_id)['limit_option'];
            }

            $set_numbers = [];
            $invalid_numbers = [];
            $close_numbers = [];
            foreach($input['numbers'] as $number){
                                
                $set_number                 = [];
                $set_number['t_type']       = $number['type'];
                $set_number['t_number']     = $number['number'];
                $set_number['t_pay']        = $number['pay'];
                $set_number['t_amount']     = -$number['amount'];
                $set_number['t_discount']   = $number['discount'];
                $set_number['t_credit']     = -$number['amount'] + $number['discount'];
                $set_number['t_return']     = $number['return'];
                $set_number['t_status']     = 'New';

                $set_number['ag_id']        = $Ticket->ag_id;
                $set_number['ma_id']        = $Ticket->ma_id;
                $set_number['se_id']        = $Ticket->se_id;
                $set_number['ad_id']        = $Ticket->ad_id;

                $amount_over = 0;
                $ag_over = 0;
                $ma_over = 0;
                $se_over = 0;
                $ad_over = 0;
                
                if(isset($referers['Agent'])){
                    $set_number['ag_share']     = $referers['Agent']['share'];
                    $set_number['ag_pay']       = $referers['Agent']['bet_opens'][$lottery->lottery_type]['option'][$set_number['t_type']]['pay'];
                    $set_number['ag_discount']  = $referers['Agent']['bet_opens'][$lottery->lottery_type]['option'][$set_number['t_type']]['discount'];

                    // จำกัดยอดที่รับได้ทั้งหมด
                    $ag_limit = $ag_limits[$number['type']];
                    // ยอดที่ได้รับตาม % ถือหุ้น
                    $ag_receiving = round(($number['amount'] * $set_number['ag_share'])/100, 2, PHP_ROUND_HALF_UP);
                    // ยอดที่รับก่อนหน้า
                    $ag_received = LimitService::ag_received($set_number['ag_id'], $lottery->lottery_id, $number['type'], $number['number']);

                    // ถ้ายอดรับเกินกว่าที่กำหนดไว้
                    if( ($ag_received+$ag_receiving) > $ag_limit ){
                        // ส่วนเกินที่ปล่อยให้ master
                        $ag_over = ($ag_received+$ag_receiving) - $ag_limit;
                        $amount_over = $ag_over;
                        // ส่วนที่รับไว้
                        $set_number['ag_receive']   = $ag_receiving - $ag_over;
                    }else{
                        // รับเต็ม
                        $set_number['ag_receive']   = $ag_receiving;
                        $amount_over = 0;
                    }

                    //$ag_discount = round(($set_number['t_amount * $set_number['ag_discount)/100, 2, PHP_ROUND_HALF_UP);
                    //$set_number['ag_commission = round(($ag_discount * $set_number['ag_share)/100, 2, PHP_ROUND_HALF_UP);
                }

                if(isset($referers['Master'])){
                    $set_number['ma_share']     = $referers['Master']['share'];
                    $set_number['ma_pay']       = $referers['Master']['bet_opens'][$lottery->lottery_type]['option'][$set_number['t_type']]['pay'];
                    $set_number['ma_discount']  = $referers['Master']['bet_opens'][$lottery->lottery_type]['option'][$set_number['t_type']]['discount'];

                    // จำกัดยอดที่รับได้
                    $ma_limit = $ma_limits[$number['type']];
                    // ยอดที่ได้รับตาม % ถือหุ้น + เหลือจาก agent
                    $ma_receiving = round(($number['amount'] * $set_number['ma_share'])/100, 2, PHP_ROUND_HALF_UP) + $amount_over;
                    // ยอดที่รับก่อนหน้า
                    $ma_received = LimitService::ma_received($set_number['ma_id'], $lottery->lottery_id, $number['type'], $number['number']);
                    
                    // ถ้ายอดรับเกินกว่าที่กำหนดไว้
                    if( ($ma_received+$ma_receiving) > $ma_limit ){
                        // ส่วนเกินที่ปล่อยให้ senior
                        $ma_over = ($ma_received+$ma_receiving) - $ma_limit;
                        $amount_over = $ma_over;
                        // ส่วนที่รับไว้
                        $set_number['ma_receive']   = $ma_receiving - $ma_over;
                    }else{
                        // รับเต็ม
                        $set_number['ma_receive']   = $ma_receiving;
                        $amount_over = 0;
                    }

                    //$ma_discount = round(($set_number['t_amount'] * $set_number['ma_discount'])/100, 2, PHP_ROUND_HALF_UP);
                    //$set_number['ma_commission'] = round(($ma_discount * $set_number['ma_share'])/100, 2, PHP_ROUND_HALF_UP);
                }

                if(isset($referers['Senior'])){
                    $set_number['se_share']     = $referers['Senior']['share'];
                    $set_number['se_pay']       = $referers['Senior']['bet_opens'][$lottery->lottery_type]['option'][$set_number['t_type']]['pay'];
                    $set_number['se_discount']  = $referers['Senior']['bet_opens'][$lottery->lottery_type]['option'][$set_number['t_type']]['discount'];

                    // จำกัดยอดที่รับได้
                    $se_limit = $se_limits[$number['type']];
                    // ยอดที่ได้รับตาม % ถือหุ้น + เหลือจาก master
                    $se_receiving = round(($number['amount'] * $set_number['se_share'])/100, 2, PHP_ROUND_HALF_UP) + $amount_over;
                    // ยอดที่รับก่อนหน้า
                    $se_received = LimitService::se_received($set_number['se_id'], $lottery->lottery_id, $number['type'], $number['number']);
                    
                    // ถ้ายอดรับเกินกว่าที่กำหนดไว้
                    if( ($se_received+$se_receiving) > $se_limit ){
                        // ส่วนเกินที่ปล่อยให้ admin
                        $se_over = ($se_received+$se_receiving) - $se_limit;
                        $amount_over = $se_over;
                        // ส่วนที่รับไว้
                        $set_number['se_receive']   = $se_receiving - $se_over;
                    }else{
                        // รับเต็ม
                        $set_number['se_receive']   = $se_receiving;
                        $amount_over = 0;
                    }
                                           
                    //$se_discount = round(($set_number['t_amount'] * $set_number['se_discount'])/100, 2, PHP_ROUND_HALF_UP);
                    //$set_number['se_commission'] = round(($se_discount * $set_number['se_share'])/100, 2, PHP_ROUND_HALF_UP);
                }

                if(isset($referers['Admin'])){
                    
                    $set_number['ad_share']     = $referers['Admin']['share'];
                    $set_number['ad_pay']       = $referers['Admin']['bet_opens'][$lottery->lottery_type]['option'][$set_number['t_type']]['pay'];
                    $set_number['ad_discount']  = $referers['Admin']['bet_opens'][$lottery->lottery_type]['option'][$set_number['t_type']]['discount'];

                    

                    // จำกัดยอดที่รับได้
                    $ad_limit = $ad_limits[$number['type']];
                    // ยอดที่ได้รับตาม % ถือหุ้น + เหลือจาก senior
                    $ad_receiving = round(($number['amount'] * $set_number['ad_share'])/100, 2, PHP_ROUND_HALF_UP) + $amount_over;
                    // ยอดที่รับก่อนหน้า
                    $ad_received = LimitService::ad_received($set_number['ad_id'], $lottery->lottery_id, $number['type'], $number['number']);
                    
                    // ถ้ายอดรับเกินกว่าที่กำหนดไว้
                    if( ($ad_received+$ad_receiving) > $ad_limit ){
                        // ส่วนเกินที่ไม่สามารถรับได้
                        $ad_over = ($ad_received+$ad_receiving) - $ad_limit;
                        $amount_over = $ad_over;
                        // ส่วนที่รับไว้
                        $set_number['ad_receive']   = $ad_receiving - $ad_over;
                    }else{
                        // รับเต็ม
                        $set_number['ad_receive']   = $ad_receiving;
                        $amount_over = 0;
                    }
               
                    //$ad_discount = round(($set_number['t_amount'] * $set_number['ad_discount'])/100, 2, PHP_ROUND_HALF_UP);
                    //$set_number['ad_commission'] = round(($ad_discount * $set_number['ad_share'])/100, 2, PHP_ROUND_HALF_UP);
                }


                /******
                มีส่วนเกินที่ไม่สามารถรับได้ 
                *******/

                // เช็คว่า se สามารถรับได้อีกหรือเปล่า
                if($amount_over > 0 && isset($referers['Senior']) && $se_over==0){
                    // รับทั้งหมดได้
                    if($se_limit >= ($se_received + $se_receiving + $amount_over) ){
                        $set_number['se_receive'] = $se_receiving + $amount_over;
                        $amount_over = 0;
                    // รับได้ไม่หมด
                    }else{
                        $set_number['se_receive'] = $se_limit - $se_received;
                        $amount_over = ($se_received + $se_receiving + $amount_over) - $se_limit;
                    }
                }

                // เช็คว่า ma สามารถรับได้อีกหรือเปล่า
                if($amount_over > 0 && isset($referers['Master']) && $ma_over==0){
                    // รับทั้งหมดได้
                    if($ma_limit >= ($ma_received + $ma_receiving + $amount_over) ){
                        $set_number['ma_receive'] = $ma_receiving + $amount_over;
                        $amount_over = 0;
                    // รับได้ไม่หมด
                    }else{
                        $set_number['ma_receive'] = $ma_limit - $ma_received;
                        $amount_over = ($ma_received + $ma_receiving + $amount_over) - $ma_limit;
                    }
                }

                // เช็คว่า ag สามารถรับได้อีกหรือเปล่า
                if($amount_over > 0 && isset($referers['Agent']) && $ag_over==0){
                    // รับทั้งหมดได้
                    if($ag_limit >= ($ag_received + $ag_receiving + $amount_over) ){
                        $set_number['ag_receive'] = $ag_receiving + $amount_over;
                        $amount_over = 0;
                    // รับได้ไม่หมด
                    }else{
                        $set_number['ag_receive'] = $ag_limit - $ag_received;
                        $amount_over = ($ag_received + $ag_receiving + $amount_over) - $ag_limit;
                    }
                }

                // สรุปยอดที่เหลือ
                if($amount_over > 0){
                    if($amount_over == $number['amount']){
                        $invalid_numbers[] = [
                            'error' => 'close',
                            'type' => $number['type'],
                            'number' => $number['number'],
                            'text' => 'ปิดรับแทง'
                        ];

                        // เก็บเลขที่เต็ม และปิดรับ
                        if(!isset($close_numbers[$number['type']])){
                            $close_numbers[$number['type']] = [];
                        }
                        
                        if(!in_array($number['number'], $close_numbers[$number['type']]) ){
                            $close_numbers[$number['type']][] = $number['number'];
                        }
                        
                       

                    }else{
                        $invalid_numbers[] = [
                            'error' => 'limit',
                            'type' => $number['type'],
                            'number' => $number['number'],
                            'text' => 'รับแทงสูงสุด '.($number['amount'] - $amount_over)
                        ];
                    }
                }else{

                    /*
                    คำนวนส่วนลด และ คอมมิชชั่น
                    */
                    $follow_comission = 0;
                    $follow_receive = 0;

                    if(isset($referers['Admin'])){
                        $follow_receive = $follow_receive + $set_number['ad_receive'];
                        $ad_commission = round( ( $follow_receive * $set_number['ad_discount'] )/100, 2, PHP_ROUND_HALF_UP);
                        $set_number['ad_commission'] = -$ad_commission;
                        $follow_comission = $ad_commission;
                    }

                    if(isset($referers['Senior'])){
                        $follow_receive = $follow_receive + $set_number['se_receive'];
                        $se_commission = round( ( $follow_receive * $set_number['se_discount'] )/100, 2, PHP_ROUND_HALF_UP);
                        $set_number['se_commission'] = $follow_comission - $se_commission;
                        $follow_comission = $se_commission;
                    }

                    if(isset($referers['Master'])){
                        $follow_receive = $follow_receive + $set_number['ma_receive'];
                        $ma_commission = round( ( $follow_receive * $set_number['ma_discount'] )/100, 2, PHP_ROUND_HALF_UP);
                        $set_number['ma_commission'] = $follow_comission - $ma_commission;
                        $follow_comission = $ma_commission;
                    }

                    if(isset($referers['Agent'])){
                        $follow_receive = $follow_receive + $set_number['ag_receive'];
                        $ag_commission = round( ( $follow_receive * $set_number['ag_discount'] )/100, 2, PHP_ROUND_HALF_UP);
                        $set_number['ag_commission'] = $follow_comission - $ag_commission;
                    }

                    $set_numbers[] = $set_number;
                }

            } // for..each

            
            // บันทึกเลขที่ปิดรับ
            $lottery_options = unserialize($lottery->lottery_options);
            $has_new_close_number = false;
            foreach($close_numbers as $number_type => $close_number){
                foreach($close_number as $number){
                    if(strpos($lottery_options[$number_type], $number) === false){
                        $has_new_close_number = true;
                        if($lottery_options[$number_type]){
                            $lottery_options[$number_type] = $lottery_options[$number_type].','.$number;
                        }else{
                            $lottery_options[$number_type] = $number;
                        }
                    }
                }
            }

            if($has_new_close_number){
                $lottery->lottery_options = serialize($lottery_options);
                $lottery->save();
            }

            if(count($invalid_numbers) > 0){
                return $response->withJson([
                    'result' => 'invalid',
                    'invalid_numbers' => $invalid_numbers
                ]);
            }

			if($Ticket->save()){

                foreach($set_numbers as $save_number){

                    $TicketNumber               = new TicketNumber();
                    $TicketNumber->lottery_id   = $lottery->lottery_id;
                    $TicketNumber->ticket_id    = $Ticket->ticket_id;
                    $TicketNumber->user_id      = $account->user_id;

                    $TicketNumber->t_type       = $save_number['t_type'];
                    $TicketNumber->t_number     = $save_number['t_number'];
                    $TicketNumber->t_pay        = $save_number['t_pay'];
                    $TicketNumber->t_amount     = $save_number['t_amount'];
                    $TicketNumber->t_discount   = $save_number['t_discount'];
                    $TicketNumber->t_credit     = $save_number['t_credit'];
                    $TicketNumber->t_return     = $save_number['t_return'];
                    $TicketNumber->t_status     = $save_number['t_status'];

                    $TicketNumber->ag_id        = isset($save_number['ag_id']) ? $save_number['ag_id'] : 0;
                    $TicketNumber->ma_id        = isset($save_number['ma_id']) ? $save_number['ma_id'] : 0;
                    $TicketNumber->se_id        = isset($save_number['se_id']) ? $save_number['se_id'] : 0;
                    $TicketNumber->ad_id        = isset($save_number['ad_id']) ? $save_number['ad_id'] : 0;

                    if($TicketNumber->ag_id > 0){
                        $TicketNumber->ag_share     = $save_number['ag_share'];
                        $TicketNumber->ag_pay       = $save_number['ag_pay'];
                        $TicketNumber->ag_discount  = $save_number['ag_discount'];
                        $TicketNumber->ag_receive   = $save_number['ag_receive'];
                        $TicketNumber->ag_commission = $save_number['ag_commission'];
                    }

                    if($TicketNumber->ma_id > 0){
                        $TicketNumber->ma_share     = $save_number['ma_share'];
                        $TicketNumber->ma_pay       = $save_number['ma_pay'];
                        $TicketNumber->ma_discount  = $save_number['ma_discount'];
                        $TicketNumber->ma_receive   = $save_number['ma_receive'];
                        $TicketNumber->ma_commission = $save_number['ma_commission'];
                    }

                    if($TicketNumber->se_id > 0){
                        $TicketNumber->se_share     = $save_number['se_share'];
                        $TicketNumber->se_pay       = $save_number['se_pay'];
                        $TicketNumber->se_discount  = $save_number['se_discount'];
                        $TicketNumber->se_receive   = $save_number['se_receive'];
                        $TicketNumber->se_commission = $save_number['se_commission'];
                    }

                    $TicketNumber->ad_share     = $save_number['ad_share'];
                    $TicketNumber->ad_pay       = $save_number['ad_pay'];
                    $TicketNumber->ad_discount  = $save_number['ad_discount'];
                    $TicketNumber->ad_receive   = $save_number['ad_receive'];
                    $TicketNumber->ad_commission = $save_number['ad_commission'];

                    $TicketNumber->save();
                }

				CreditService::update_credit([
                    'user_id'       => $account->user_id, 
                    'credit_type'   => 'betting', 
                    'credit_amount' => -$input['total_amount'], 
                    'credit_note'   => LotteryService::lottery_name($lottery)." โพย {$Ticket->ticket_id}", 
                    'credit_ref_id' => $Ticket->ticket_id
                ]);

                TicketService::update_total_amount($Ticket->ticket_id);
			}

        	return $response->withJson([
				'result' => 'success'
			]);
        }

		return $response->withJson([
			'result' => 'error',
			'title' => 'ผิดพลาด!',
			'errorText' => 'ข้อมูลไม่ถูกต้อง'
		]);
    }

    public function get_numbers($request, $response, $args){
    	
    	$GroupTicket = Ticket::select('ticket_id', 'lottery_id', 'ticket_name')->where('lottery_id', $args['lottery_id']);

    	$TicketNumber = TicketNumber::where('ticket_numbers.lottery_id', '=', $args['lottery_id']);

    	if(AuthService::is_member()){
    		$GroupTicket->where('user_id', '=', AuthService::current_login('user_id'));

    		$TicketNumber->where('ticket_numbers.user_id', '=', AuthService::current_login('user_id'));

    		$TicketNumber->join('tickets', 'tickets.ticket_id', 'ticket_numbers.ticket_id');

    		$TicketNumber->select(
    			'ticket_numbers.t_number_id',
    			'ticket_numbers.ticket_id',
    			'ticket_numbers.created_at', 
    			'ticket_numbers.t_type',
    			'ticket_numbers.t_number',
    			'ticket_numbers.t_amount',
    			'ticket_numbers.t_discount',
    			'ticket_numbers.t_credit',
    			'tickets.ticket_name',
    			'ticket_numbers.t_status'
    		);
    	}

    	if(isset($args['ticket_id']) && $args['ticket_id']>0){
    		$TicketNumber->where('ticket_numbers.ticket_id', '=', $args['ticket_id']);
    	}

    	$TicketNumber->where('t_status', '<>', 'Cancel');
    	$TicketNumber->orderBy('t_number_id', 'DESC');

    	$numbers = $TicketNumber->get();

    	return $response->withJson([
			'result' => 'success',
			'numbers' => $numbers,
			'tickets' => $GroupTicket->get(),
			'summary' => $this->summary($numbers)
		]);
    }

    protected function summary($numbers){
    	$summary = [
    		'amount' => 0,
    		'discount' => 0,
    		'credit' => 0
    	];
    	
    	foreach ($numbers as $number) {
    		if($number->t_status == 'New'){
    			$summary['amount'] += $number->t_amount;
    			$summary['discount'] += $number->t_discount;
    			$summary['credit'] += $number->t_credit;
    		}
    	}

    	return $summary;
    }

    public function cancel_ticket($request, $response, $args){
    	$input = $request->getParsedBody();

    	if($input['ticket_id']==$args['ticket_id']){

    		$Ticket = Ticket::with('lottery')
    						->where('ticket_id', '=', $args['ticket_id'])
    						->where('user_id', '=', AuthService::current_login('user_id'))
    						->first();

    		if($Ticket){
    			if(TicketService::can_cancel($Ticket->lottery->close_date, $Ticket->created_at)){
    				if(TicketService::cancel_ticket($Ticket->ticket_id)){
    					return $response->withJson([
							'result' => 'success'
						]);
    				}
    			}else{
    				return $response->withJson([
						'result' => 'error',
						'title' => 'ผิดพลาด!',
						'errorText' => 'ไม่สามารถคืนโพยได้'
					]);
    			}
    		}
    	}

    	return $response->withJson([
			'result' => 'error',
			'title' => 'ผิดพลาด!',
			'errorText' => 'ข้อมูลไม่ถูกต้อง'
		]);
    }

    public function cancel_number($request, $response, $args){
    	$input = $request->getParsedBody();

    	if($input['number_id']==$args['number_id']){

    		$TicketNumber = TicketNumber::with('lottery')
    						->where('t_number_id', '=', $args['number_id'])
    						->where('user_id', '=', AuthService::current_login('user_id'))
    						->first();

    		if(TicketService::can_cancel($TicketNumber->lottery->close_date, $TicketNumber->created_at)){

    			$TicketNumber->t_status = 'Cancel';
    			if($TicketNumber->save()){

    				TicketService::update_total_amount($TicketNumber->ticket_id);

    				CreditService::update_credit([
	                    'user_id'       => $TicketNumber->user_id, 
	                    'credit_type'   => 'cancel-number', 
	                    'credit_amount' => $TicketNumber->t_credit, 
	                    'credit_note'   => LotteryService::lottery_name($TicketNumber->lottery)." หมายเลข {$TicketNumber->t_number}", 
	                    'credit_ref_id' => $TicketNumber->t_number_id
	                ]);

	                return $response->withJson([
						'result' => 'success'
					]);
    			}
    			
    		}else{
    			return $response->withJson([
					'result' => 'error',
					'title' => 'ผิดพลาด!',
					'errorText' => 'ไม่สามารถยกเลิกได้'
				]);
    		}

    	}

    	return $response->withJson([
			'result' => 'error',
			'title' => 'ผิดพลาด!',
			'errorText' => 'ข้อมูลไม่ถูกต้อง'
		]);
    }

    public function cancel_numbers($request, $response, $args){
    	$input = $request->getParsedBody();
    	
    	$return_credit = 0;
    	$success_numbers = [];
    	$ticket_ids = [];

    	foreach($input['numbers'] as $number){
    		$TicketNumber = TicketNumber::with('lottery')
    						->where('t_number_id', '=', $number)
    						->where('lottery_id', '=', $args['lottery_id'])
    						->where('user_id', '=', AuthService::current_login('user_id'))
    						->first();

    		if($TicketNumber && TicketService::can_cancel($TicketNumber->lottery->close_date, $TicketNumber->created_at)){

    			$TicketNumber->t_status = 'Cancel';
    			if($TicketNumber->save()){
    				$return_credit += $TicketNumber->t_credit;
    				$success_numbers[] = $TicketNumber->t_number;
    				if(!in_array($TicketNumber->ticket_id, $ticket_ids)){
    					$ticket_ids[] = $TicketNumber->ticket_id;
    				}
    			}
    		}
    	}

    	if($return_credit > 0){

			CreditService::update_credit([
                'user_id'       => AuthService::current_login('user_id'), 
                'credit_type'   => 'cancel-numbers', 
                'credit_amount' => $return_credit, 
                'credit_note'   => LotteryService::lottery_name($TicketNumber->lottery)." หมายเลข ".implode(', ', $success_numbers), 
                'credit_ref_id' => $args['lottery_id']
            ]);

            foreach($ticket_ids as $ticket_id){
            	TicketService::update_total_amount($ticket_id);
            }

            return $response->withJson([
				'result' => 'success'
			]);
    	}
    }

    public function recent_tickets($request, $response, $args){
        

    	return $response->withJson([
			'result' => 'success',
			'tickets' => TicketService::get_tickets(date("Y-m-d 00:00:00"), date("Y-m-d 23:59:59"))
		]);
    } // recent_tickets


    public function recent_tickets_filter($request, $response, $args){
        
        $lotto_type=$_GET['lotto_type'];
        
        
        $raw_data = TicketService::get_tickets_filter(date("Y-m-d 00:00:00"), date("Y-m-d 23:59:59"),$lotto_type);
        

        $total_credit = 0;
        $total_discount_credit = 0;
        $net_total_credit = 0;
        $total_win_credit = 0;

        foreach ($raw_data as $data) {
            $total_credit += $data->total_amount;
            $total_discount_credit += $data->total_discount;
            $total_win_credit += $data->result_amount;
        }

        //$net_total_credit = ($total_discount + $total_win_credit);
        $net_total_credit = ($total_credit + $total_discount);

        $summary = array(
            'total_credit' => $total_credit,
            'total_discount_credit' => $total_discount_credit,
            'net_total_credit' => $net_total_credit,
            'total_win_credit' => $total_win_credit
        );

		return $response->withJson([
			'result' => 'success',
            'tickets' => $raw_data,
            'summary' => $summary
		]);
    } // recent_tickets_filter

    /**
     * get history data
     */
    public function history_tickets($request, $response, $args){
    	$from = isset($_GET['from']) ? $_GET['from'] : date("Y-m-d 00:00:00");
        $to = isset($_GET['to']) ? $_GET['to'] : date("Y-m-d 23:59:59");
        $lotto_type = $_GET['lotto_type'];
        
        $raw_data = TicketService::get_tickets_filter($from, $to, $lotto_type);
        //print_r($raw_data);


        $total_credit = 0;
        $total_discount_credit = 0;
        $net_total_credit = 0;
        $total_win_credit= 0;

        foreach ($raw_data as $data) {
            $total_credit += $data->total_amount;
            $total_discount_credit += $data->total_discount;
            $total_win_credit += $data->result_amount;
        }

        $net_total_credit = ($total_credit + $total_discount) + $total_win_credit;

        $summary = array(
            'total_credit' => $total_credit,
            'total_discount_credit' => $total_discount_credit,
            'total_win_credit' => $total_win_credit,
            'net_total_credit' => $net_total_credit
        );

		return $response->withJson([
			'result' => 'success',
            'tickets' => $raw_data,
            'summary' => $summary
		]);
    } // history_tickets

    public function get_ticket($request, $response, $args){
    	
    	$ticket = TicketService::get_ticket($args['ticket_id']);

    	if($ticket){
    		$lottery = Lottery::find($ticket->lottery_id);
    		$result = unserialize($lottery->lottery_result);
	    	return $response->withJson([
				'result' => 'success',
				'ticket' => $ticket,
				'number_results' => $result
			]);
    	}else{
    		return $response->withJson([
				'result' => 'invalid'
			]);
    	}
    }

}
?>