<?php
session_start();

$host = 'localhost';
$db   = 'facefit_db';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die('Database connection failed: ' . $conn->connect_error);
}
$conn->set_charset('utf8mb4');

function e($value) {
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function require_login($allowedRoles = []) {
    if (empty($_SESSION['user_id'])) {
        header('Location: login.php');
        exit;
    }

    if ($allowedRoles && !in_array($_SESSION['role'], $allowedRoles, true)) {
        header('Location: dashboard.php');
        exit;
    }
}

function verify_password($inputPassword, $storedPassword) {
    if (password_verify($inputPassword, $storedPassword)) {
        return true;
    }

    return $inputPassword === $storedPassword;
}
