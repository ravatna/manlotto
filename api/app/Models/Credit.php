<?php  
namespace App\Models;

use App\Models\Model;

class Credit extends Model
{
	
	protected $table = 'credits';

	protected $primaryKey = 'credit_id';

	const CREATED_AT = 'created_at';

    const UPDATED_AT = 'updated_at';

    protected $fillable = ['user_id', 'credit_type', 'credit_amount', 'credit_note', 'credit_ref_id'];

}
?>