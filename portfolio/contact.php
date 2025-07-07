<?php
// Ensure no output before headers
ob_start();

header('Content-Type: application/json');

// Database configuration
$db_host = 'localhost';
$db_name = 'portfolio_db';
$db_user = 'root';
$db_pass = '';

// Initialize response array
$response = ['success' => false, 'message' => ''];

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    $response['message'] = 'Database connection failed';
    echo json_encode($response);
    exit;
}

// Get and sanitize form data
$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_STRING);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

// Validate inputs
if (empty($name)) {
    $response['message'] = 'Name is required';
    echo json_encode($response);
    exit;
}

if (empty($email)) {
    $response['message'] = 'Email is required';
    echo json_encode($response);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response['message'] = 'Please enter a valid email address';
    echo json_encode($response);
    exit;
}

if (empty($message)) {
    $response['message'] = 'Message is required';
    echo json_encode($response);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO contacts (name, email, subject, message, created_at) 
                          VALUES (:name, :email, :subject, :message, NOW())");
    
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':subject', $subject);
    $stmt->bindParam(':message', $message);
    
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Message sent successfully';
        
        // Send email notification (optional)
        $to = 'your.email@example.com';
        $email_subject = "New Contact Form Submission: $subject";
        $email_body = "You have received a new message from your website contact form.\n\n".
                      "Name: $name\n".
                      "Email: $email\n".
                      "Subject: $subject\n".
                      "Message:\n$message";
        $headers = "From: $email\r\n";
        $headers .= "Reply-To: $email";
        
        // Don't stop execution if email fails
        @mail($to, $email_subject, $email_body, $headers);
    } else {
        $response['message'] = 'Failed to save message';
    }
} catch (PDOException $e) {
    $response['message'] = 'Database error occurred';
}

// Clean any output buffer and send JSON
ob_end_clean();
echo json_encode($response);
exit;
?>