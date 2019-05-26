<?php  
namespace App\Models;

use App\Models\Model;
use App\Services\AuthService;

class TicketNumber extends Model
{
	
	protected $table = 'ticket_numbers';

	protected $primaryKey = 't_number_id';

	const CREATED_AT = 'created_at';

    const UPDATED_AT = 'updated_at';

    protected $fillable = ['lottery_id', 'ticket_id', 't_type', 't_number', 't_pay', 't_amount', 't_return', 't_result'];

    public function ticket(){
        return $this->hasOne('App\Models\Ticket', 'ticket_id', 'ticket_id');
    }

    public function member(){
        return $this->hasOne('App\Models\User', 'user_id', 'user_id')->select('user_id', 'user_role', 'username', 'fullname');
    }

    public function lottery(){
        return $this->hasOne('App\Models\Lottery', 'lottery_id', 'lottery_id');
    }

}
?>