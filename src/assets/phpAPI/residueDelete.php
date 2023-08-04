<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");

$residueId = mysqli_real_escape_string($conn, $_GET["residueId"]);

$query = "DELETE FROM ils_residue WHERE residueId = ". $residueId;

$result = mysqli_query($conn, $query);

return $result;

mysqli_close($conn);

?>
