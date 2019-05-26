<?php  
namespace App\Controllers;

use App\Controllers\Controller;

use App\Models\User;
use App\Models\Credit;

use App\Services\AuthService;
use App\Services\CreditService;

class CreditController extends Controller
{

	public function user_credits($request, $response, $args){
        
        if(AuthService::is_admin()){
            if(isset($args['user_id'])){
                $User = User::find($args['user_id']);
            }else{
                $User = User::where('user_id', '=', AuthService::current_login('user_id'))->first();
            }
        }else
        if(AuthService::is_agent()){
            if(isset($args['user_id'])){
                $User = User::where('user_id', '=', $args['user_id'])->where("ref_user_id", "=", AuthService::current_login('user_id'))->first();
            }else{
                $User = User::where('user_id', '=', AuthService::current_login('user_id'))->first();
            }
        }else
        if(AuthService::is_member()){
            $User = User::where('user_id', '=', AuthService::current_login('user_id'))->first();
        }

        if($User){
            $Credit = Credit::where('user_id', '=', $User->user_id)
                            ->orderBy('created_at', 'desc');
                            
            if(isset($_GET['from']) && isset($_GET['to'])){
                $Credit->whereDate("created_at", ">=", $_GET['from']);
                $Credit->whereDate("created_at", "<=", $_GET['to']);
            }

            return $response->withJson([
                'result' => 'success',
                'credits' => $Credit->get()
            ]);
        }

        return $response->withJson([
			'result' => 'invalid'
		]);
    }

    public function update_user_credit($request, $response, $args){
        $input = $request->getParsedBody();
        
        if(AuthService::is_admin()){
            $User = User::find($args['user_id']);
        }else
        if(AuthService::is_agent()){
            $User = User::where('user_id', '=', $args['user_id'])->where("ref_user_id", "=", AuthService::current_login('user_id'))->first();
        }

        if($User){
            
            if($input['type']=='deposit'){
                CreditService::update_credit([
                    'user_id'       => $User->user_id, 
                    'credit_type'   => 'deposit', 
                    'credit_amount' => $input['amount'], 
                    'credit_note'   => $input['note'], 
                    'credit_ref_id' => 0
                ]);

                CreditService::update_credit([
                    'user_id'       => AuthService::current_login('user_id'), 
                    'credit_type'   => 'member-deposit', 
                    'credit_amount' => -$input['amount'], 
                    'credit_note'   => 'เติมเงินสมาชิก '.$User->username, 
                    'credit_ref_id' => 0
                ]);
            }else
            if($input['type']=='withdraw'){
                CreditService::update_credit([
                    'user_id'       => $User->user_id, 
                    'credit_type'   => 'withdraw', 
                    'credit_amount' => -$input['amount'], 
                    'credit_note'   => $input['note'], 
                    'credit_ref_id' => 0
                ]);

                CreditService::update_credit([
                    'user_id'       => AuthService::current_login('user_id'), 
                    'credit_type'   => 'member-withdraw', 
                    'credit_amount' => $input['amount'], 
                    'credit_note'   => 'ถอนเงินจากสมาชิก '.$User->username, 
                    'credit_ref_id' => 0
                ]);
            }

            return $response->withJson([
                'result' => 'success'
            ]);
        }

        return $response->withJson([
			'result' => 'invalid'
		]);
    }

}
?>