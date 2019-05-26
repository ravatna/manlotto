<?php 
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

set_time_limit(0);
date_default_timezone_set("Asia/Bangkok");

require_once __DIR__ . "/vendor/autoload.php";

require_once __DIR__ . '/configs.php';

$container = new \Slim\Container($config);

$settings = $container->get('settings');
$settings->replace($config);

require_once __DIR__ . "/app/dependencies.php";

$app = new \Slim\App($container);

require_once __DIR__ . "/app/app.php";

require_once __DIR__ . "/app/routes.php";

$app->run();
?>