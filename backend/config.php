<?php
$db_host = '127.0.0.1';
$db_port = '3307';
$db_name = 'MarriageMatching';
$db_user = 'root';
$db_pass = ''; // Update if password set

try {
    $dsn = "mysql:host=$db_host;port=$db_port;dbname=$db_name;charset=utf8mb4";
    $pdo = new PDO($dsn, $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->query("SELECT 1");
} catch(PDOException $e) {
    error_log("PDO Error: " . $e->getMessage(), 3, "C:/xampp/apache/logs/custom_error.log");
    echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
    exit;
}
?>