<?php
/**
 * Created by MY_MIND.
 * User: WDJ
 * Date: 2018/6/12 0012
 * Time: 09:35
 */
/**
 *用workman使用HTTP协议提供web服务
 */
use Workerman\Worker;
// 自动加载类
require_once __DIR__ . '/Workerman/Autoloader.php';

//创建一个Worker监听2345端口，使用http协议通讯
$tcp_worker = new Worker("tcp://0.0.0.0:2323");

//启动四个进程对外提供服务
$tcp_worker->count = 4;

///接收到浏览器发送的数据时回复hello world给浏览器
$tcp_worker->onMessage = function($connection , $data){
    $connection->send('hello ' . $data);
};

//运行Worker
Worker::runAll();