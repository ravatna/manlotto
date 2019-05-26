<?php  
namespace App\Services;

class HttpService
{

	protected $address;

    public function __construct()
    {
        global $container;
        $this->address = $container->get('address');
    }

    public function api($path=''){
        return $this->address['api'].$path;
    }

    public function admin($path=''){
    	return $this->address['admin'].$path;
    }

    public function agent($path=''){
    	return $this->address['agent'].$path;
    }

    public function member($path=''){
    	return $this->address['member'].$path;
    }

    public function version(){
    	return $this->address['version'];
    }

}
?>