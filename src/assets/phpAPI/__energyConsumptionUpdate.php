<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$consumptionId = $_GET['consumptionId'];
$postedData = file_get_contents("php://input");
$request = json_decode($postedData, TRUE);

$sql = "UPDATE `ils_consumption` SET
`01`='".$request['jan']."',
`02`='".$request['feb']."',
`03`='".$request['mar']."',
`04`='".$request['apr']."',
`05`='".$request['may']."',
`06`='".$request['jun']."',
`07`='".$request['jul']."',
`08`='".$request['aug']."',
`09`='".$request['sep']."',
`10`='".$request['oct']."',
`11`='".$request['nov']."',
`12`='".$request['dec']."'
WHERE consumptionId = " .$consumptionId;

$result = mysqli_query($conn, $sql);
mysqli_close($conn);

if ($result) {
  header('Content-Type: application/json');
  echo  http_response_code(200);
} else  {
  echo http_response_code(401);
}
?>
