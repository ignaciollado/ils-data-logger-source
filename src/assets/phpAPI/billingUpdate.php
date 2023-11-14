<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$billingId = $_GET['billingId'];
$postedData = file_get_contents("php://input");
$request = json_decode($postedData, TRUE);

$sql = "UPDATE ils_billing SET

`01`='".$request['jan']."',
`02`='".$request['feb']."',
`03`='".$request['mar']."',
`04`='".$request['apr']."',
`05`='".$request['may']."',
`06`='".$request['jun']."',
`07`='".$request['jul']."',
`08`='".$request['aug']."',
`09`='".$request['sep']."',
`10`='".$request['oct']."',
`11`='".$request['nov']."',
`12`='".$request['dec']."'
 WHERE id = " .$billingId;

$result = mysqli_query($conn, $sql);

if ( $result ) {
    while( $consumption = mysqli_fetch_row($result) )
    {
        $vec = $consumption;
    }
    $cad = json_encode($vec);
}

mysqli_close($conn);
echo $cad;
header('Content-Type: application/json');
?>
