<?php
use Workerman\Worker;
use GatewayWorker\BusinessWorker;

require_once __DIR__ . '/vendor/autoload.php';

/**
 * BusinessWoker类也是基于Worker开发的
 * BusinessWorker是运行业务逻辑的进程，收到Gateway转发的时间以及请求时会默认调用Events.php中的
 * onConnect,onMessage,onClose方法 
 * 至少在Events类中实现onMessage方法
 */
$business = new BusinessWorker();

$business->name = 'BusGateway';

$business->registerAddress = '127.0.0.1:3535';

$business->count = 4;

if(!defined('GLOBAL_START'))
{
	Worker::runAll();
}
