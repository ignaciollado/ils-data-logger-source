<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");

$Id = mysqli_real_escape_string($conn, $_GET["Id"]);

$query = "DELETE FROM ils_billing WHERE Id = ". $Id;

mysqli_query($conn, $query);

if(mysqli_affected_rows($conn) == 0){
    echo http_response_code(404);
} else {
    echo http_response_code(200);
}

mysqli_close($conn);

?>
