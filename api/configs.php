<?php
$config = [
    'settings' => [
        'displayErrorDetails' => true, // set to false in production
        'addContentLengthHeader' => true, // Allow the web server to send the content-length header
        "DB" => [
            'driver' => 'mysql',
            'host' => 'localhost',
            'database' => 'yasupada_mlbe',
            'username' => 'yasupada_mlbe',
            'password' => 'mlbe123456!',
            'charset'   => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix'    => '',
        ]
    ],
    'address' => [
        'version' => uniqid(),
        'api' => '//yasupada.com/mlbe/api',
        'admin' => '//yasupada.com/mlbe/admin',
        'agent' => '//yasupada.com/mlbe/agent',
        'member' => '//yasupada.com/mlbe/member'
    ]
];
?>