<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $currentUserId = $data['user_id'] ?? null;

    if (!$currentUserId) {
        echo json_encode(['error' => 'User ID is required']);
        exit;
    }

    // Get user's preferences
    $prefStmt = $pdo->prepare("SELECT * FROM Preferences WHERE user_id = ?");
    $prefStmt->execute([$currentUserId]);
    $preferences = $prefStmt->fetch(PDO::FETCH_ASSOC);

    if (!$preferences) {
        echo json_encode(['error' => 'No preferences found for this user']);
        exit;
    }

    // Build dynamic query for matching profiles
    $query = "
        SELECT u.user_id, u.first_name, u.last_name, u.dob, u.city, u.country,
               p.bio, p.religion, p.caste, p.education, p.occupation, p.income_range
        FROM Users u
        JOIN Profiles p ON u.user_id = p.user_id
        WHERE u.user_id != :currentUserId
    ";

    $params = [':currentUserId' => $currentUserId];

    // Age filter (required)
    $query .= " AND TIMESTAMPDIFF(YEAR, u.dob, CURDATE()) BETWEEN :minAge AND :maxAge";
    $params[':minAge'] = $preferences['preferred_age_min'];
    $params[':maxAge'] = $preferences['preferred_age_max'];

    // Optional filters
    if (!empty($preferences['preferred_religion'])) {
        $query .= " AND p.religion = :religion";
        $params[':religion'] = $preferences['preferred_religion'];
    }

    if (!empty($preferences['preferred_caste'])) {
        $query .= " AND p.caste = :caste";
        $params[':caste'] = $preferences['preferred_caste'];
    }

    if (!empty($preferences['preferred_education'])) {
        $query .= " AND p.education = :education";
        $params[':education'] = $preferences['preferred_education'];
    }

    if (!empty($preferences['preferred_occupation'])) {
        $query .= " AND p.occupation = :occupation";
        $params[':occupation'] = $preferences['preferred_occupation'];
    }

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $matches = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['matches' => $matches]);
} catch(PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>