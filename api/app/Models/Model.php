<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Model extends Eloquent
{

    public function get_fillable(){
        return $this->fillable;
    }

    public function get_table_name(){
    	return $this->table;
    }

}
?>