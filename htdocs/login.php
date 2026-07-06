<?php
require_once __DIR__ . '/config.php';

function is_json_request() {
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    return str_contains($accept, 'application/json') || str_contains($contentType, 'application/json');
}

function get_request_payload() {
    if (str_contains($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')) {
        $body = file_get_contents('php://input');
        $json = json_decode($body, true);
        return is_array($json) ? $json : [];
    }

    return $_POST;
}

function json_response($payload, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = get_request_payload();
    $username = trim($data['username'] ?? '');
    $password = trim($data['password'] ?? '');

    if ($username === '' || $password === '') {
        $message = 'Please enter your username and password.';
        if (is_json_request()) {
            json_response(['success' => false, 'message' => $message], 400);
        }
    } else {
        $stmt = $conn->prepare('SELECT id, full_name, username, password_hash, role FROM users WHERE username = ? OR email = ?');
        $stmt->bind_param('ss', $username, $username);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if ($user && verify_password($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['full_name'] = $user['full_name'];
            $_SESSION['role'] = $user['role'];

            if (is_json_request()) {
                json_response([
                    'success' => true,
                    'role' => $user['role'],
                    'user' => [
                        'id' => (int) $user['id'],
                        'full_name' => $user['full_name'],
                        'username' => $user['username'],
                    ],
                ]);
            }

            header('Location: dashboard.php');
            exit;
        }

        $message = 'Invalid username or password.';
        if (is_json_request()) {
            json_response(['success' => false, 'message' => $message], 401);
        }
    }
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Login | FaceFit</title>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <div class="auth-card">
    <h1>Welcome back</h1>
    <p>Sign in to your FaceFit dashboard.</p>
    <?php if ($message): ?><div class="message error"><?php echo e($message); ?></div><?php endif; ?>
    <form method="post">
      <input type="text" name="username" placeholder="Username or email" required>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Log in</button>
    </form>
    <p class="switch-text">No account yet? <a href="register.php">Create one here</a></p>
    <p class="switch-text secondary">Seed accounts: admin / Admin123!, user / User123!, stylist / Stylist123!</p>
  </div>
</body>
</html>
