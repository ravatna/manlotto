<?php
namespace App\Middleware;

class Middleware
{
    protected $container;
    protected $role;
    public function __construct($container, $role='login')
    {
        $this->container = $container;
        $this->container->get('DB');
        $this->role = $role;
    }
}
?>