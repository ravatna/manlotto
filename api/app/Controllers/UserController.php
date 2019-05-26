<?php  
namespace App\Controllers;

use App\Controllers\Controller;

use App\Models\User;

use App\Configs\MemberConfig;

use App\Services\AuthService;
use App\Services\MemberService;
use App\Services\CreditService;
use App\Services\LotteryService;

class UserController extends Controller
{

	public function roles($request, $response, $args){
        /*$roles = [];
        foreach(MemberConfig::$member_type as $key => $role){
            $role['key'] = $key;
            $roles[] = $role;
        }*/
        return $response->withJson([
			'result' => 'success',
			'roles' => MemberService::roles()
		]);
    }

    public function user_status($request, $response, $args){
        $status = [];
        foreach(MemberConfig::$member_status as $key => $mstatus){
            $mstatus['key'] = $key;
            $status[] = $mstatus;
        }
        return $response->withJson([
			'result' => 'success',
			'status' => $status
		]);
    }

    public function get_users($request, $response, $args){
        $User = User::select("user_role", "user_id", "ref_user_id", "username", "fullname", "credit", "balance", "tel", "line", "last_login", "status", "created_at");

        //if(AuthService::is_admin()){
        //    $User->with("referer");
        //}else
        //if(AuthService::is_agent()){
            $User->where("ref_user_id", "=", AuthService::current_login('user_id'));
        //}

        $User->orderBy("created_at", "asc");

        return $response->withJson([
            'result' => 'success',
            'users' => $User->get()
		]);
    }

    public function get_user($request, $response, $args){
        $User = User::find($args['user_id']);
        
        if($User){

            $bet_opens = [];
            $user_opens = AuthService::current_login('bet_opens', true);
            
            
            $member_opens = unserialize($User->bet_opens);

            foreach($member_opens as $key => $member_open){
                if($member_open['is_open'] && !isset($member_open['option'])){
                    $bet_opens[$key] = $user_opens[$key];
                }else{
                    $bet_opens[$key] = $member_open;
                }
            }

            return $response->withJson([
                'result' => 'success',
                'user'   => [
                    'user_id'   => $User->user_id,
                    'role'      => $User->user_role,
                    'username'  => $User->username,
                    'abb'       => $User->abb,
                    'status'    => $User->status,
                    'fullname'  => $User->fullname,
                    'tel'       => $User->tel,
                    'line'      => $User->line,
                    'balance'   => $User->balance,
                    'credit'    => $User->credit,
                    'credit2'   => $User->credit,
                    'share'     => $User->share,
                    'bet_setting' => unserialize($User->bet_setting),
                    'bet_opens' => $bet_opens
                ]
            ]);
        }

        return $response->withJson([
			'result' => 'invalid'
		]);
    }

    public function save_user($request, $response, $args){
        $input = $request->getParsedBody();

        if(AuthService::is_agent()){
            if($input['credit'] > CreditService::credit_balance()){
                return $response->withJson([
                    'result' => 'error',
                    'text' => 'เครดิตไม่พอ'
                ]);
            }

            if(!LotteryService::check_setting($input['bet_setting'])){
                return $response->withJson([
                    'result' => 'error',
                    'text' => 'ข้อมูลการแทงไม่ถูกต้อง'
                ]);
            }

            if(!LotteryService::check_opens($input['bet_opens'])){
                return $response->withJson([
                    'result' => 'error',
                    'text' => 'อัตราจ่าย และคอมมิชชั่น ไม่ถูกต้อง'
                ]);
            }
        }

        $User = new User();

        if(MemberService::valid_role($input['role'])){
            $User->user_role = $input['role'];
        }else{
            $User->user_role = 'Member';
        }

        $User->fullname     = $input['fullname'];
        $User->tel          = $input['tel'];
        $User->line         = $input['line'];
        $User->status       = $input['status'];
        $User->credit       = $input['credit'];
        $User->balance      = 0;
        $User->share        = $input['share'];
        $User->bet_setting  = serialize($input['bet_setting']);
        $User->bet_opens    = serialize($input['bet_opens']);
        $User->ref_user_id  = AuthService::current_login('user_id');

        if($input['username']){
            $checkUser = User::where('username', '=', $input['username'])->first();
            if($checkUser){
                return $response->withJson([
                    'result' => 'error',
                    'text' => 'ชื่อผู้ใช้ไม่ว่าง'
                ]);
            }else{
                $User->username = $input['username'];
            }
        }

        if($User->save()){

            if(!isset($input['username']) || !$input['username']){
                $code = substr(str_shuffle('ABCDEFGHJKLMNOPQURSTUVWXYZ'), 0, 1);
                $User->username = $code.str_pad($User->user_id, 5, "0", STR_PAD_LEFT);
                $User->save();
            }

            if($input['password']){
                $password = $input['password'];
            }else{
                $password = substr(str_shuffle('123456789012345678901234567890'), 0, 6);
            }

            $User->update_password($User->user_id, $password);

            /*CreditService::update_credit([
                'user_id'       => $User->user_id, 
                'credit_type'   => 'deposit', 
                'credit_amount' => $input['credit'], 
                'credit_note'   => 'เครดิตเริ่มสมาชิก', 
                'credit_ref_id' => 0
            ]);*/

            return $response->withJson([
                'result' => 'success',
                'user_id' => $User->user_id
            ]); 
        }

        return $response->withJson([
			'result' => 'error'
		]);     
    }


    public function update_user($request, $response, $args){
        $input = $request->getParsedBody();

        if($input['user_id'] == $args['user_id']){

            $checkUser = User::where('username', '=', $input['username'])->where('user_id', '<>', $args['user_id'])->first();
            if($checkUser){
                return $response->withJson([
                    'result' => 'error',
                    'text' => 'ชื่อผู้ใช้ไม่ว่าง'
                ]);
            }
            
            if(AuthService::is_admin()){

                $User = User::find($args['user_id']);
                if($User){
                    $User->user_role    = $input['role'];
                }

            }
            else if(AuthService::is_agent())
            {
                $User = User::where('user_id', '=', $args['user_id'])->where('ref_user_id', '=', AuthService::current_login('user_id'))->first();

                if($User){
                    if($input['credit'] > CreditService::credit_balance()+$User->credit ){
                        return $response->withJson([
                            'result' => 'error',
                            'text' => 'เครดิตไม่พอ'
                        ]);
                    }

                    if(!LotteryService::check_setting($input['bet_setting'])){
                        return $response->withJson([
                            'result' => 'error',
                            'text' => 'ข้อมูลการแทงไม่ถูกต้อง'
                        ]);
                    }

                    if(!LotteryService::check_opens($input['bet_opens'])){
                        return $response->withJson([
                            'result' => 'error',
                            'text' => 'อัตราจ่าย และคอมมิชชั่น ไม่ถูกต้อง'
                        ]);
                    }
                }

            }

            if($User){

                if(MemberService::valid_role($input['role'])){
                    $User->user_role = $input['role'];
                }else{
                    $User->user_role = 'Member';
                }

                $User->username     = $input['username'];
                $User->fullname     = $input['fullname'];
                $User->abb          = $input['abb'];
                $User->tel          = $input['tel'];
                $User->line         = $input['line'];
                $User->status       = $input['status'];
                $User->credit       = $input['credit'];
                $User->share        = $input['share'];
                $User->bet_setting  = serialize($input['bet_setting']);
                $User->bet_opens    = serialize($input['bet_opens']);

                if($User->save()){

                    if(isset($input['password']) && !empty($input['password'])){
                        $User->update_password($User->user_id, $input['password']);
                    }

                    return $response->withJson([
                        'result' => 'success',
                        'user_id' => $User->user_id
                    ]); 
                }

                return $response->withJson([
                    'result' => 'error',
                    'text' => 'ผิดพลาด! กรุณาติดต่อเจ้าหน้าที่'
                ]);
            }
        }

        return $response->withJson([
			'result' => 'error',
            'text' => 'ข้อมูลไม่ถูกต้อง'
		]);
    }

}
?>