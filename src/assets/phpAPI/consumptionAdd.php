<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

/* require_once 'conectar_a_bbdd.php'; */
require_once 'conectar_a_bbdd_ils.php';
require_once 'encrDecr.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$postedData = file_get_contents("php://input");
$request = json_decode($postedData, TRUE);

$sql = "INSERT INTO consumption ('companyId', 'quantity', 'fuelId', 'fromDate', 'toDate', `createAt`, `updatedAt`) VALUES ( '281', '1000', '5', '2023-06-26', '2023-06-30', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);";
$result = mysqli_query($conn, $sql);
$rowcount=mysqli_num_rows($result);
$field = mysqli_fetch_row($result);

mysqli_close($conn);
$arr = array('user_id'=>$field[0], 'access_token' => $field[2], 'email'=>$field[4], 'password' => $field[2]); //etc

if ($rowcount==1) {
  //echo http_response_code(200);
  echo  json_encode(array('user_id'=>$field[0], 'access_token' => $field[2], 'email'=>$field[4], 'password' => $field[2],'response_code'=>200));
} else  {
  echo http_response_code(401);
}

?>