<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="">
    <meta name="author" content="">

    <link rel="icon" href="../../favicon.ico">

    <title>ผลออกรางวัลสลากกินแบ่งรัฐบาล <?=$version;?></title>

    <!-- Bootstrap core CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

	<link href="https://cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />
 
	<style>
	 caption{
		 caption-side:top !important;
		 text-align:center;
	 }
	 
	 div > table {
		 margin:auto ;
		 display:inline-table !important;
	 }
	 
	 h3  {
		 text-align:center;
	 }
	 
	
	 
	  tr > td {
		font-size: 20px;
		padding-left:5px;
		
	 }

	</style>
  </head>
  <body>
<?php
error_reporting(E_ALL);
 $i = 0;
 
 $samnuk[0]['name'] = "สำนัก ที่ 1";
 $samnuk[0]['two'] = "23 15";
 $samnuk[0]['three'] = "125 852";
 $samnuk[0]['mongkol'] = "9 5 3";
 
 $samnuk[1]['name'] = "สำนัก ที่ 2";
 $samnuk[1]['two'] = "32 55";
 $samnuk[1]['three'] = "863 459";
 $samnuk[1]['mongkol'] = "2 8 3";
 
 $samnuk[2]['name'] = "สำนัก ที่ 3";
 $samnuk[2]['two'] = "23 18";
 $samnuk[2]['three'] = "125 254";
 $samnuk[2]['mongkol'] = "2 5 3";
 
 $samnuk[3]['name'] = "สำนัก ที่ 4";
 $samnuk[3]['two'] = "75 35";
 $samnuk[3]['three'] = "156 452";
 $samnuk[3]['mongkol'] = "5 2 3";
 
 ?>
 <div>
 <table class="table-responsive">
 <?php
for($i=0; count($samnuk) > $i ; $i++){
	?>
	<tr><td style="background:gold;color:white;"><?=$samnuk[$i]['name']?></td></tr>
	<tr><td>เลข 2 ตัว<br/><u><?=$samnuk[$i]['two']?></u></td></tr>
	<tr><td>เลข 3 ตัว<br/><u><?=$samnuk[$i]['three']?></u></td></tr>
	<tr><td>เลข มงคล ตัว<br/><u><?=$samnuk[$i]['mongkol']?></u></td></tr>
	<tr><td>&nbsp;</td></tr>
	<?php
	
 } // .End for
 
 ?>
 </table>
 </div>
 </body>
 </html>