<?php  
namespace App\Models;

use App\Models\Model;

class Promotion extends Model
{
	
	protected $table = 'promotions';

	protected $primaryKey = 'promotion_id';

	const CREATED_AT = 'created_at';

    const UPDATED_AT = 'updated_at';

    protected $fillable = ['lottery_type', 'promotion_name', 'promotion_status', 'promotion_info', 'promotion_note'];

}
?>