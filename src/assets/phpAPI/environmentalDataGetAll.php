<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$companyId = $_GET['companyId'];
/* $sql = "SELECT energyId as idEnv, nameES, nameCA, '1' as aspect FROM ils_energy
UNION
SELECT residueId as idEnv, nameES, nameCA, '3' as aspect FROM ils_residue
UNION
SELECT aspectId as idEnv, nameES, nameCA, '2' as aspect FROM ils_aspect WHERE aspectId = 2
UNION
SELECT aspectId as idEnv, nameES, nameCA, '5' as aspect FROM ils_aspect WHERE aspectId = 5"; */

$sql = "SELECT energyId as chapterItemId, nameES as chapterItemName, nameCA, '1' as aspect FROM ils_energy
UNION
SELECT aspectId as chapterItemId, nameES as chapterItemName, nameCA, '2' as aspect FROM ils_aspect WHERE aspectId = 2
UNION
SELECT aspectId as chapterItemId, nameES as chapterItemName, nameCA, '5' as aspect FROM ils_aspect WHERE aspectId = 5";

$result = mysqli_query($conn, $sql);

while($aspects = mysqli_fetch_array($result, MYSQLI_ASSOC)){
    $vec[] = $aspects;
}

$cad = json_encode($vec);
mysqli_close($conn);
echo $cad;
header('Content-Type: application/json');
?>
