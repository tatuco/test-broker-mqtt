<?php
require __DIR__ . '/vendor/autoload.php';
use PhpMqtt\Client\MqttClient as Mqtt;
use PhpMqtt\Client\ConnectionSettings as Settings;
use Firebase\JWT\JWT;

class MqttClient
{
    use Token;
    private $server = 'localhost';
    private $port = 1883;
    private $connection;
    private $connectionSettings;

    public function __construct($clientId)
    {
        $password = self::generateJwt();
        $this->connectionSettings = (new Settings)
            ->setUsername('luis')
            ->setPassword($password)
            ->setConnectTimeout(3);
        $this->connection = new Mqtt($this->server, $this->port, $clientId);
    }

    public function publish($topic, $message)
    {
        $this->connection->connect($this->connectionSettings, true);
        $this->connection->publish($topic, $message, Mqtt::QOS_EXACTLY_ONCE);
        $this->connection->loop(true, true);
        $this->connection->disconnect();
    }
}

trait Token {
    public static function generateJwt()
    {
        $time = time();
            $key = 'SECURE_KEY';

            $token = array(
                'iat' => $time, // Tiempo que inició el token
                'exp' => $time + (60*60), // Tiempo que expirará el token (+1 hora)
                'data' => [ // información del usuario
                    'id' => 1,
                    'username' => 'luisjrm@936@gmail.com',
                    'password' => '123456'
                ]
            );

            $jwt = JWT::encode($token, $key);
            return $jwt;
    }
}

$mqttClient = new MqttClient('client-php');
$mqttClient->publish('broker-mqtt/otro', '{"message": "hola desde php"}');
$mqttClient->publish('broker-mqtt/test', '{"message": "hola desde php topic test"}');
