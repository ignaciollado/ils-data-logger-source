<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

require_once 'encrDecr.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$postedData = file_get_contents("php://input");
$request = json_decode($postedData, TRUE);

$sql = "SELECT id, empresa, nif, domicilio, localidad, cpostal, 
telefono_rep, situacion, email_rep 
FROM pindust_expediente 
WHERE (tipo_tramite='ILS' AND situacion='empresaAdherida' AND email_rep = '" .$request['email']. "')";

$result = mysqli_query($conn, $sql);
$rowcount = mysqli_num_rows($result);
$field = mysqli_fetch_row($result);

mysqli_close($conn);

if ($rowcount==1) {
  header('Content-Type: application/json');
  echo  json_encode(array('user_id'=>$field[0], 'empresa' => $field[1],  
  'access_token' => $field[2], 'domicilio' =>$field[3], 
  'localidad' => $field[4], 'cpostal' => $field[5], 'telefono_rep' => $field[6],
  'email'=>$field[8], 
  'password' => $field[2],'response_code'=>200));
} else  {
  echo http_response_code(401);
}

?>