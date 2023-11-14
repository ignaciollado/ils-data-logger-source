<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$companyId = $_GET['companyId'];

$sql = "SELECT ils_company_delegation.name as delegation, ils_cnaes.year, ils_cnaes.cnaeUnitSelected,
        ils_cnaes.01 as 'jan', ils_cnaes.02 as 'feb', ils_cnaes.03 as 'mar', ils_cnaes.04 as 'apr',
        ils_cnaes.05 as 'may', ils_cnaes.06 as 'jun', ils_cnaes.07 as 'jul', ils_cnaes.08 as 'aug', 
        ils_cnaes.09 as 'sep', ils_cnaes.10 as 'oct', ils_cnaes.11 as 'nov', ils_cnaes.12 as 'dec',
        ils_cnaes.Id, ils_cnaes.companyId, ils_cnaes.companyDelegationId,
        ils_company_delegation.address

FROM ils_cnaes
LEFT JOIN ils_company_delegation ON ils_cnaes.companyDelegationId=ils_company_delegation.companyDelegationId
WHERE ils_cnaes.companyId =".$companyId;

$sql .= " ORDER BY delegation, year";

$result = mysqli_query($conn, $sql);

while($billings = mysqli_fetch_array($result, MYSQLI_ASSOC)){
    $vec[] = $billings;
}

$cad = json_encode($vec);
mysqli_close($conn);
echo $cad;
header('Content-Type: application/json');
?>
