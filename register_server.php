<?php
use Workerman\Worker;
use GatewayWorker\Register;

require_once __DIR__ . '/vendor/autoload.php';

/**
 * gateway进程和BusinessWorker进程启动后分别向Register进程注册自己的通讯地址
 * Gateway进程和BusinessWorker通过Register进程得到通讯地址后
 * 就可以连接并通讯了
 */
// register 服务必须是text协议
$register = new Register("text://0.0.0.0:3535");

$register->name = 'RegGateway';

$register->count = 1;

if(!defined('GLOBAL_START'))
{
	Worker::runAll();
}

