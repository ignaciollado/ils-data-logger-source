<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$companyId = $_GET['companyId'];
$sql = "SELECT count(companyDelegationId) as totalDelegations FROM `ils_company_delegation` WHERE companyId = " .$companyId;

$result = mysqli_query($conn, $sql);

while($totalDelegations = mysqli_fetch_array($result, MYSQLI_ASSOC)){
    /* $vec[] = $totalDelegations; */
    $vec = $totalDelegations;
}

$cad = json_encode($vec);
mysqli_close($conn);
echo $cad;
header('Content-Type: application/json');
?>
