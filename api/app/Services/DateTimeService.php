<?php  
namespace App\Services;

class DateTimeService
{
	
	public static function general_format($datetime){
		$timestamp = strtotime($datetime);
		return date("d/m/", $timestamp).(date("Y", $timestamp)+543).date(" H:i:s", $timestamp);
	}

	public static function thai_date($datetime){
		$timestamp = strtotime($datetime);
        $thaidate = [];
        $thaidate[] = date('j', $timestamp);
        $thai_month_arr = array(      
            "1" => "มกราคม",   
            "2" => "กุมภาพันธ์",   
            "3" => "มีนาคม",   
            "4" => "เมษายน",   
            "5" => "พฤษภาคม",   
            "6" => "มิถุนายน",    
            "7" => "กรกฎาคม",   
            "8" => "สิงหาคม",   
            "9" => "กันยายน",   
            "10" => "ตุลาคม",   
            "11" => "พฤศจิกายน",   
            "12" => "ธันวาคม"                    
        );
        $thaidate[] = $thai_month_arr[date('n', $timestamp)];
        $thaidate[] = date("Y")+543;
        return implode(' ', $thaidate);
	}

}
?>