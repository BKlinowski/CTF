<?php
    // Takes raw data from the request
$json = file_get_contents('php://input');
$data = json_decode($json);
$res = simplexml_load_string($data->xmldata,'SimpleXMLElement',LIBXML_NOENT);
echo "dupa";
?>