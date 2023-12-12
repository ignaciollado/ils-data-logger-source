<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pre_datalogger.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$postedData = file_get_contents("php://input");
$request = json_decode($postedData, TRUE);

$companyId = $_GET['companyId'];
$completed = $_GET['completed'];

$companyQuestionnaireId = time();

$userAnswers = $request['0'];
$userAnswers .= $request['1'];
$userAnswers .= $request['2'];
$userAnswers .= $request['3'];
$userAnswers .= $request['4'];

$sql = "INSERT INTO globalQuestionaire(companyId, companyQuestionnaireId, userAnswers, completed) 
VALUES ("
.$companyId.",'"
.$companyQuestionnaireId.",'"
.$userAnswers."','"
.$completed
."')";

echo $sql;

mysqli_free_result($result);

$result = mysqli_query($conn, $sql);

mysqli_close($conn);
if ($result) {
  header('Content-Type: application/json');
  echo  http_response_code(200);
} else  {
  echo http_response_code(401);
}

?>
