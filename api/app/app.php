<?php  
$container['Captcha'] = function ($container) {
    return new App\Controllers\CaptchaController($container);
};

$container['Auth'] = function ($container) {
    return new App\Controllers\AuthController($container);
};

$container['User'] = function ($container) {
    return new App\Controllers\UserController($container);
};

$container['Credit'] = function ($container) {
    return new App\Controllers\CreditController($container);
};

$container['Lottery'] = function ($container) {
    return new App\Controllers\LotteryController($container);
};

$container['Promotion'] = function ($container) {
    return new App\Controllers\PromotionController($container);
};

$container['Ticket'] = function ($container) {
    return new App\Controllers\TicketController($container);
};

$container['Agent'] = function ($container) {
    return new App\Controllers\AgentController($container);
};

$container['Report'] = function ($container) {
    return new App\Controllers\ReportController($container);
};

$container['Setting'] = function ($container) {
    return new App\Controllers\SettingController($container);
};
?>