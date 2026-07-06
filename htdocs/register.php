<?php
require_once __DIR__ . '/config.php';

function is_json_request() {
    return str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');
}

function json_response($payload, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($payload);
    exit;
}

$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullName = trim($_POST['full_name'] ?? '');
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $confirmPassword = trim($_POST['confirm_password'] ?? '');

    if ($fullName === '' || $username === '' || $email === '' || $password === '' || $confirmPassword === '') {
        $message = 'Please fill in all fields.';
    } elseif ($password !== $confirmPassword) {
        $message = 'Passwords do not match.';
    } else {
        $stmt = $conn->prepare('SELECT id FROM users WHERE username = ? OR email = ?');
        $stmt->bind_param('ss', $username, $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $message = 'That username or email is already taken.';
        } else {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $conn->prepare('INSERT INTO users (full_name, username, email, password_hash, role) VALUES (?, ?, ?, ?, "user")');
            $stmt->bind_param('ssss', $fullName, $username, $email, $hashedPassword);
            if ($stmt->execute()) {
                $_SESSION['user_id'] = $stmt->insert_id;
                $_SESSION['full_name'] = $fullName;
                $_SESSION['role'] = 'user';

                if (is_json_request()) {
                    json_response(['success' => true, 'message' => 'Account created successfully.', 'role' => 'user']);
                }

                header('Location: dashboard.php');
                exit;
            }
            $message = 'Registration failed. Please try again.';
        }
    }

    if (is_json_request()) {
        json_response(['success' => false, 'message' => $message], 400);
    }
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Create Account | FaceFit</title>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <div class="auth-card">
    <h1>Create your account</h1>
    <p>Join the FaceFit system and start managing your salon experience.</p>
    <?php if ($message): ?><div class="message error"><?php echo e($message); ?></div><?php endif; ?>
    <form method="post">
      <input type="text" name="full_name" placeholder="Full name" required>
      <input type="text" name="username" placeholder="Username" required>
      <input type="email" name="email" placeholder="Email" required>
      <input type="password" name="password" placeholder="Password" required>
      <input type="password" name="confirm_password" placeholder="Confirm password" required>
      <button type="submit">Create account</button>
    </form>
    <p class="switch-text">Already have an account? <a href="login.php">Log in here</a></p>
  </div>
</body>
</html>
