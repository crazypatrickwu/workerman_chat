<?php
use Workerman\Worker;
use Workerman\WebServer;

require_once __DIR__ . '/vendor/autoload.php';

/**
 * 设置一个web服务器
 */
$webServer = new WebServer('http://127.0.0.1:3333');

//添加根路径
$webServer->addRoot('localhost' , __DIR__ . '/web');

//设置名字
$webServer->name = 'WebHome';

//可以设置虚拟主机
$webServer->addRoot('win.qiligame.com' , __DIR__ . '/web');

//设置进程
$webServer->count = 3;

//如果不是在根目录启动，则运行runAll()
if(!defined('GLOBAL_START'))
{
	Worker::runAll();
}