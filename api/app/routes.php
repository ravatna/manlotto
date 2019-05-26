<?php  
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

use App\Middleware\AuthMiddleware;

/** Get Captcha */
$app->post('/captcha', 'Captcha:get');

/** Login */
$app->post('/login', 'Auth:login');

/** Get current login */
$app->get('/login', 'Auth:current_login')->add(new AuthMiddleware($container, 'login'));
$app->get('/profile', 'Auth:profile')->add(new AuthMiddleware($container, 'login'));

/** Logout */
$app->get('/logout', 'Auth:logout');
$app->post('/logout', 'Auth:logout');

/** Update Profile */
$app->post('/profile', 'Auth:save_profile');
$app->post('/password', 'Auth:save_password');

/** Get All Role */
$app->get('/roles', 'User:roles')->add(new AuthMiddleware($container, ['admin', 'agent']));

/** Get all user status */
$app->get('/user-status', 'User:user_status')->add(new AuthMiddleware($container, ['admin', 'agent']));

/** Add or Update User */
$app->post('/user', 'User:save_user')->add(new AuthMiddleware($container, ['admin', 'agent']));
$app->post('/user/{user_id:[0-9]+}', 'User:update_user')->add(new AuthMiddleware($container, ['admin', 'agent']));

/** Get User */
$app->get('/user', 'User:get_users')->add(new AuthMiddleware($container, ['admin', 'agent']));
$app->get('/user/{user_id:[0-9]+}', 'User:get_user')->add(new AuthMiddleware($container, ['admin', 'agent']));

/** Credit */
$app->get('/user/{user_id:[0-9]+}/credit', 'Credit:user_credits')->add(new AuthMiddleware($container, ['admin', 'agent']));
$app->post('/user/{user_id:[0-9]+}/credit', 'Credit:update_user_credit')->add(new AuthMiddleware($container, ['admin', 'agent']));
$app->get('/credits', 'Credit:user_credits')->add(new AuthMiddleware($container, ['member']));

/** Lottery */
$app->get('/lottery/info/options', 'Lottery:lottery_options')->add(new AuthMiddleware($container, ['login']));
$app->get('/lottery/info/settings', 'Lottery:lottery_settings')->add(new AuthMiddleware($container, ['login']));
$app->get('/lottery/results', 'Lottery:results')->add(new AuthMiddleware($container, ['login']));
$app->get('/lottery/resultslast', 'Lottery:resultslast')->add(new AuthMiddleware($container, ['login']));
$app->get('/lottery/last', 'Lottery:last_lottery')->add(new AuthMiddleware($container, ['login']));
//$app->get('/lottery/lao', 'Lottery:lao_lotteries')->add(new AuthMiddleware($container, ['admin']));
//$app->get('/lottery/hanoi', 'Lottery:hanoi_lotteries')->add(new AuthMiddleware($container, ['admin']));
//$app->get('/lottery/lao/last', 'Lottery:last_lao_lottery')->add(new AuthMiddleware($container, ['login']));
$app->get('/lottery/list/{lottery_group:[0-9]*[a-z\-]+}', 'Lottery:lotteries')->add(new AuthMiddleware($container, ['admin']));
$app->get('/lottery/{lottery_id:[0-9]+}', 'Lottery:get_lottery')->add(new AuthMiddleware($container, ['login']));
$app->get('/lottery/{lottery_id:[0-9]+}/wins', 'Lottery:get_wins')->add(new AuthMiddleware($container, ['admin']));
$app->get('/lottery/{lottery_id:[0-9]+}/tickets', 'Lottery:get_tickets')->add(new AuthMiddleware($container, ['admin', 'agent']));
$app->get('/lottery/{lottery_id:[0-9]+}/summary', 'Lottery:summary')->add(new AuthMiddleware($container, ['admin', 'agent']));
$app->post('/lottery', 'Lottery:save_lottery')->add(new AuthMiddleware($container, ['admin']));
$app->post('/lottery/{lottery_id:[0-9]+}', 'Lottery:update_lottery')->add(new AuthMiddleware($container, ['admin']));
$app->post('/lottery/{lottery_id:[0-9]+}/result', 'Lottery:save_result')->add(new AuthMiddleware($container, ['admin']));
$app->post('/lottery/{lottery_id:[0-9]+}/confirm-result', 'Lottery:confirm_result')->add(new AuthMiddleware($container, ['admin']));

/** Promotion */
//$app->get('/promotion', 'Promotion:promotions')->add(new AuthMiddleware($container, ['login']));
//$app->get('/promotion/{promotion_id:[0-9]+}', 'Promotion:promotion')->add(new AuthMiddleware($container, ['login']));
//$app->post('/promotion', 'Promotion:save_promotion')->add(new AuthMiddleware($container, ['admin']));
//$app->post('/promotion/{promotion_id:[0-9]+}', 'Promotion:update_promotion')->add(new AuthMiddleware($container, ['admin']));

/** Ticket module */
$app->post('/ticket', 'Ticket:save_ticket')->add(new AuthMiddleware($container, ['member']));
$app->get('/ticket', 'Ticket:save_ticket')->add(new AuthMiddleware($container, ['member']));
$app->post('/ticket/number/{number_id:[0-9]+}/cancel', 'Ticket:cancel_number')->add(new AuthMiddleware($container, ['member']));
$app->post('/lottery/{lottery_id:[0-9]+}/numbers/cancel', 'Ticket:cancel_numbers')->add(new AuthMiddleware($container, ['member']));

$app->get('/lottery/{lottery_id:[0-9]+}/numbers', 'Ticket:get_numbers')->add(new AuthMiddleware($container, ['login']));
$app->get('/lottery/{lottery_id:[0-9]+}/numbers/{ticket_id:[0-9]+}', 'Ticket:get_numbers')->add(new AuthMiddleware($container, ['login']));
$app->get('/ticket/{ticket_id:[0-9]+}', 'Ticket:get_ticket')->add(new AuthMiddleware($container, ['login']));
$app->post('/ticket/{ticket_id:[0-9]+}/cancel', 'Ticket:cancel_ticket')->add(new AuthMiddleware($container, ['login']));
$app->get('/ticket/recent', 'Ticket:recent_tickets')->add(new AuthMiddleware($container, ['member']));
$app->get('/ticket/recentfilter', 'Ticket:recent_tickets_filter')->add(new AuthMiddleware($container, ['member']));
$app->get('/ticket/history', 'Ticket:history_tickets')->add(new AuthMiddleware($container, ['member']));

/** Agent */
$app->get('/agent/info', 'Agent:agent_info')->add(new AuthMiddleware($container, ['admin', 'agent']));
$app->get('/agent/default-user', 'Agent:default_user')->add(new AuthMiddleware($container, ['admin', 'agent']));
$app->get('/agent/financial-summary', 'Agent:financial_summary')->add(new AuthMiddleware($container, ['admin', 'agent']));
$app->get('/agent/transaction', 'Credit:user_credits')->add(new AuthMiddleware($container, ['admin', 'agent']));
$app->get('/agent/win-lose', 'Agent:win_lose')->add(new AuthMiddleware($container, ['admin', 'agent']));

/** Report */
$app->get('/report/onprocess', 'Report:onprocess')->add(new AuthMiddleware($container, ['admin', 'agent','member']));
$app->get('/report/win-lose', 'Report:win_lose')->add(new AuthMiddleware($container, ['admin', 'agent','member']));
$app->get('/report/{lottery_id:[0-9]+}/by-member', 'Report:report_by_member')->add(new AuthMiddleware($container, ['admin', 'agent']));
$app->get('/report/{lottery_id:[0-9]+}/by-member/ticket', 'Report:report_by_member_ticket')->add(new AuthMiddleware($container, ['admin', 'agent']));
$app->get('/report/{lottery_id:[0-9]+}/by-type', 'Report:report_by_type')->add(new AuthMiddleware($container, ['admin', 'agent']));
$app->get('/report/{lottery_id:[0-9]+}/by-type/numbers', 'Report:report_by_type_numbers')->add(new AuthMiddleware($container, ['admin', 'agent']));
$app->get('/report/{lottery_id:[0-9]+}/by-ticket', 'Report:report_by_tickets')->add(new AuthMiddleware($container, ['admin', 'agent']));
$app->get('/report/{lottery_id:[0-9]+}/by-ticket/numbers', 'Report:report_by_ticket_numbers')->add(new AuthMiddleware($container, ['admin', 'agent']));

/** Setting */
$app->get('/setting/limit', 'Setting:get_limits')->add(new AuthMiddleware($container, ['admin', 'agent']));
$app->get('/setting/limit/{lottery_id:[0-9]+}', 'Setting:get_limit')->add(new AuthMiddleware($container, ['admin', 'agent']));
$app->post('/setting/limits', 'Setting:save_limits')->add(new AuthMiddleware($container, ['admin', 'agent']));
$app->post('/setting/limit', 'Setting:save_limit')->add(new AuthMiddleware($container, ['admin', 'agent']));

$app->get('/manual-update', 'Report:manual_update')->add(new AuthMiddleware($container, ['admin', 'agent']));
?>