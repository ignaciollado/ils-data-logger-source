<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$billingId = $_GET['billingId'];
$sql = "SELECT * FROM ils_billing WHERE billingId = " .$billingId;
$result = mysqli_query($conn, $sql);

if ( $result ) {
    while( $billing = mysqli_fetch_row($result) )
    {
        $vec = $billing;
    }
    $cad = json_encode($vec);
}

mysqli_close($conn);
echo $cad;
header('Content-Type: application/json');
?>