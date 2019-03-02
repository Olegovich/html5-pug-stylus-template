<?php
// Response only on ajax requests
if ($_SERVER['HTTP_X_REQUESTED_WITH'] != 'XMLHttpRequest') {
    $host = $_SERVER['HTTP_HOST'];
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: http://$host");
    exit();
}


// For multiple forms sending

$to = ["yourmail@mail.ru, yourmail@gmail.com"];
$email_from = "yourdomain@yourdomain.by";
$headers = "From:<".$email_from.">\n";
$headers.= "Content-Type:text/html; charset=UTF-8";

// Check by hidden input value in each form
if (trim($_POST['type']) == "call_form") {
	$subject = "Контактная форма - Заказать звонок (" . $_SERVER['HTTP_HOST'] . ")";
	$body  = $subject . "<br/><br/>";

	if (isset($_POST["name"]) && !empty($_POST["name"])) {
	    $body  .= "<strong>Имя:</strong> " . $_POST['name'] . "<br/>";
	}
	if (isset($_POST["phone"]) && !empty($_POST["phone"])) {
	    $body  .= "<strong>Телефон:</strong> " . $_POST['phone'] . "<br/>";
	}
	if (isset($_POST["site"]) && !empty($_POST["site"])) {
        $body  .= "<strong>Адрес сайта клиента:</strong> " . $_POST['site'] . "<br/>";
	}
}
elseif (trim($_POST['type']) == "consultation_form") {
	$subject = "Контактная форма - Консультация (" . $_SERVER['HTTP_HOST'] . ")";
	$body  = $subject . "<br/><br/>";

	if (isset($_POST["name"]) && !empty($_POST["name"])) {
	    $body  .= "<strong>Имя:</strong> " . $_POST['name'] . "<br/>";
	}
	if (isset($_POST["phone"]) && !empty($_POST["phone"])) {
	    $body  .= "<strong>Телефон:</strong> " . $_POST['phone'] . "<br/>";
	}
}


$headers = "From:<".$email_from.">\n";
$headers .= "Content-Type:text/html; charset=UTF-8";

foreach ( $to as $key => $email ) {
	mail($email, $email_subject, $email_body, $headers);
}

return true;



/*
// For single form sending

if (trim($_POST['type']) == "call_form" && $_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['name'])) {$name = $_POST['name'];}
    if (isset($_POST['phone'])) {$phone = $_POST['phone'];}
    $to = "yourmail@mail.ru";
    $subject = "Заказ звонка";
    $headers = "Content-type: text/html; charset=utf-8 \r\n";
    $message = "<p><strong>Имя:</strong> $name</p>
    <p><strong>Телефон:</strong> phone</p>";
    mail($to, $subject, $message, $headers);
}
*/
