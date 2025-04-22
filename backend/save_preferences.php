<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $user_id = $data['user_id'] ?? null;
    $preferences = $data['preferences'] ?? null;

    if (!$user_id || !$preferences) {
        echo json_encode(['error' => 'User ID and preferences are required']);
        exit;
    }

    // Check if preferences already exist
    $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM Preferences WHERE user_id = ?");
    $checkStmt->execute([$user_id]);
    $exists = $checkStmt->fetchColumn();

    if ($exists) {
        // Update existing preferences
        $stmt = $pdo->prepare("
            UPDATE Preferences 
            SET preferred_age_min = ?, preferred_age_max = ?, 
                preferred_religion = ?, preferred_caste = ?, 
                preferred_education = ?, preferred_occupation = ?
            WHERE user_id = ?
        ");
        $stmt->execute([
            $preferences['age_min'],
            $preferences['age_max'],
            $preferences['religion'] ?: null,
            $preferences['caste'] ?: null,
            $preferences['education'] ?: null,
            $preferences['occupation'] ?: null,
            $user_id
        ]);
    } else {
        // Insert new preferences
        $stmt = $pdo->prepare("
            INSERT INTO Preferences (
                user_id, preferred_age_min, preferred_age_max, 
                preferred_religion, preferred_caste, 
                preferred_education, preferred_occupation
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $user_id,
            $preferences['age_min'],
            $preferences['age_max'],
            $preferences['religion'] ?: null,
            $preferences['caste'] ?: null,
            $preferences['education'] ?: null,
            $preferences['occupation'] ?: null
        ]);
    }

    echo json_encode(['success' => 'Preferences saved successfully']);
} catch(PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>