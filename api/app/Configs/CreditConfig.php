<?php  
namespace App\Configs;

class CreditConfig
{

    public static $credit_type = [
        'deposit' => ['text'=>'เติมเครดิต', 'css_class'=>'label label-primary'],
        'withdraw' => ['text'=>'ถอนเครดิต', 'css_class'=>'label label-success'],
        'betting' => ['text'=>'แทงหวย', 'css_class'=>'label label-info'],
        'cancel-ticket' => ['text'=>'คืนโพย', 'css_class'=>'label label-info'],
        'cancel-number' => ['text'=>'ยกเลิกหมายเลข', 'css_class'=>'label label-info'],
        'win' => ['text'=>'ถูกรางวัล', 'css_class'=>'label label-primary'],
    ];

}
?>