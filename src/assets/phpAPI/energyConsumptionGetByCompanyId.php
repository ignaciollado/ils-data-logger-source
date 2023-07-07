<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$companyId = $_GET['companyId'];
$sql = "SELECT ils_consumption.consumptionId, ils_consumption.companyId, ils_consumption.aspectId,
ils_consumption.quantity, ils_consumption.fromDate, ils_consumption.toDate, ils_consumption.createAt,
ils_consumption.updatedAt, 
ils_energy.nameES, ils_energy.nameCA, 
ils_company_delegation.name, ils_company_delegation.address

FROM ils_consumption
LEFT JOIN ils_energy ON ils_consumption.energyId=ils_energy.energyId 
LEFT JOIN ils_company_delegation ON ils_consumption.companyDelegationId=ils_company_delegation.companyDelegationId 

WHERE ils_consumption.companyId =".$companyId." Order by consumptionId";

$result = mysqli_query($conn, $sql);

while($consumptions = mysqli_fetch_array($result, MYSQLI_ASSOC)){
    $vec[] = $consumptions;
}

$cad = json_encode($vec);
mysqli_close($conn);
echo $cad;
header('Content-Type: application/json');
?>