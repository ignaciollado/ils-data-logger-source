<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$companyId = $_GET['companyId'];
$sql = "SELECT ils_company_delegation.name as delegation, ils_energy.nameES as energyName, year,
        `01`+`02`+`03`+`04`+`05`+`06`+`07`+`08`+`09`+`10`+`11`+`12` as totalYear

        FROM ils_consumption 

        LEFT JOIN ils_energy ON ils_consumption.energyId=ils_energy.energyId 
        LEFT JOIN ils_company_delegation ON ils_consumption.companyDelegationId=ils_company_delegation.companyDelegationId

        WHERE ils_consumption.aspectId = 1 AND ils_consumption.companyId = ".$companyId."  
        ORDER by ils_consumption.energyId, Year, ils_consumption.companyDelegationId"; 

$result = mysqli_query($conn, $sql);

while($consumptions = mysqli_fetch_array($result, MYSQLI_ASSOC)){
    $vec[] = $consumptions;
}

$cad = json_encode($vec);
mysqli_close($conn);
echo $cad;
header('Content-Type: application/json');
?>