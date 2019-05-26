<?php  
namespace App\Configs;

class MemberConfig
{

    public static $member_type = [
        'Admin' => ['text'=>'บริษัท', 'priority'=>0, 'share'=>100],
        'Senior' => ['text'=>'ซีเนียร์', 'priority'=>1, 'share'=>90],
        'Master' => ['text'=>'มาสเตอร์', 'priority'=>2, 'share'=>80],
        'Agent' => ['text'=>'เอเย่นต์', 'priority'=>3, 'share'=>70],
        'Member' => ['text'=>'เมมเบอร์', 'priority'=>4, 'share'=>0]
    ];
	
    public static $member_status = [
        'Active' => ['text'=>'ปกติ', 'notice'=> ''],
        'Block' => ['text'=>'บล็อก', 'notice'=>'บัญชีของท่านถูกบล็อก กรุณาติดต่อเจ้าหน้าที่'],
        'Cancel' => ['text'=>'ยกเลิก', 'notice'=>'บัญชีนี้ถูกยกเลิกการใช้งานแล้ว ต้องการรายละเอียดเพิ่มเติมกรุณาติดต่อเจ้าหน้าที่'],
        'Delete' => ['text'=>'ลบ', 'notice'=>'บัญชีนี้ถูกยกเลิกการใช้งานแล้ว']
    ];

    public static function status($code){
        return self::$member_status[$code];
    }

    public static function type($type){
        return self::$member_type[$type];
    }

}
?>