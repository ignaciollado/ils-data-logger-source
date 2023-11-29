<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$companyId = $_GET['companyId'];
$aspectId = $_GET['aspectId'];

$sql = "SELECT ils_objective.Id, ils_objective.companyId, ils_objective.aspectId, 
(CASE ils_objective.aspectId WHEN 1 THEN ils_objective.energyId ELSE ils_objective.residueId END) as enviromentalData,  
(CASE ils_objective.aspectId 
 	WHEN 1 THEN ils_energy.nameES  
 	WHEN 2 THEN 'Water'  
 	WHEN 3 THEN ils_residue.nameES 
 	WHEN 5 THEN 'CO2e Emissions' 
 ELSE '--' 
 END) as enviromentalDataName,
ils_objective.theRatioType, ils_objective.year, 
ils_objective.01 as 'jan', ils_objective.02 as 'feb', ils_objective.03 as 'mar', ils_objective.04 as 'apr', 
ils_objective.05 as 'may', ils_objective.06 as 'jun', ils_objective.07 as 'jul', ils_objective.08 as 'aug', 
ils_objective.09 as 'sep', ils_objective.10 as 'oct', ils_objective.11 as 'nov', ils_objective.12 as 'dec', 
ils_company_delegation.name as delegation, ils_objective.created_at

FROM ils_objective LEFT JOIN ils_energy ON ils_objective.energyId=ils_energy.energyId 
LEFT JOIN ils_company_delegation ON ils_objective.companyDelegationId=ils_company_delegation.companyDelegationId 
LEFT JOIN ils_aspect ON ils_objective.aspectId = ils_aspect.aspectId 
LEFT JOIN ils_residue ON ils_objective.residueId = ils_residue.residueId

WHERE ils_objective.companyId =".$companyId;

if (isset($aspectId)) {
  $sql .= " AND ils_objective.aspectId=".$aspectId;
}

$sql .= " ORDER BY ils_company_delegation.name, ils_objective.year, ils_energy.nameES ";
/* echo $sql; */

$result = mysqli_query($conn, $sql);

while($consumptions = mysqli_fetch_array($result, MYSQLI_ASSOC)){
    $vec[] = $consumptions;
}

$cad = json_encode($vec);
mysqli_close($conn);
echo $cad;
header('Content-Type: application/json');
?>
