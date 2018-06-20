<?php
/**
 * 该页面功能是为了处理websocket协议的内容
 */
use Workerman\Worker;
use Workerman\Lib\Timer;

require_once  __DIR__ . '/vendor/autoload.php';

$worker = new Worker('websocket://0.0.0.0:3434');

$worker->name = 'websocket';

//设置进程总数
$worker->count = 3;

//当连接成功时
$worker->onOpen = function($connection , $data)
{
	$connection->send('连接成功');
};

//当连接发送消息时
$worker->onMessage = function($connection , $data)
{	
	//设置一个定时器
	$time_id = Timer::add(2, function(){
		echo 'this is a time_interval';
	} , [] , false);
	$type = ['login' ,'chat' , 'privateChat' , 'logout'];
	$data = json_decode($data , true);
	switch ($data['type']) {
		case $type[0]:
			$connection->send(json_encode(['type' => $data['type'] , 'data' => $data['data']] , JSON_UNESCAPED_UNICODE));
			break;

		case $type[1]:
			//如果是广播的话
			$connection->send(json_encode(['type' => $data['type'] , 'data' => $data] , JSON_UNESCAPED_UNICODE));
			break;

		default:
			# code...
			break;
	}

};

//当连接关闭时
$worker->onClose = function($connection)
{
	$connection->send('连接关闭');
};

if(!defined('GLOBAL_START'))
{
	Worker::runAll();
}