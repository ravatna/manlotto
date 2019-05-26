<?php
namespace App\Middleware;

use App\Middleware\Middleware;
use App\Services\AuthService;

class AuthMiddleware extends Middleware
{
    public function __invoke($request, $response, $next)
    {	

        if(!is_array($this->role)){
            $this->role = [$this->role];
        }

        if(in_array('admin', $this->role) && AuthService::is_admin()){
            return $next($request, $response);
        }else
        if(in_array('agent', $this->role) && AuthService::is_agent()){
            return $next($request, $response);
        }else
        if(in_array('member', $this->role) && AuthService::is_member()){
            return $next($request, $response);
        }else
    	if(in_array('login', $this->role) && AuthService::is_login()){
    		return $next($request, $response);
        }

        return $response->withJson([
            'Access Denied'
        ]);
    }
}
?>