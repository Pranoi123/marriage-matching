<?php
$conn = new mysqli("localhost", "yourUsername", "yourPassword", "marriage_matching");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
