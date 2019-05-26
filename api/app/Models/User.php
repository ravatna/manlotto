<?php  
namespace App\Models;

use App\Models\Model;

class User extends Model
{
	
	protected $table = 'users';

	protected $primaryKey = 'user_id';

	const CREATED_AT = 'created_at';

    const UPDATED_AT = 'updated_at';

    protected $fillable = ['user_role', 'username', 'fullname','abb', 'tel', 'line', 'status'];

	public function update_password($user_id, $password){
        $update = self::find($user_id);
        $update->password = self::encode_password($password);
        $update->session_id = '';
        return $update->save();
    }

    public function encode_password($password){
        return password_hash($password, PASSWORD_DEFAULT);
    }

    public function referer(){
        return $this->hasOne('App\Models\User', 'user_id', 'ref_user_id')->select("username", "user_id", "fullname");
    }

}
?>