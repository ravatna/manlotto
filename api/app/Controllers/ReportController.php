<?php  
namespace App\Controllers;

use Illuminate\Database\Capsule\Manager as DB;

use App\Controllers\Controller;

use App\Configs\MemberConfig;
use App\Configs\LotteryConfig;

use App\Models\Lottery;
use App\Models\Ticket;
use App\Models\TicketNumber;
use App\Models\User;
use App\Models\Summary;

use App\Services\AuthService;
use App\Services\LotteryService;
use App\Services\ReportService;
use App\Services\MemberService;
use App\Services\TicketService;

class ReportController extends Controller
{

	public function onprocess($request, $response, $args){

        $lottery_opens = LotteryService::lottery_opens();
        $opens = [];
        foreach ($lottery_opens as $key => $value) {
            $opens[] = $key;
        }

        $getLottery = Lottery::where('lottery_status', '=', 'open')
                            ->where('open_date', '<=', date("Y-m-d H:i:s"))
                            ->whereIn('lottery_type', $opens)
                            ->orderBy('lottery_date', 'ASC')
                            ->orderBy('close_date', 'ASC')
                            ->select('lottery_id', 'lottery_type', 'lottery_date');

        if(isset($_GET['group']) && $_GET['group']){
            $getLottery->where('lottery_type', '=', $_GET['group']);
        }

        $lotteries = [];
        foreach($getLottery->get() as $lottery){
            $lottery->report = ReportService::report($lottery->lottery_id);
            $lotteries[] = $lottery;
        }

        return $response->withJson([
			'result' => 'success',
            'opens' => $opens,
            'lotteries' => $lotteries
		]);
    }

    public function report_by_member($request, $response, $args){

        $current_role = AuthService::current_login('user_role');
        $referers = [];

        if(isset($_GET['member_id']) && $_GET['member_id']>0){
            $member_id = $_GET['member_id'];

            $current_referer = User::find($member_id);
            $referers[] = [
                'username' => $current_referer->username,
                'user_id' => $current_referer->user_id,
                'user_role' => $current_referer->user_role,
                'active' => true
            ];

            $referer = MemberService::get_referer($member_id);
            while($referer){
                
                if($current_role == $referer['user_role']){
                    $referer = false;
                }else{
                    $referers[] = [
                        'username' => $referer['username'],
                        'user_id' => $referer['user_id'],
                        'user_role' => $referer['user_role'],
                        'active' => false
                    ];

                    $referer = MemberService::get_referer($referer['user_id']);
                }
            }

        }else{
            $member_id = AuthService::current_login('user_id');
        }

        $Members = User::where('ref_user_id', '=', $member_id)->get();
        $report_members = [];
        foreach($Members as $member){
            $report_member = [
                'user_role' => $member->user_role,
                'user_id' => $member->user_id,
                'username' => $member->username
            ];

            switch($member->user_role){
                case 'Member':
                    $Ticket = Ticket::where('lottery_id', '=', $args['lottery_id'])->where('user_id', '=', $member->user_id)->where('status', '<>', 'Cancel');
                break;

                case 'Agent':
                    $Ticket = Ticket::where('lottery_id', '=', $args['lottery_id'])->where('ag_id', '=', $member->user_id)->where('status', '<>', 'Cancel');
                break;

                case 'Master':
                    $Ticket = Ticket::where('lottery_id', '=', $args['lottery_id'])->where('ma_id', '=', $member->user_id)->where('status', '<>', 'Cancel');
                break;

                case 'Senior':
                    $Ticket = Ticket::where('lottery_id', '=', $args['lottery_id'])->where('se_id', '=', $member->user_id)->where('status', '<>', 'Cancel');
                break;
            }

            $report_member['member'] = ReportService::report_by_member_mem($Ticket);
            $report_member['agent'] = ReportService::report_by_member_ag($Ticket, $current_role);
            $report_member['master'] = ReportService::report_by_member_ma($Ticket, $current_role);
            $report_member['senior'] = ReportService::report_by_member_se($Ticket, $current_role);
            $report_member['admin'] = ReportService::report_by_member_ad($Ticket, $current_role);

            if($Ticket->sum('total_amount') < 0){
                $report_members[] = $report_member;
            }
        }

        return $response->withJson([
            'result' => 'success',
            'role' => $current_role,
            'member_id' => $member_id,
            'members' => $report_members,
            'roles' => MemberConfig::$member_type,
            'referers' => array_reverse($referers)
        ]);
    }

    public function report_by_member_ticket($request, $response, $args){

        $current_role = AuthService::current_login('user_role');
        $referers = [];
        $member_id = $_GET['member_id'];

        $current_referer = User::find($member_id);
        $referers[] = [
            'username' => $current_referer->username,
            'user_id' => $current_referer->user_id,
            'user_role' => $current_referer->user_role,
            'active' => true
        ];

        $referer = MemberService::get_referer($member_id);
        while($referer){
            if($current_role == $referer['user_role']){
                $referer = false;
            }else{
                $referers[] = [
                    'username' => $referer['username'],
                    'user_id' => $referer['user_id'],
                    'user_role' => $referer['user_role'],
                    'active' => false
                ];
                $referer = MemberService::get_referer($referer['user_id']);
            }
        }

        $TicketNumber = TicketNumber::join('tickets', 'ticket_numbers.ticket_id', '=', 'tickets.ticket_id')
                            ->join('users', 'ticket_numbers.user_id', '=', 'users.user_id')
                            ->where('ticket_numbers.lottery_id', '=', $args['lottery_id'])
                            ->where('ticket_numbers.user_id', '=', $member_id)
                            ->where('ticket_numbers.t_status', '<>', 'Cancel');
                            //->select(['users.username', 'tickets.ticket_id', 'ticket_numbers.created_at', 'ticket_numbers.t_type', 'ticket_numbers.t_number', 'ticket_numbers.t_amount', 'ticket_numbers.ag_receive']);

        $select = [
            'users.username', 
            'tickets.ticket_id', 
            'ticket_numbers.created_at', 
            'ticket_numbers.t_type', 
            'ticket_numbers.t_number', 
            'ticket_numbers.t_amount', 
            'ticket_numbers.ag_receive'
        ];

        switch($current_role){
            case 'Agent':
                $select[] = DB::raw("0 as ma_receive");
                $select[] = DB::raw("0 as se_receive");
                $select[] = DB::raw("(ticket_numbers.ma_receive + ticket_numbers.se_receive + ticket_numbers.ad_receive) as ad_receive");
            break;

            case 'Master':
                $select[] = 'ticket_numbers.ma_receive';
                $select[] = DB::raw("0 as se_receive");
                $select[] = DB::raw("(ticket_numbers.se_receive + ticket_numbers.ad_receive) as ad_receive");
            break;

            case 'Senior':
            case 'Admin':
                $select[] = 'ticket_numbers.ma_receive';
                $select[] = 'ticket_numbers.se_receive'; 
                $select[] = 'ticket_numbers.ad_receive';
            break;
        }

        $TicketNumber->select($select);

        return $response->withJson([
            'result' => 'success',
            'role' => $current_role,
            'member_id' => $member_id,
            'numbers' => $TicketNumber->get(),
            'referers' => array_reverse($referers)
        ]);

    }

    public function report_by_type($request, $response, $args){
        $Lottery = Lottery::find($args['lottery_id']);
        if(!$Lottery){
            return $response->withJson([
                'result' => 'invalid'
            ]);
        }

        $current_role = AuthService::current_login('user_role');
        $user_id = AuthService::current_login('user_id');

        $options = LotteryConfig::$groups[$Lottery->lottery_type];
        
        $reports = [];
        foreach($options as $key => $option){
            $summary = TicketNumber::join('tickets', 'ticket_numbers.ticket_id', '=', 'tickets.ticket_id')
                            ->where('ticket_numbers.lottery_id', '=', $Lottery->lottery_id)
                            ->where('ticket_numbers.t_type', '=', $key)
                            ->where('ticket_numbers.t_status', '<>', 'Cancel');

            $select = [
                DB::raw("'{$key}' as type"),
                DB::raw("ROUND(SUM(ticket_numbers.t_amount), 2) as amount"),
                DB::raw("ROUND(SUM(ticket_numbers.t_discount), 2) as discount"),
                DB::raw("ROUND(SUM(ticket_numbers.t_credit), 2) as credit"),

                DB::raw("ROUND(SUM(ticket_numbers.ag_receive), 2) as ag_receive"),
                DB::raw("ROUND(SUM(ticket_numbers.ag_commission), 2) as ag_commission"),
                DB::raw("ROUND(SUM(ticket_numbers.ag_receive + ticket_numbers.ag_commission), 2) as ag_total")
            ];

            switch($current_role){
                case 'Agent':
                    $summary->where('tickets.ag_id', '=', $user_id);

                    $select[] = DB::raw("'-' as ma_receive");
                    $select[] = DB::raw("'-' as ma_commission");
                    $select[] = DB::raw("'-' as ma_total");

                    $select[] = DB::raw("'-' as se_receive");
                    $select[] = DB::raw("'-' as se_commission");
                    $select[] = DB::raw("'-' as se_total");

                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_receive + ticket_numbers.se_receive + ticket_numbers.ad_receive), 2) as ad_receive");
                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_commission + ticket_numbers.se_commission + ticket_numbers.ad_commission), 2) as ad_commission");
                    $select[] = DB::raw("ROUND(SUM( (ticket_numbers.ma_receive + ticket_numbers.se_receive + ticket_numbers.ad_receive) + (ticket_numbers.ma_commission + ticket_numbers.se_commission + ticket_numbers.ad_commission) ), 2) as ad_total");
                break;

                case 'Master':
                    $summary->where('tickets.ma_id', '=', $user_id);

                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_receive), 2) as ma_receive");
                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_commission), 2) as ma_commission");
                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_receive + ticket_numbers.ma_commission), 2) as ma_total");

                    $select[] = DB::raw("'-' as se_receive");
                    $select[] = DB::raw("'-' as se_commission");
                    $select[] = DB::raw("'-' as se_total");

                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.se_receive + ticket_numbers.ad_receive), 2) as ad_receive");
                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.se_commission + ticket_numbers.ad_commission), 2) as ad_commission");
                    $select[] = DB::raw("ROUND(SUM( (ticket_numbers.se_receive + ticket_numbers.ad_receive) + (ticket_numbers.se_commission + ticket_numbers.ad_commission) ), 2) as ad_total");
                break;

                case 'Senior':
                    $summary->where('tickets.se_id', '=', $user_id);

                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_receive), 2) as ma_receive");
                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_commission), 2) as ma_commission");
                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_receive + ticket_numbers.ma_commission), 2) as ma_total");

                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.se_receive), 2) as se_receive");
                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.se_commission), 2) as se_commission");
                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.se_receive + ticket_numbers.se_commission), 2) as se_total");

                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.ad_receive), 2) as ad_receive");
                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.ad_commission), 2) as ad_commission");
                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.ad_receive + ticket_numbers.ad_commission), 2) as ad_total");
                break;

                case 'Admin':
                    $summary->where('tickets.ad_id', '=', $user_id);

                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_receive), 2) as ma_receive");
                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_commission), 2) as ma_commission");
                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_receive + ticket_numbers.ma_commission), 2) as ma_total");

                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.se_receive), 2) as se_receive");
                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.se_commission), 2) as se_commission");
                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.se_receive + ticket_numbers.se_commission), 2) as se_total");

                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.ad_receive), 2) as ad_receive");
                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.ad_commission), 2) as ad_commission");
                    $select[] = DB::raw("ROUND(SUM(ticket_numbers.ad_receive + ticket_numbers.ad_commission), 2) as ad_total");
                break;
            }

            $summary->select($select);
            $report = $summary->first();

            $reports[] = $report;
        }

        return $response->withJson([
            'result' => 'success',
            'role' => $current_role,
            'reports' => $reports
        ]);
    }

    public function report_by_type_numbers($request, $response, $args){
        $Lottery = Lottery::find($args['lottery_id']);
        if(!$Lottery){
            return $response->withJson([
                'result' => 'invalid'
            ]);
        }

        $current_role = AuthService::current_login('user_role');
        $user_id = AuthService::current_login('user_id');

        $Numbers = TicketNumber::join('tickets', 'ticket_numbers.ticket_id', '=', 'tickets.ticket_id')
                ->where('ticket_numbers.lottery_id', '=', $Lottery->lottery_id)
                ->where('ticket_numbers.t_type', '=', $_GET['type'])
                ->where('ticket_numbers.t_status', '<>', 'Cancel')
                ->groupBy('t_number')
                ->orderBy('t_number', 'asc');

        $select = [
            "t_type as type",
            't_number',
            DB::raw("ROUND(SUM(ticket_numbers.t_amount), 2) as amount"),
            DB::raw("ROUND(SUM(ticket_numbers.t_discount), 2) as discount"),
            DB::raw("ROUND(SUM(ticket_numbers.t_credit), 2) as credit"),

            DB::raw("ROUND(SUM(ticket_numbers.ag_receive), 2) as ag_receive"),
            DB::raw("ROUND(SUM(ticket_numbers.ag_commission), 2) as ag_commission"),
            DB::raw("ROUND(SUM(ticket_numbers.ag_receive + ticket_numbers.ag_commission), 2) as ag_total")
        ];

        switch($current_role){
            case 'Agent':
                $Numbers->where('tickets.ag_id', '=', $user_id);

                $select[] = DB::raw("'-' as ma_receive");
                $select[] = DB::raw("'-' as ma_commission");
                $select[] = DB::raw("'-' as ma_total");

                $select[] = DB::raw("'-' as se_receive");
                $select[] = DB::raw("'-' as se_commission");
                $select[] = DB::raw("'-' as se_total");

                $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_receive + ticket_numbers.se_receive + ticket_numbers.ad_receive), 2) as ad_receive");
                $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_commission + ticket_numbers.se_commission + ticket_numbers.ad_commission), 2) as ad_commission");
                $select[] = DB::raw("ROUND(SUM( (ticket_numbers.ma_receive + ticket_numbers.se_receive + ticket_numbers.ad_receive) + (ticket_numbers.ma_commission + ticket_numbers.se_commission + ticket_numbers.ad_commission) ), 2) as ad_total");
            break;

            case 'Master':
                $Numbers->where('tickets.ma_id', '=', $user_id);

                $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_receive), 2) as ma_receive");
                $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_commission), 2) as ma_commission");
                $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_receive + ticket_numbers.ma_commission), 2) as ma_total");

                $select[] = DB::raw("'-' as se_receive");
                $select[] = DB::raw("'-' as se_commission");
                $select[] = DB::raw("'-' as se_total");

                $select[] = DB::raw("ROUND(SUM(ticket_numbers.se_receive + ticket_numbers.ad_receive), 2) as ad_receive");
                $select[] = DB::raw("ROUND(SUM(ticket_numbers.se_commission + ticket_numbers.ad_commission), 2) as ad_commission");
                $select[] = DB::raw("ROUND(SUM( (ticket_numbers.se_receive + ticket_numbers.ad_receive) + (ticket_numbers.se_commission + ticket_numbers.ad_commission) ), 2) as ad_total");
            break;

            case 'Senior':
                $Numbers->where('tickets.se_id', '=', $user_id);

                $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_receive), 2) as ma_receive");
                $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_commission), 2) as ma_commission");
                $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_receive + ticket_numbers.ma_commission), 2) as ma_total");

                $select[] = DB::raw("ROUND(SUM(ticket_numbers.se_receive), 2) as se_receive");
                $select[] = DB::raw("ROUND(SUM(ticket_numbers.se_commission), 2) as se_commission");
                $select[] = DB::raw("ROUND(SUM(ticket_numbers.se_receive + ticket_numbers.se_commission), 2) as se_total");

                $select[] = DB::raw("ROUND(SUM(ticket_numbers.ad_receive), 2) as ad_receive");
                $select[] = DB::raw("ROUND(SUM(ticket_numbers.ad_commission), 2) as ad_commission");
                $select[] = DB::raw("ROUND(SUM(ticket_numbers.ad_receive + ticket_numbers.ad_commission), 2) as ad_total");
            break;

            case 'Admin':
                $Numbers->where('tickets.ad_id', '=', $user_id);

                $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_receive), 2) as ma_receive");
                $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_commission), 2) as ma_commission");
                $select[] = DB::raw("ROUND(SUM(ticket_numbers.ma_receive + ticket_numbers.ma_commission), 2) as ma_total");

                $select[] = DB::raw("ROUND(SUM(ticket_numbers.se_receive), 2) as se_receive");
                $select[] = DB::raw("ROUND(SUM(ticket_numbers.se_commission), 2) as se_commission");
                $select[] = DB::raw("ROUND(SUM(ticket_numbers.se_receive + ticket_numbers.se_commission), 2) as se_total");

                $select[] = DB::raw("ROUND(SUM(ticket_numbers.ad_receive), 2) as ad_receive");
                $select[] = DB::raw("ROUND(SUM(ticket_numbers.ad_commission), 2) as ad_commission");
                $select[] = DB::raw("ROUND(SUM(ticket_numbers.ad_receive + ticket_numbers.ad_commission), 2) as ad_total");
            break;
        }

        $Numbers->select($select);

        return $response->withJson([
            'result' => 'success',
            'role' => $current_role,
            'reports' => $Numbers->get()
        ]);

    }

    public function report_by_tickets($request, $response, $args){
        $Lottery = Lottery::find($args['lottery_id']);
        if(!$Lottery){
            return $response->withJson([
                'result' => 'invalid'
            ]);
        }

        $current_role = AuthService::current_login('user_role');
        $user_id = AuthService::current_login('user_id');

        $Ticket = Ticket::join('users', 'users.user_id', '=', 'tickets.user_id')
                    ->where('tickets.lottery_id', '=', $Lottery->lottery_id)
                    ->where('tickets.status', '<>', 'Cancel');

        $select = [
            "users.username",
            "users.user_id",
            'tickets.ticket_id',
            'tickets.total_amount',
            DB::raw("ROUND(tickets.total_amount, 2) as amount"),
            DB::raw("ROUND(tickets.total_discount, 2) as discount"),
            DB::raw("ROUND(tickets.total_credit, 2) as credit"),
            'tickets.created_at'
        ];

        switch ($current_role) {

            case 'Agent':
                $Ticket->where('tickets.ag_id', '=', $user_id);

                $select[] = DB::raw("ROUND(tickets.ag_receive, 2) as ag_receive");
                $select[] = DB::raw("ROUND(tickets.ag_commission, 2) as ag_commission");
                $select[] = DB::raw("ROUND((tickets.ag_receive + tickets.ag_commission), 2) as ag_total");

                $select[] = DB::raw("'-' as ma_receive");
                $select[] = DB::raw("'-' as ma_commission");
                $select[] = DB::raw("'-' as ma_total");

                $select[] = DB::raw("'-' as se_receive");
                $select[] = DB::raw("'-' as se_commission");
                $select[] = DB::raw("'-' as se_total");

                $select[] = DB::raw("ROUND(tickets.ma_receive + tickets.se_receive + tickets.ad_receive, 2) as ad_receive");
                $select[] = DB::raw("ROUND(tickets.ma_commission + tickets.se_commission + tickets.ad_commission, 2) as ad_commission");
                $select[] = DB::raw("ROUND((tickets.ma_receive + tickets.se_receive + tickets.ad_receive) + (tickets.ma_commission + tickets.se_commission + tickets.ad_commission), 2) as ad_total");

                break;

            case 'Master':
                $Ticket->where('tickets.ma_id', '=', $user_id);

                $select[] = DB::raw("ROUND(tickets.ag_receive, 2) as ag_receive");
                $select[] = DB::raw("ROUND(tickets.ag_commission, 2) as ag_commission");
                $select[] = DB::raw("ROUND((tickets.ag_receive-tickets.ag_commission), 2) as ag_total");

                $select[] = DB::raw("ROUND(tickets.ma_receive, 2) as ma_receive");
                $select[] = DB::raw("ROUND(tickets.ma_commission, 2) as ma_commission");
                $select[] = DB::raw("ROUND((tickets.ma_receive-tickets.ma_commission), 2) as ma_total");

                $select[] = DB::raw("'-' as se_receive");
                $select[] = DB::raw("'-' as se_commission");
                $select[] = DB::raw("'-' as se_total");

                $select[] = DB::raw("ROUND(tickets.se_receive + tickets.ad_receive, 2) as ad_receive");
                $select[] = DB::raw("ROUND(tickets.se_commission + tickets.ad_commission, 2) as ad_commission");
                $select[] = DB::raw("ROUND((tickets.se_receive + tickets.ad_receive) + (tickets.se_commission + tickets.ad_commission), 2) as ad_total");

                break;

            case 'Senior':
                $Ticket->where('tickets.se_id', '=', $user_id);

                $select[] = DB::raw("ROUND(tickets.ag_receive, 2) as ag_receive");
                $select[] = DB::raw("ROUND(tickets.ag_commission, 2) as ag_commission");
                $select[] = DB::raw("ROUND((tickets.ag_receive + tickets.ag_commission), 2) as ag_total");

                $select[] = DB::raw("ROUND(tickets.ma_receive, 2) as ma_receive");
                $select[] = DB::raw("ROUND(tickets.ma_commission, 2) as ma_commission");
                $select[] = DB::raw("ROUND((tickets.ma_receive + tickets.ma_commission), 2) as ma_total");

                $select[] = DB::raw("ROUND(tickets.se_receive, 2) as se_receive");
                $select[] = DB::raw("ROUND(tickets.se_commission, 2) as se_commission");
                $select[] = DB::raw("ROUND((tickets.se_receive + tickets.se_commission), 2) as se_total");

                $select[] = DB::raw("ROUND(tickets.ad_receive, 2) as ad_receive");
                $select[] = DB::raw("ROUND(tickets.ad_commission, 2) as ad_commission");
                $select[] = DB::raw("ROUND((tickets.ad_receive + tickets.ad_commission), 2) as ad_total");

                break;

            case 'Admin':
                $Ticket->where('tickets.ad_id', '=', $user_id);

                $select[] = DB::raw("ROUND(tickets.ag_receive, 2) as ag_receive");
                $select[] = DB::raw("ROUND(tickets.ag_commission, 2) as ag_commission");
                $select[] = DB::raw("ROUND((tickets.ag_receive + tickets.ag_commission), 2) as ag_total");

                $select[] = DB::raw("ROUND(tickets.ma_receive, 2) as ma_receive");
                $select[] = DB::raw("ROUND(tickets.ma_commission, 2) as ma_commission");
                $select[] = DB::raw("ROUND((tickets.ma_receive + tickets.ma_commission), 2) as ma_total");

                $select[] = DB::raw("ROUND(tickets.se_receive, 2) as se_receive");
                $select[] = DB::raw("ROUND(tickets.se_commission, 2) as se_commission");
                $select[] = DB::raw("ROUND((tickets.se_receive + tickets.se_commission), 2) as se_total");

                $select[] = DB::raw("ROUND(tickets.ad_receive, 2) as ad_receive");
                $select[] = DB::raw("ROUND(tickets.ad_commission, 2) as ad_commission");
                $select[] = DB::raw("ROUND((tickets.ad_receive + tickets.ad_commission), 2) as ad_total");

                break;
        }

        $Ticket->select($select);
        $Ticket->orderBy('tickets.created_at', 'asc');

        return $response->withJson([
            'result' => 'success',
            'role' => $current_role,
            'tickets' => $Ticket->get()
        ]);
    }

    public function report_by_ticket_numbers($request, $response, $args){

        $current_role = AuthService::current_login('user_role');

        $TicketNumber = TicketNumber::join('tickets', 'ticket_numbers.ticket_id', '=', 'tickets.ticket_id')
                            ->join('users', 'ticket_numbers.user_id', '=', 'users.user_id')
                            ->where('ticket_numbers.lottery_id', '=', $args['lottery_id'])
                            ->where('ticket_numbers.ticket_id', '=', $_GET['ticket_id'])
                            ->where('ticket_numbers.t_status', '<>', 'Cancel');

        $select = [
            'users.username', 
            'tickets.ticket_id', 
            'ticket_numbers.created_at', 
            'ticket_numbers.t_type', 
            'ticket_numbers.t_number', 
            'ticket_numbers.t_amount', 
            'ticket_numbers.ag_receive'
        ];

        switch($current_role){
            case 'Agent':
                $select[] = DB::raw("0 as ma_receive");
                $select[] = DB::raw("0 as se_receive");
                $select[] = DB::raw("(ticket_numbers.ma_receive + ticket_numbers.se_receive + ticket_numbers.ad_receive) as ad_receive");
            break;

            case 'Master':
                $select[] = 'ticket_numbers.ma_receive';
                $select[] = DB::raw("0 as se_receive");
                $select[] = DB::raw("(ticket_numbers.se_receive + ticket_numbers.ad_receive) as ad_receive");
            break;

            case 'Senior':
            case 'Admin':
                $select[] = 'ticket_numbers.ma_receive';
                $select[] = 'ticket_numbers.se_receive'; 
                $select[] = 'ticket_numbers.ad_receive';
            break;
        }

        $TicketNumber->select($select);

        return $response->withJson([
            'result' => 'success',
            'role' => $current_role,
            'numbers' => $TicketNumber->get()
        ]);

    }

    public function win_lose($request, $response, $args){

        $user_id = AuthService::current_login('user_id');
        $role = AuthService::current_login('user_role');

        $lotteries = Summary::select(
                            'lottery.lottery_id', 
                            'lottery.lottery_type', 
                            'lottery.lottery_date', 
                            'lottery_summary.receive', 
                            'lottery_summary.commission', 
                            'lottery_summary.win', 
                            'lottery_summary.diff_win'
                        )
                        ->join('lottery', 'lottery.lottery_id', '=', 'lottery_summary.lottery_id')
                        //->where('lottery_summary.user_id', '=', $user_id)
                        ->whereDate("lottery_summary.created_at", ">=", "{$_GET['from']}")
                        ->whereDate("lottery_summary.created_at", "<=", "{$_GET['to']}")
                        ->orderBy('lottery_summary.created_at', 'desc');

        if(isset($_GET['group']) && $_GET['group']){
            $lotteries->where('lottery.lottery_type', '=', $_GET['group']);
        }

        $summaries = [];
        foreach($lotteries->get() as $lottery){

            $Ticket = Ticket::where('lottery_id', '=', $lottery->lottery_id)
                            ->where('status', '<>', 'Cancel');

            switch ($role) {
                case 'Agent':
                    $Ticket->where('ag_id', '=', $user_id);
                break;
                
                case 'Master':
                    $Ticket->where('ma_id', '=', $user_id);
                break;
                
                case 'Senior':
                    $Ticket->where('se_id', '=', $user_id);
                break;
                
                case 'Admin':
                    $Ticket->where('ad_id', '=', $user_id);
                break;
            }

            $lottery->member = [
                'betting' => $Ticket->sum('total_amount'),
                'win' => $Ticket->sum('result_amount'),
                'discount' => $Ticket->sum('total_discount')
            ];
            $lottery->admin = [
                'receive' => $Ticket->sum('ad_receive'),
                'commission' => $Ticket->sum('ad_commission'),
                'win' => -$Ticket->sum('ad_win')
            ];
            $lottery->win = -$lottery->win;
            $summaries[] = $lottery;
        }

        return $response->withJson([
            'result' => 'success',
            'summaries' => $summaries
        ]);
    }

    public function manual_update($request, $response, $args){

        $tickets = TicketNumber::select('ticket_id')
                            ->where('lottery_id', '=', 9)
                            ->where('t_status', '=', 'Win')
                            ->groupBy('ticket_id')
                            ->get();

        foreach($tickets as $ticket){
            TicketService::update_total_amount($ticket->ticket_id);
            Ticket::where('ticket_id', '=', $ticket->ticket_id)->update(['status'=>'Win']);
        }

        return $response->withJson([
            'result' => 'success',
            'tickets' => $tickets
        ]);

    }

}
?>