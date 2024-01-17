<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$companyId = $_GET['companyId'];

$sql = "SELECT *, globalQuestionnaire.updated_at as updated_at, ils_company_delegation.name as companyDelegationName

FROM globalQuestionnaire
LEFT JOIN ils_company_delegation ON globalQuestionnaire.companyDelegationId=ils_company_delegation.companyDelegationId
WHERE globalQuestionnaire.companyId =".$companyId;

$sql .= " ORDER BY companyQuestionnaireId DESC ";

$result = mysqli_query($conn, $sql);

while($consumptions = mysqli_fetch_array($result, MYSQLI_ASSOC)){
    $vec[] = $consumptions;
}

$cad = json_encode($vec);
mysqli_close($conn);
echo $cad;
header('Content-Type: application/json');
?>
