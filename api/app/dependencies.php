<?php
$container['DB'] = function ($container) {
    $capsule = new \Illuminate\Database\Capsule\Manager;
    $capsule->addConnection($container['settings']['DB']);

    $capsule->setAsGlobal();
    $capsule->bootEloquent();

    return $capsule;
};
?>