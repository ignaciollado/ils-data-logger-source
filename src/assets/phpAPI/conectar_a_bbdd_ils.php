<?php

$mysqlhost = 'vl21655.dinaserver.com';
$username = 'wp-12bee843fa2a3';
$password = '6?32*/UazJ6w]07N/[2sD0KX';
$dbname = 'wp_12bee843fa2a33d7';

// Crear la conexión

$conn = mysqli_connect($mysqlhost, $username, $password, $dbname);

// Comprobar si se ha conectado correctamente.

if (!$conn) {

    die("Connexió fallida: " . mysqli_connect_error());

}
// Change character set to utf8
mysqli_set_charset($conn,"utf8");
// echo "Connected successfully";
return $conn;

// mysqli_close($conn);
?>