<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

require_once 'encrDecr.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$postedData = file_get_contents("php://input");

$request = json_decode($postedData, TRUE);

$userId = $_GET['userId'];
$nif = $request['nif'];
$domicilio = $request['domicilio'];
$cnaeSelect = $request['cnaeSelect'];
$activityIndicator = $request['activityIndicator'];

echo "____".$activityIndicator."___";

if(isset($activityIndicator)) {
  echo "activityindicator";
}
if(isset($domicilio)){
  echo "domicilio";
}

$sql = "UPDATE pindust_expediente SET nif = '".$nif."', domicilio = '".$domicilio."', cnae = '".$cnaeSelect."', 
activityIndicator = ".json_encode($activityIndicator)."
 WHERE id = " .$userId;

$result = mysqli_query($conn, $sql);
$rowcount = mysqli_num_rows($result);

mysqli_close($conn);
if ($result) {
  header('Content-Type: application/json');
  echo  json_encode(array('updated' => true,'response_code'=>200));
} else  {
  echo json_encode(array('updated' => false,'response_code'=>401));
}

?>