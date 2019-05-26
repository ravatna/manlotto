<?php  
namespace App\Services;

use App\Configs\MemberConfig;

use App\Services\AuthService;

use App\Models\User;

class MemberService
{

	public static function roles(){

        $login_role = AuthService::current_login('user_role');
        $login_priority = MemberConfig::$member_type[$login_role]['priority'];

        $roles = [];
        if($login_priority == 0){
            foreach(MemberConfig::$member_type as $key => $role){
                $role['key'] = $key;
                $roles[] = $role;
            }
        }else
        if($login_priority > 0){
            foreach(MemberConfig::$member_type as $key => $role){
                if($role['priority'] > $login_priority){
                    $role['key'] = $key;
                    $roles[] = $role;
                }
            }
        }

        return $roles;
    }

    public static function valid_role($role){
        $login_role = AuthService::current_login('user_role');
        $login_priority = MemberConfig::$member_type[$login_role]['priority'];

        if($login_priority == 0){
            return true;
        }

        $check_priority = MemberConfig::$member_type[$role]['priority'];
        return $login_priority < $check_priority;
    }

    public static function get_referer($user_id){
        $member = User::select("share", "ref_user_id", "bet_opens")->find($user_id);
        if($member->ref_user_id > 0){
            $referer = User::select("user_id", "username", "user_role", "ref_user_id", "share", "bet_opens")->find($member->ref_user_id);
            if($referer){
                return [
                    "user_id" => $referer->user_id,
                    "username" => $referer->username,
                    "user_role" => $referer->user_role,
                    "ref_user_id" => $referer->ref_user_id,
                    "share" => $referer->share - $member->share,
                    "bet_opens" => unserialize($member->bet_opens)
                ];
            }
        }
        return false;
    }

}
?>