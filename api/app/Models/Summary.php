<?php  
namespace App\Models;

use App\Models\Model;

class Summary extends Model
{
	
	protected $table = 'lottery_summary';

	protected $primaryKey = 'summary_id';

	const CREATED_AT = 'created_at';

    const UPDATED_AT = 'updated_at';

    protected $fillable = ['user_id', 'lottery_id', 'receive', 'commission', 'win', 'diff_win'];

}
?>