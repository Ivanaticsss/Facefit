<?php
require_once __DIR__ . '/config.php';
require_login();

$userId = (int) $_SESSION['user_id'];
$stmt = $conn->prepare('SELECT id, full_name, email, role FROM users WHERE id = ?');
$stmt->bind_param('i', $userId);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

$role = $_SESSION['role'];
$roleTitle = ucfirst($role);

$hero = [
    'admin' => [
        'title' => 'Manage FaceFit',
        'subtitle' => 'Monitor users, stylist activity, and platform analytics from one central panel.',
        'stats' => [
            ['label' => 'Total Users', 'value' => 3],
            ['label' => 'Active Bookings', 'value' => 8],
            ['label' => 'Saved Styles', 'value' => 14],
        ],
        'actions' => [
            ['title' => 'Review reports', 'copy' => 'Inspect flagged scans and usage analytics.'],
            ['title' => 'Manage users', 'copy' => 'Approve stylists and control access rights.'],
            ['title' => 'System settings', 'copy' => 'Adjust platform recommendations and consent policies.'],
        ],
        'panels' => [
            'Manage users and system access',
            'View salon-wide analytics',
            'Control recommendations and consent settings',
        ],
    ],
    'hairstylist' => [
        'title' => 'Your salon studio',
        'subtitle' => 'Manage appointments, client scans, and style requests in one place.',
        'stats' => [
            ['label' => 'Today Clients', 'value' => 5],
            ['label' => 'Pending Requests', 'value' => 2],
            ['label' => 'Ratings', 'value' => '4.8/5'],
        ],
        'actions' => [
            ['title' => 'Scan client face', 'copy' => 'Open the client scanner and capture their style details.'],
            ['title' => 'Client queue', 'copy' => 'Review upcoming appointments and saved profiles.'],
            ['title' => 'Messages', 'copy' => 'Send updates to clients and confirm availability.'],
        ],
        'panels' => [
            'Review today’s appointments',
            'Manage stylist requests and ratings',
            'Coordinate client style plans',
        ],
    ],
    'user' => [
        'title' => 'Your personal FaceFit hub',
        'subtitle' => 'Scan, save your favorite styles, and book salon visits with smart recommendations.',
        'stats' => [
            ['label' => 'Your Scans', 'value' => 7],
            ['label' => 'Saved Looks', 'value' => 4],
            ['label' => 'Bookings', 'value' => 3],
        ],
        'actions' => [
            ['title' => 'Scan a look', 'copy' => 'Capture a new hairstyle and receive recommendations.'],
            ['title' => 'Saved styles', 'copy' => 'Browse your favorite matches and saved looks.'],
            ['title' => 'Salon booking', 'copy' => 'Find a salon and book your next appointment.'],
        ],
        'panels' => [
            'View your profile and scans',
            'Track saved styles and bookings',
            'Access personalized hair recommendations',
        ],
    ],
];

$current = $hero[$role];
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?php echo e($roleTitle); ?> Dashboard | FaceFit</title>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <div class="navbar">
    <div>
      <strong>FaceFit</strong>
      <div class="small">Logged in as <?php echo e($user['full_name']); ?> (<?php echo e($role); ?>)</div>
    </div>
    <a href="logout.php">Log out</a>
  </div>

  <div class="dashboard-wrapper">
    <div class="dashboard-card top-card">
      <div class="top-header">
        <div>
          <div class="role-label"><?php echo e(strtoupper($role)); ?></div>
          <h1><?php echo e($current['title']); ?></h1>
          <p class="hero-copy"><?php echo e($current['subtitle']); ?></p>
        </div>
        <div class="badge">FaceFit</div>
      </div>

      <div class="hero-stats">
        <?php foreach ($current['stats'] as $stat): ?>
          <div class="hero-stat-card">
            <div class="stat-value"><?php echo e($stat['value']); ?></div>
            <div class="stat-label"><?php echo e($stat['label']); ?></div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>

    <div class="dashboard-card">
      <div class="section-header">
        <h2>Quick actions</h2>
      </div>
      <div class="action-grid">
        <?php foreach ($current['actions'] as $action): ?>
          <div class="quick-action">
            <div class="action-title"><?php echo e($action['title']); ?></div>
            <div class="action-copy"><?php echo e($action['copy']); ?></div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>

    <div class="dashboard-card">
      <div class="section-header">
        <h2>Role summary</h2>
      </div>
      <div class="grid">
        <?php foreach ($current['panels'] as $panel): ?>
          <div class="stat-box">
            <h3><?php echo e($panel); ?></h3>
            <p class="small">Live experience for <?php echo e($roleTitle); ?> users.</p>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
</body>
</html>
