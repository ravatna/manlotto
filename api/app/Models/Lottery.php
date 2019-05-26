<?php  
namespace App\Models;

use App\Models\Model;

class Lottery extends Model
{
	
	protected $table = 'lottery';

	protected $primaryKey = 'lottery_id';

	const CREATED_AT = 'created_at';

    const UPDATED_AT = 'updated_at';

    protected $fillable = ['lottery_type', 'lottery_date', 'lottery_status', 'lottery_options', 'open_date', 'close_date'];

}
?>