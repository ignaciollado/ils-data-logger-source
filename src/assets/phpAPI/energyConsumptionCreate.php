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
$monthEnergyConsumption = $monthAndYear[0];
$yearEnergyConsumption = $monthAndYear[1];

/* CONTAR CUANTOS REGISTROS HAY */
$sqlCount = "SELECT *
FROM `ils_consumption` 
WHERE  companyId=". $request['companyId']." 
AND companyDelegationId =". $request['delegation']." 
AND aspectId =". $request['aspectId']." 
AND energyId =". $request['energy']." 
AND year ='". $yearEnergyConsumption."'";

if ($result=mysqli_query($conn,$sqlCount))
{
  $rowcount=mysqli_num_rows($result);
  if ($rowcount > 0) {
    $sql = "UPDATE `ils_consumption`
            SET `".$monthEnergyConsumption."` = '".$request['quantity']."'
            WHERE  companyId=". $request['companyId']." 
            AND companyDelegationId =". $request['delegation']." 
            AND aspectId =". $request['aspectId']." 
            AND energyId =". $request['energy']." 
            AND year ='". $yearEnergyConsumption."'"; 
  } else {
    $sql = "INSERT INTO `ils_consumption` (companyId, companyDelegationId, aspectId, energyId, year, `".$monthEnergyConsumption
           ."`) VALUES("
          .$request['companyId'].","
          .$request['delegation'].","
          .$request['aspectId'].","
          .$request['energy'].",'"
          .$yearEnergyConsumption."','"
          .$request['quantity']."')";
  }
}
mysqli_free_result($result);

$result = mysqli_query($conn, $sql);

mysqli_close($conn);
if ($result) {
  header('Content-Type: application/json');
  echo  http_response_code(200);
} else  {
  echo http_response_code(401);
}

?>
