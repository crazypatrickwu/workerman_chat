<?php
use Workerman\Worker;
use GatewayWorker\Gateway;

require_once __DIR__ . '/vendor/autoload.php';

/**
 * GatewayWorker使用经典的Gateway和Worker进程模型
 * Gateway进程负责维持客户端连接，并转发客户端的数据给Worker进程处理
 * Worker进程负责处理实际的业务逻辑，并将结果推送给对应的客户端
 */

$gateway = new Gateway("websocket://0.0.0.0:3434");

$gateway->name = 'WsGateway';

$gateway->registerAddress = '0.0.0.0:3535';

$gateway->count = 4;

if(!defined('GLOBAL_START'))
{
	Worker::runAll();
}
