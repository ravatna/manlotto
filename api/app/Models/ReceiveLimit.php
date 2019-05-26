<?php  
namespace App\Models;

use App\Models\Model;

class ReceiveLimit extends Model
{
	
	protected $table = 'receive_limit';

	protected $primaryKey = 'limit_id';

	const CREATED_AT = 'created_at';

    const UPDATED_AT = 'updated_at';

    protected $fillable = ['user_id', 'lottery_type', 'lottery_id', 'limit_option'];

}
?>