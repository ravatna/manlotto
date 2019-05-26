<?php  
namespace App\Configs;

class LotteryConfig
{

    public static $type_name = [
        'lao-lottery'   => ['name' => 'หวยลาว'],
        'hanoi-lottery' => ['name' => 'หวยเวียดนาม ฮานอย'],
        'government' => ['name' => 'หวยรัฐบาล'],
        'pong-lottory' => ['name' => 'หวยปิงปอง'],
        'yiki-lottory' => ['name' => 'หวยยี่กี'],
        'government' => ['name' => 'หวยรัฐบาล'],
        '1set-lottery' => ['name' => 'หุ้นนิเคอิ เช้า'],
        '2set-lottery' => ['name' => 'หุ้นจีน เช้า'],
        '3set-lottery' => ['name' => 'หุ้นฮั่ง เช้า'],
        '4set-lottery' => ['name' => 'หุ้นไต้หวัน'],
        '5set-lottery' => ['name' => 'หุ้นเกาหลี'],
		'6set-lottery' => ['name' => 'หุ้นนิเคอิ บ่าย'],
        '7set-lottery' => ['name' => 'หุ้นจีนบ ่าย'],
        '8set-lottery' => ['name' => 'หุ้นฮั่ง บ่าย'],
        '9set-lottery' => ['name' => 'หุ้นสิงคโป'],
        '0set-lottery' => ['name' => 'หุ้นไทย เย็น'],
        '11set-lottery' => ['name' => 'หุ้นอินเดีย'],
        '12set-lottery' => ['name' => 'หุ้นมาเลย์'],
        '13set-lottery' => ['name' => 'หุ้นอียิป'],
        '14set-lottery' => ['name' => 'หุ้นรัสเซีย'],
        '15set-lottery' => ['name' => 'หุ้นอังกฤษ'],
        '16set-lottery' => ['name' => 'หุ้นเยอรมัน'],
        '17set-lottery' => ['name' => 'หุ้นดาวโจนส์']
    ];

    public static $options = [
        'three_number_top'      => ['min'=>5, 'max'=>1000],
        'three_number_front'    => ['min'=>5, 'max'=>1000],
        'three_number_bottom'   => ['min'=>5, 'max'=>1000],
        'three_number_tode'     => ['min'=>5, 'max'=>1000],
        'two_number_top'        => ['min'=>5, 'max'=>1000],
        'two_number_bottom'     => ['min'=>5, 'max'=>1000],
        //'two_number_tode'     => ['min'=>5, 'max'=>1000],
        'run_top'               => ['min'=>5, 'max'=>1000],
        'run_bottom'            => ['min'=>5, 'max'=>1000]
    ];

    public static $groups = [
        'government' => [
            'three_number_top'      => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_front'    => ['pay' => 325, 'discount' => 15, 'award' => 2],
            'three_number_bottom'   => ['pay' => 325, 'discount' => 15, 'award' => 2],
            'three_number_tode'     => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'        => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom'     => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'               => ['pay' => 3, 'discount' => 15, 'award' => 3],
            'run_bottom'            => ['pay' => 4, 'discount' => 15, 'award' => 2]
        ],

        'lao-lottery' => [
            'three_number_top'  => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_tode' => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'    => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom' => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'           => ['pay' => 3, 'discount' => 12, 'award' => 3],
            'run_bottom'        => ['pay' => 4, 'discount' => 12, 'award' => 2]
        ],
        
        'hanoi-lottery' => [
            'three_number_top'  => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_tode' => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'    => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom' => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'           => ['pay' => 3, 'discount' => 12, 'award' => 3],
            'run_bottom'        => ['pay' => 4, 'discount' => 12, 'award' => 2]
        ],

        '1set-lottery' => [
            'three_number_top'  => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_tode' => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'    => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom' => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'           => ['pay' => 3, 'discount' => 12, 'award' => 3],
            'run_bottom'        => ['pay' => 4, 'discount' => 12, 'award' => 2]
        ],
        
        '2set-lottery' => [
            'three_number_top'  => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_tode' => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'    => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom' => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'           => ['pay' => 3, 'discount' => 12, 'award' => 3],
            'run_bottom'        => ['pay' => 4, 'discount' => 12, 'award' => 2]
        ],

        '3set-lottery' => [
            'three_number_top'  => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_tode' => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'    => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom' => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'           => ['pay' => 3, 'discount' => 12, 'award' => 3],
            'run_bottom'        => ['pay' => 4, 'discount' => 12, 'award' => 2]
        ],

        '4set-lottery' => [
            'three_number_top'  => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_tode' => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'    => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom' => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'           => ['pay' => 3, 'discount' => 12, 'award' => 3],
            'run_bottom'        => ['pay' => 4, 'discount' => 12, 'award' => 2]
        ],

        '5set-lottery' => [
            'three_number_top'  => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_tode' => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'    => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom' => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'           => ['pay' => 3, 'discount' => 12, 'award' => 3],
            'run_bottom'        => ['pay' => 4, 'discount' => 12, 'award' => 2]
        ],

        '6set-lottery' => [
            'three_number_top'  => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_tode' => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'    => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom' => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'           => ['pay' => 3, 'discount' => 12, 'award' => 3],
            'run_bottom'        => ['pay' => 4, 'discount' => 12, 'award' => 2]
        ],

        '7set-lottery' => [
            'three_number_top'  => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_tode' => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'    => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom' => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'           => ['pay' => 3, 'discount' => 12, 'award' => 3],
            'run_bottom'        => ['pay' => 4, 'discount' => 12, 'award' => 2]
        ],

        '8set-lottery' => [
            'three_number_top'  => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_tode' => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'    => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom' => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'           => ['pay' => 3, 'discount' => 12, 'award' => 3],
            'run_bottom'        => ['pay' => 4, 'discount' => 12, 'award' => 2]
        ],

        '9set-lottery' => [
            'three_number_top'  => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_tode' => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'    => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom' => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'           => ['pay' => 3, 'discount' => 12, 'award' => 3],
            'run_bottom'        => ['pay' => 4, 'discount' => 12, 'award' => 2]
        ],

        '10set-lottery' => [
            'three_number_top'  => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_tode' => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'    => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom' => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'           => ['pay' => 3, 'discount' => 12, 'award' => 3],
            'run_bottom'        => ['pay' => 4, 'discount' => 12, 'award' => 2]
        ],

        '11set-lottery' => [
            'three_number_top'  => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_tode' => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'    => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom' => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'           => ['pay' => 3, 'discount' => 12, 'award' => 3],
            'run_bottom'        => ['pay' => 4, 'discount' => 12, 'award' => 2]
        ],
        '12set-lottery' => [
            'three_number_top'  => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_tode' => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'    => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom' => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'           => ['pay' => 3, 'discount' => 12, 'award' => 3],
            'run_bottom'        => ['pay' => 4, 'discount' => 12, 'award' => 2]
        ],
        '13set-lottery' => [
            'three_number_top'  => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_tode' => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'    => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom' => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'           => ['pay' => 3, 'discount' => 12, 'award' => 3],
            'run_bottom'        => ['pay' => 4, 'discount' => 12, 'award' => 2]
        ],
        '14set-lottery' => [
            'three_number_top'  => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_tode' => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'    => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom' => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'           => ['pay' => 3, 'discount' => 12, 'award' => 3],
            'run_bottom'        => ['pay' => 4, 'discount' => 12, 'award' => 2]
        ],
        '15set-lottery' => [
            'three_number_top'  => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_tode' => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'    => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom' => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'           => ['pay' => 3, 'discount' => 12, 'award' => 3],
            'run_bottom'        => ['pay' => 4, 'discount' => 12, 'award' => 2]
        ],
        '16set-lottery' => [
            'three_number_top'  => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_tode' => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'    => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom' => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'           => ['pay' => 3, 'discount' => 12, 'award' => 3],
            'run_bottom'        => ['pay' => 4, 'discount' => 12, 'award' => 2]
        ],
        '17set-lottery' => [
            'three_number_top'  => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_tode' => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'    => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom' => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'           => ['pay' => 3, 'discount' => 12, 'award' => 3],
            'run_bottom'        => ['pay' => 4, 'discount' => 12, 'award' => 2]
        ],
        'pong-lottery' => [
            'three_number_top'  => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_tode' => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'    => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom' => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'           => ['pay' => 3, 'discount' => 12, 'award' => 3],
            'run_bottom'        => ['pay' => 4, 'discount' => 12, 'award' => 2]
        ],
        'yiki-lottery' => [
            'three_number_top'  => ['pay' => 650, 'discount' => 15, 'award' => 1],
            'three_number_tode' => ['pay' => 130, 'discount' => 15, 'award' => 6],
            'two_number_top'    => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'two_number_bottom' => ['pay' => 65, 'discount' => 15, 'award' => 1],
            'run_top'           => ['pay' => 3, 'discount' => 12, 'award' => 3],
            'run_bottom'        => ['pay' => 4, 'discount' => 12, 'award' => 2]
        ]
		
    ];

    public static function get_groups(){
        $groups = [];
        foreach(self::$groups as $key => $val){
            $groups[] = $key;
        }
        return $groups;
    }

    public static function get_options(){
        $options = [];
        foreach(self::$options as $key => $val){
            $options[] = $key;
        }
        return $options;
    }

}
?>