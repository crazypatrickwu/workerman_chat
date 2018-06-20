<?php
/**
 * 加载workman的内容
 */
use Workerman\worker;
use Workerman\WebServer;

require_once __DIR__ . '/vendor/autoload.php';

/**
 * windows下单个PHP文件不支持多进程workers
 * 需要分布式，然后需要同时运行多个文件
 * 以下方法只针对linux系统有效
 */
// require_once __DIR__ . '/socket_server.php';

require_once __DIR__ . '/web_server.php';

require_once __DIR__ . '/gateway_server.php';

require_once __DIR__ . '/register_server.php';

require_once __DIR__ . '/business_server.php';

//定义是否根目录启动
define('GLOBAL_START' , 1);

//启动所有服务
Worker::runAll();
