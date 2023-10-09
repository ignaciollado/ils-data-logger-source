<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';
require_once 'encrDecr.php';

mysqli_query($conn, "SET NAMES 'utf8'");

$postedData = file_get_contents("php://input");
$request = json_decode($postedData, TRUE);
$monthAndYear = $request['monthYearDate'];
$monthAndYear = explode("/", $monthAndYear);
$monthWaterConsumption = $monthAndYear[0];
$yearWaterConsumption = $monthAndYear[1];

/* $sql = "INSERT INTO `ils_consumption` (companyId, companyDelegationId, aspectId, energyId, year, `".$monthWaterConsumption;
$sql = $sql . "`) VALUES("
.$request['companyId'].","
.$request['delegation'].","
.$request['aspectId'].","
.$request['energy']."0,'"
.$yearWaterConsumption."',"
.$request['quantityWater'].") ON DUPLICATE KEY UPDATE `".$monthWaterConsumption."` = ".$request['quantityWater']; */

/* CONTAR CUANTOS REGISTROS HAY */
$sqlCount = "SELECT *
FROM `ils_consumption` 
WHERE  companyId=". $request['companyId']." 
AND companyDelegationId =". $request['delegation']." 
AND aspectId =". $request['aspectId']." 
AND year ='". $yearWaterConsumption."'";

if ($result=mysqli_query($conn,$sqlCount))
{
  $rowcount=mysqli_num_rows($result);
  if ($rowcount > 0) {
    $sql = "UPDATE `ils_consumption`
            SET `".$monthWaterConsumption."` = '".$request['quantityWater']."'
            WHERE  companyId=". $request['companyId']." 
            AND companyDelegationId =". $request['delegation']." 
            AND aspectId =". $request['aspectId']." 
            AND year ='". $yearWaterConsumption."'"; 
  } else {
    $sql = "INSERT INTO `ils_consumption` (companyId, companyDelegationId, aspectId, year, `".$monthWaterConsumption
           ."`) VALUES("
          .$request['companyId'].","
          .$request['delegation'].","
          .$request['aspectId'].",'"
          .$yearWaterConsumption."','"
          .$request['quantityWater']."')";
  }
}

mysqli_free_result($result);

$result = mysqli_query($conn, $sql);

mysqli_close($conn);
if ($result) {
  header('Content-Type: application/json');
  echo  json_encode(array('user_id'=>$field[0], 'access_token' => $field[2], 'email'=>$field[4], 'password' => $field[2],'response_code'=>200));
} else  {
  echo http_response_code(401);
}

?>
