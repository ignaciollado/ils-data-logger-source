<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_ils.php';
require_once 'encrDecr.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$postedData = file_get_contents("php://input");
$request = json_decode($postedData, TRUE);
$userId = $_GET['userId'];

$sql = "UPDATE wp_users SET 
user_login = '".$request['name']."',
user_pass = '".$request['password']."',
user_email ='".$request['email']."'
WHERE ID = " .$userId;

$result = mysqli_query($conn, $sql);
$rowcount=mysqli_num_rows($result);
$field = mysqli_fetch_row($result);

mysqli_close($conn);
if ($result==1) {
  header('Content-Type: application/json');
  echo  json_encode(array('user_id'=>$field[0], 'access_token' => $field[2], 'email'=>$field[4], 'password' => $field[2],'response_code'=>200));
} else  {
  echo http_response_code(401);
}

?>