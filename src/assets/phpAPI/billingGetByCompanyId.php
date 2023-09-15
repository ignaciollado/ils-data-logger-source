<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$companyId = $_GET['companyId'];

$sql = "SELECT ils_company_delegation.name as delegation, ils_billing.year, ils_billing.month, (ils_billing.quantity.'/'.ils_billing.objective) as quantity, 
    ils_billing.Id, ils_billing.companyId, ils_billing.companyDelegationId,
    ils_company_delegation.address

FROM ils_billing
LEFT JOIN ils_company_delegation ON ils_billing.companyDelegationId=ils_company_delegation.companyDelegationId
WHERE ils_billing.companyId =".$companyId;

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
