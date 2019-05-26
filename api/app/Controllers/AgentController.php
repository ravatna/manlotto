<?php  
namespace App\Controllers;

use App\Controllers\Controller;

use App\Models\User;
use App\Models\Summary;

use App\Configs\MemberConfig;

use App\Services\AuthService;
use App\Services\CreditService;

class AgentController extends Controller
{

	public function agent_info($request, $response, $args){

        return $response->withJson([
			'result' => 'success',
            'agent' => [
                'credit' => AuthService::current_login('credit'),
                'credit_balance' => CreditService::credit_balance(),
                'share' => AuthService::current_login('share'),
            ]
		]);
    }

    public function default_user($request, $response, $args){

        $group_opens = [];
        foreach(AuthService::current_login('bet_opens', true) as $key => $group){
            if($group['is_open']){
                $group_opens[$key] = $group;
            }
        }

        return $response->withJson([
            'user_id'   => 0,
            'role'      => 'Member',
            'status'    => 'Active',
            'fullname'  => '',
            'tel'       => '',
            'line'      => '',
            'credit'    => 1000,
            'username'  => '',
            'password'  => '',
            'share'     => '0',
            'bet_setting' => AuthService::current_login('bet_setting', true),
            'bet_opens' => $group_opens
        ]);
    }

    public function financial_summary($request, $response, $args){

        return $response->withJson([
            'result' => 'success',
            'summary' => [
                'credit' => AuthService::current_login('credit'),
                'credit_balance' => CreditService::credit_balance(),
                'netamount' => AuthService::current_login('balance'),
                'members' => User::select('user_id', 'username', 'user_role', 'credit')->where('ref_user_id', '=', AuthService::current_login('user_id'))->get()
            ],
            'roles' => MemberConfig::$member_type
        ]);

    }

    public function win_lose($request, $response, $args){

        $summaries = Summary::select(
                            'lottery.lottery_id', 
                            'lottery.lottery_type', 
                            'lottery.lottery_date', 
                            'lottery_summary.receive', 
                            'lottery_summary.commission', 
                            'lottery_summary.win', 
                            'lottery_summary.diff_win'
                        )
                        ->join('lottery', 'lottery.lottery_id', '=', 'lottery_summary.lottery_id')
                        ->where('lottery_summary.user_id', '=', AuthService::current_login('user_id'))
                        ->whereDate("lottery_summary.created_at", ">=", "{$_GET['from']}")
                        ->whereDate("lottery_summary.created_at", "<=", "{$_GET['to']}")
                        ->orderBy('lottery_summary.created_at', 'desc')
                        ->get();

        return $response->withJson([
            'result' => 'success',
            'summaries' => $summaries
        ]);

    }

}
?>