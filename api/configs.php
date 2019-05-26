<?php
$config = [
    'settings' => [
        'displayErrorDetails' => true, // set to false in production
        'addContentLengthHeader' => true, // Allow the web server to send the content-length header
        "DB" => [
            'driver' => 'mysql',
            'host' => 'localhost',
            'database' => 'lotto24h_lotto',
            'username' => 'root',
            'password' => '!@#$%^123456',
            'charset'   => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix'    => '',
        ]
    ],
    'address' => [
        'version' => uniqid(),
        'api' => '//localhost/lot24/api',
        'admin' => '//localhost/lot24/admin',
        'agent' => '//localhost/lot24/agent',
        'member' => '//localhost/lot24/member'
    ]
];
?>