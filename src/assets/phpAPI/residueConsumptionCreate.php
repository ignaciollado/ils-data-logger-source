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
$monthResidueConsumption = $monthAndYear[0];
$yearResidueConsumption = $monthAndYear[1];

/* CONTAR CUANTOS REGISTROS HAY */
$sqlCount = "SELECT *
FROM `ils_consumption` 
WHERE  companyId=". $request['companyId']." 
AND companyDelegationId =". $request['delegation']." 
AND aspectId =". $request['aspectId']." 
AND residueId =". $request['residue']." 
AND year ='". $yearResidueConsumption."'";

if ($result=mysqli_query($conn,$sqlCount))
{
  $rowcount=mysqli_num_rows($result);
  if ($rowcount > 0) {
    $sql = "UPDATE `ils_consumption`
            SET `".$monthResidueConsumption."` = '".$request['quantityResidue'].'/'.$request['objective']."'
            WHERE  companyId=". $request['companyId']." 
            AND companyDelegationId =". $request['delegation']." 
            AND aspectId =". $request['aspectId']." 
            AND residueId =". $request['residue']." 
            AND year ='". $yearResidueConsumption."'"; 
  } else {
    $sql = "INSERT INTO `ils_consumption` (companyId, companyDelegationId, aspectId, residueId, year, `".$monthResidueConsumption
           ."`) VALUES("
          .$request['companyId'].","
          .$request['delegation'].","
          .$request['aspectId'].","
          .$request['residue'].",'"
          .$yearResidueConsumption."','"
          .$request['quantityResidue'].'/'.$request['objective']."')";
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
