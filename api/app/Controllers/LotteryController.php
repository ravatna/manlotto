<?php  
namespace App\Controllers;

use App\Controllers\Controller;

use App\Configs\LotteryConfig;

use App\Models\Lottery;
use App\Models\Ticket;
use App\Models\TicketNumber;
use App\Models\Summary;

use App\Services\LotteryService;
use App\Services\TicketService;
use App\Services\CreditService;
use App\Services\AuthService;

class LotteryController extends Controller
{

    public function lottery_options($request, $response, $args){

        if(AuthService::is_admin()){
            return $response->withJson([
                'result' => 'success',
                'options' => LotteryConfig::$options
            ]);
        }else{
            return $response->withJson([
                'result' => 'success',
                'options' => AuthService::current_login('bet_setting', true)
            ]);
        }

    }

    public function lottery_settings($request, $response, $args){
        return $response->withJson([
            'result' => 'success',
            'settings' => LotteryService::lottery_opens()
        ]);
    }

	public function save_lottery($request, $response, $args){
        $input = $request->getParsedBody();

        $Lottery = new Lottery();
        $Lottery->lottery_type          = $input['lottery_type'];
        $Lottery->lottery_date          = $input['lottery_date'];
        $Lottery->lottery_no            = $input['lottery_no'];
        $Lottery->lottery_status        = $input['lottery_status'];
        $Lottery->lottery_options       = serialize($input['lottery_options']);
        $Lottery->open_date             = $input['open_date'];
        $Lottery->close_date            = $input['close_date'];

        if($Lottery->save()){
            return $response->withJson([
				'result' => 'success',
				'lottery_id' => $Lottery->lottery_id
			]);
        }

        return $response->withJson([
			'result' => 'error'
		]);
    }

    public function update_lottery($request, $response, $args){
        $input = $request->getParsedBody();
        
        $Lottery = Lottery::find($args['lottery_id']);

        if($Lottery){
            $Lottery->lottery_type          = $input['lottery_type'];
            $Lottery->lottery_date          = $input['lottery_date'];
            $Lottery->lottery_no            = $input['lottery_no'];
            $Lottery->lottery_status        = $input['lottery_status'];
            $Lottery->lottery_options       = serialize($input['lottery_options']);
            $Lottery->open_date             = $input['open_date'];
            $Lottery->close_date            = $input['close_date'];

            if($Lottery->save()){
                return $response->withJson([
                    'result' => 'success',
                    'lottery_id' => $Lottery->lottery_id
                ]);
            }
        }

        return $response->withJson([
			'result' => 'error'
		]);
    }


    /**
     * List data scope list group lotto
     */
    public function lotteries($request, $response, $args){
        
        $lotteries = Lottery::where("lottery_type", $args['lottery_group'])->orderBy("close_date", "DESC")->take(20)->get();

        $lottery_data = [];
        foreach($lotteries as $lottery){
            $lottery_data[] = LotteryService::lottery_data($lottery);
        }

        return $response->withJson([
            'result' => 'success',
            'args' => $args,
            'lotteries' => $lottery_data
        ]);
    }

    /*public function lao_lotteries($request, $response, $args){
        $lotteries = Lottery::where("lottery_type", "lao-lottery")->orderBy("close_date", "DESC")->take(20)->get();

        $lottery_data = [];
        foreach($lotteries as $lottery){
            $lottery_data[] = LotteryService::lottery_data($lottery);
        }

        return $response->withJson([
            'result' => 'success',
            'lotteries' => $lottery_data
        ]);
    }*/

    /*public function hanoi_lotteries($request, $response, $args){
        $lotteries = Lottery::where("lottery_type", "hanoi-lottery")->orderBy("close_date", "DESC")->take(20)->get();

        $lottery_data = [];
        foreach($lotteries as $lottery){
            $lottery_data[] = LotteryService::lottery_data($lottery);
        }

        return $response->withJson([
            'result' => 'success',
            'lotteries' => $lottery_data
        ]);
    }*/

    public function get_lottery($request, $response, $args){
        $lottery = Lottery::find($args['lottery_id']);
        if($lottery){
            $promotion = AuthService::current_login('bet_opens', true);
            return $response->withJson([
                'result' => 'success',
                'lottery' => LotteryService::lottery_data($lottery),
                'promotion' => $promotion[$lottery->lottery_type]['option'],
                'awards' => LotteryService::lottery_awards($lottery->lottery_type)
            ]);
        }

        return $response->withJson([
            'result' => 'invalid'
        ]);
    }

    public function last_lottery($request, $response, $args){

        //print_r(AuthService::current_login('bet_opens', true)); exit();

        $lotteries = [];

        if(AuthService::is_admin()){
            foreach(LotteryConfig::get_groups() as $group){
                $lotteries[] = [
                    'group' => $group,
                    'data' => LotteryService::last_lottery($group),
                    'sv_time' => date("Y-m-d H:i:s")
                ];
            }
        }else{
            foreach(AuthService::current_login('bet_opens', true) as $group => $option){
                if($option['is_open']){
                    $lotteries[] = [
                        'group' => $group,
                        'data' => LotteryService::last_lottery($group),
                        'sv_time' => date("Y-m-d H:i:s")
                    ];
                }
            }
        }

        return $response->withJson([
            'result' => 'success',
            'lotteries' => $lotteries
        ]);
    }

    public function last_lao_lottery($request, $response, $args){
        return $response->withJson([
            'result' => 'success',
            'lottery' => LotteryService::last_lottery('lao-lottery')
        ]);
    }

    public function save_result($request, $response, $args){

        $input = $request->getParsedBody();
        if($args['lottery_id'] == $input['lottery_id']){

            $Lottery = Lottery::find($args['lottery_id']);
            if($Lottery){
                $Lottery->lottery_result = serialize($input['result']);
                $Lottery->lottery_status = 'process';

                if($Lottery->save()){

                    Ticket::where('lottery_id', '=', $Lottery->lottery_id)
                        ->where('status', '<>', 'Cancel')
                        ->update([
                            'status' => 'Process'
                        ]);

                    TicketNumber::where('lottery_id', '=', $Lottery->lottery_id)
                        ->where('t_status', '<>', 'Cancel')
                        ->update([
                            't_status' => 'Process',
                            'is_win' => 'no'
                        ]);

                    TicketService::UpdateWin($Lottery->lottery_id);
                    
                    return $response->withJson([
                        'result' => 'success'
                    ]);
                }
            }
        }

        return $response->withJson([
            'result' => 'invalid'
        ]);
    }

    public function get_wins($request, $response, $args){
        return $response->withJson([
            'result' => 'success',
            'numbers' => TicketNumber::select('ticket_numbers.*')
                            ->join('tickets', 'tickets.ticket_id', '=', 'ticket_numbers.ticket_id')
                            ->with('member')
                            ->with('ticket')
                            ->where('ticket_numbers.lottery_id', '=', $args['lottery_id'])
                            ->where('ticket_numbers.is_win', '=', 'yes')
                            ->get(),
            'summary' => [
                'return' => TicketNumber::join('tickets', 'tickets.ticket_id', '=', 'ticket_numbers.ticket_id')
                            ->where('ticket_numbers.lottery_id', '=', $args['lottery_id'])
                            ->where('ticket_numbers.is_win', '=', 'yes')
                            ->sum('ticket_numbers.t_return')
            ]
        ]);
    }

    public function confirm_result($request, $response, $args){

        $input = $request->getParsedBody();
        if($args['lottery_id'] == $input['lottery_id']){
            $Lottery = Lottery::find($args['lottery_id']);
            if($Lottery){
                $Lottery->lottery_status = 'success';
                //if($Lottery->save()){

                    // หาตัวเลขที่ถูกรางวัล
                    $WinNumbers = TicketNumber::select('ticket_numbers.t_number_id')
                                    ->join('tickets', 'tickets.ticket_id', '=', 'ticket_numbers.ticket_id')
                                    ->where('ticket_numbers.lottery_id', '=', $args['lottery_id'])
                                    ->where('ticket_numbers.is_win', '=', 'yes')
                                    ->where('ticket_numbers.t_status', '=', 'Process')
                                    ->get();

                    $WinTickets = [];
                    foreach($WinNumbers as $number){

                        // อัพเดตตัวเลขที่ถูกรางวัล
                        $TicketNumber = TicketNumber::find($number->t_number_id);
                        if(!$TicketNumber) continue;

                        $TicketNumber->t_result = $TicketNumber->t_return;
                        $TicketNumber->t_status = 'Win';

                        // ยอดที่ ad ต้องจ่ายให้ se
                        $TicketNumber->ad_win = $TicketNumber->ad_receive * $TicketNumber->ad_pay;

                        // ยอดที่ se ต้องจ่ายให้ ma
                        $total_se_win = ($TicketNumber->ad_receive + $TicketNumber->se_receive) * $TicketNumber->se_pay;
                        // เฉพาะของ se ที่ต้องจ่าย
                        $TicketNumber->se_win = $TicketNumber->se_receive * $TicketNumber->se_pay;
                        // ส่วนต่างที่ se จะได้รับ
                        $TicketNumber->se_diff_win = ($TicketNumber->ad_win + $TicketNumber->se_win) - $total_se_win;

                        // ยอดที่ ma ต้องจ่ายให้ ag
                        $total_ma_win = ($TicketNumber->ad_receive + $TicketNumber->se_receive + $TicketNumber->ma_receive) * $TicketNumber->ma_pay;
                        // เฉพาะของ ma ที่ต้องจ่าย
                        $TicketNumber->ma_win = $TicketNumber->ma_receive * $TicketNumber->ma_pay;
                        // ส่วนต่างที่ ma จะได้รับ
                        $TicketNumber->ma_diff_win = ($total_se_win + $TicketNumber->ma_win) - $total_ma_win;

                        // ยอดที่ ag ต้องจ่ายให้ member
                        $total_ag_win = $TicketNumber->t_return;
                        // เฉพาะของ ag ที่ต้องจ่าย
                        $TicketNumber->ag_win = $TicketNumber->ag_receive * $TicketNumber->ag_pay;
                        // ส่วนต่างที่ ag จะได้รับ
                        $TicketNumber->ag_diff_win = ($total_ma_win + $TicketNumber->ag_win) - $total_ag_win;

                        if($TicketNumber->save()){

                            if(!in_array($TicketNumber->ticket_id, $WinTickets)){
                                $WinTickets[] = $TicketNumber->ticket_id;
                            }

                            // เพิ่มเครดิตให้สามาชิกที่ถูกรางวัล
                            CreditService::update_credit([
                                'user_id'       => $TicketNumber->user_id, 
                                'credit_type'   => 'Win', 
                                'credit_amount' => $TicketNumber->t_return, 
                                'credit_note'   => LotteryService::number_type($TicketNumber->t_type)." - ".LotteryService::lottery_name($Lottery)." - โพย #{$TicketNumber->ticket_id}", 
                                'credit_ref_id' => $TicketNumber->ticket_id
                            ]);

                        }

                    }

                    foreach($WinTickets as $WinTicketID) {
                        // อัพเดตสถานะโพยที่ถูกรางวัล
                        if($WinTicketID){
                            Ticket::where('ticket_id', '=', $WinTicketID)->update(['status'=>'Win']);
                            TicketService::update_total_amount($WinTicketID);
                        }
                    }

                    // อัพเดตโพยที่ไม่ถูกรางวัล
                    Ticket::where('lottery_id', '=', $Lottery->lottery_id)
                            ->where('status', '=', 'Process')
                            ->update(['status' => 'Lose']);

                    // อัพเดตเลขที่ไม่ถูกรางวัล
                    TicketNumber::where('lottery_id', '=', $Lottery->lottery_id)
                            ->where('t_status', '=', 'Process')
                            ->where('is_win', '=', 'no')
                            ->update(['t_status' => 'Lose', 't_result' => 0.00]);

                    // หา user เพื่ออัพเดตสรุปยอดหวย
                    $LotteryUsers = Ticket::select('user_id', 'ag_id', 'ma_id', 'se_id', 'ad_id')
                            ->where('lottery_id', '=', $Lottery->lottery_id)
                            ->where('status', '<>', 'Cancel')
                            ->groupBy('user_id')
                            ->get();

                    foreach($LotteryUsers as $LotteryUser){

                        if($LotteryUser->ag_id > 0){
                            TicketService::SaveSummary('ag', $LotteryUser->ag_id, $Lottery);
                        }

                        if($LotteryUser->ma_id > 0){
                            TicketService::SaveSummary('ma', $LotteryUser->ma_id, $Lottery);
                        }

                        if($LotteryUser->se_id > 0){
                            TicketService::SaveSummary('se', $LotteryUser->se_id, $Lottery);
                        }

                        if($LotteryUser->ad_id > 0){
                            TicketService::SaveSummary('ad', $LotteryUser->ad_id, $Lottery);
                        }

                    }

                    $Lottery->save();

                    return $response->withJson([
                        'result' => 'success'
                    ]);
                //}
            }
        }

        return $response->withJson([
            'result' => 'invalid',
            'title' => 'ข้อมูลไม่ถูกต้อง',
            'errorText' => ''
        ]);
    }

    public function get_tickets($request, $response, $args){

        $Ticket = Ticket::select(
                        'tickets.ticket_id',
                        'tickets.lottery_id',
                        'tickets.created_at',
                        'tickets.total_amount',
                        'tickets.total_discount',
                        'tickets.total_credit',
                        'tickets.result_amount',
                        'tickets.status',
                        'users.username',
                        'users.ref_user_id'
                    );

        $Ticket->where('tickets.lottery_id', '=', $args['lottery_id']);
        $Ticket->join('users', 'users.user_id', '=', 'tickets.user_id');
        $Ticket->orderBy('tickets.created_at', 'asc');

        if(AuthService::is_agent()){
            $Ticket->where('users.ref_user_id', '=', AuthService::current_login('user_id'));
        }

        return $response->withJson([
            'result' => 'success',
            'tickets' => $Ticket->get(),
            'summary' => [
                'amount' => $Ticket->sum('total_amount'),
                'discount' => $Ticket->sum('total_discount'),
                'credit' => $Ticket->sum('total_credit'),
                'win_amount' => $Ticket->sum('result_amount')
            ]
        ]);
    }

    public function summary($request, $response, $args){

        $TicketNumber = TicketNumber::join('users', 'users.user_id', '=', 'ticket_numbers.user_id')
                            ->groupBy('ticket_numbers.t_type', 'ticket_numbers.t_number')
                            ->where('ticket_numbers.lottery_id', '=', $args['lottery_id'])
                            ->where('ticket_numbers.t_status', '<>', 'Cancel')
                            ->selectRaw('sum(ticket_numbers.t_amount) as amount, sum(ticket_numbers.t_discount) as discount, sum(ticket_numbers.t_credit) as credit, ticket_numbers.t_number, ticket_numbers.t_type');

        $Summary = TicketNumber::join('users', 'users.user_id', '=', 'ticket_numbers.user_id')
                    ->where('ticket_numbers.lottery_id', '=', $args['lottery_id'])
                    ->where('ticket_numbers.t_status', '<>', 'Cancel');

        if(AuthService::is_agent()){
            $TicketNumber->where('users.ref_user_id', '=', AuthService::current_login('user_id'));
            $Summary->where('users.ref_user_id', '=', AuthService::current_login('user_id'));
        }

        if(isset($_GET['type']) && $_GET['type']){
            $TicketNumber->where('ticket_numbers.t_type', '=', $_GET['type']);
            $Summary->where('ticket_numbers.t_type', '=', $_GET['type']);
        }

        return $response->withJson([
            'result' => 'success',
            'numbers' => $TicketNumber->get(),
            'summary' => [
                'amount' => $Summary->sum('t_amount'),
                'discount' => $Summary->sum('t_discount'),
                'credit' => $Summary->sum('t_credit')
            ]
        ]);
    }

    public function results($request, $response, $args){

        $lotteries = Lottery::where('close_date', '<', date("Y-m-d H:i:s"))
                            ->where('lottery_status', '<>', 'close')
                            ->orderBy('close_date', 'desc');

        if(isset($_GET['type']) && $_GET['type']){
            $lotteries->where('lottery_type', '=', $_GET['type']);
        }

        $results = [];
        foreach($lotteries->get() as $lottery){
            $results[] = LotteryService::lottery_data($lottery);
        }

        return $response->withJson([
            'result' => 'success',
            'lotteries' => $results
        ]);

    }

    public function resultslast($request, $response, $args){

        $lotteries = Lottery::where('close_date', '<', date("Y-m-d H:i:s"))
                            ->where('lottery_status', '<>', 'close')
                            ->orderBy('close_date', 'desc');

        if(isset($_GET['type']) && $_GET['type']){
            //$lotteries->where('lottery_type', '=', $_GET['type']);
        }

        $results = [];
        foreach($lotteries->get() as $lottery){
            $results[] = LotteryService::lottery_data($lottery)->first();
        }

        return $response->withJson([
            'result' => 'success',
            'lotteries' => $results
        ]);

    }
}
?>