<?php  
namespace App\Models;

use App\Models\Model;

class Ticket extends Model
{
	
	protected $table = 'tickets';

	protected $primaryKey = 'ticket_id';

	const CREATED_AT = 'created_at';

    const UPDATED_AT = 'updated_at';

    protected $fillable = ['user_id', 'lottery_id', 'total_amount', 'result_amount', 'status'];

    public function lottery(){
        return $this->hasOne('App\Models\Lottery', 'lottery_id', 'lottery_id');
    }
    
    public function numbers(){
        return $this->hasMany('App\Models\TicketNumber', 'ticket_id', 'ticket_id')->select('t_number_id', 'ticket_id', 'created_at', 't_type', 't_number', 't_pay', 't_amount', 't_discount', 't_credit', 't_result', 't_status');
    }

}
?>