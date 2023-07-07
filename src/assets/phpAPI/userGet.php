<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

/* require_once 'conectar_a_bbdd.php'; */
require_once 'conectar_a_bbdd_ils.php';
require_once 'encrDecr.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$userId = $_GET['userId'];

$sql = "SELECT * FROM wp_users WHERE ID = " .$userId;
$result = mysqli_query($conn, $sql);

if ( $result ) {
    while( $userData = mysqli_fetch_row($result) )
    {
        $vec = $userData;
    }
    $cad = json_encode($vec);
}

mysqli_close($conn);
echo $cad;
header('Content-Type: application/json');

?>