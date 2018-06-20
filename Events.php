<?php
use \GatewayWorker\Lib\Gateway;

/**
 * 负责主要的聊天处理逻辑
 */
class Events
{
	/**
	 * 接受消息的处理
	 */
	public static function onMessage($client_id , $message)
	{
		$type = ['pong' , 'login' , 'chat' , 'privateChat' , 'logout'];
		/**
		 * client_id是系统在每次创建连接时自动生成的
		 * 也可以使用自定义的uid与cline_id绑定
		 */
		$message = json_decode($message , true);
		if(!$message)
		{
			return;
		}

		//首先还是要判断message的类型
		switch ($message['type']) {
			//服务端的心跳测试
			case $type[0]:
				//发送给当前客户端的消息
				$data = [
					'type' => $type[0],
					'data' => 'test'	
				];
				Gateway::sendToCurrentClient(json_encode($data));
				return;
			
			//登录测试
			case $type[1]:
				//判断是否有房间号，如果没有的话默认就为1
				$room_id = isset($message['room_id']) ? intval($message['room_id']) : 1;
				$client_name = htmlspecialchars($message['name']);
				//保存session信息	
				$_SESSION['room_id'] = $room_id;
				$_SESSION['client_name'] = $client_name;

				//加入组织后向组织广播并且找到组织的所有成员
				Gateway::joinGroup($client_id , $room_id);

				$speak = json_encode([
					'type' 		=> 	$type[2],
					'id'		=>	'm' + time(),
					'img'		=>	$message['img'],
					'content' 	=>  $message['chatContent'],
					'username'	=>  $message['name'], 
				]);
				Gateway::sendToGroup($room_id , $speak);

				$client_lists = Gateway::getClientSessionsByGroup($room_id);
				foreach($client_lists as $k => $v){
					//键值是client_id，键名是数组,包括分组名room_id,和客户端名client_name
					$client_list[$k]	=	$v['client_name'];
				}
				$client_list[$client_id] = $client_name;
				$login = json_encode([
					'type'		=> $type[1],
					'clients'	=> $client_list,
				]);
				//向当前客户端发送成员信息
				Gateway::sendToCurrentClient($login);
				return;

			//发言
			case $type[2]:
				$speak = json_encode([
					'type'		=>	$type[2],
					'id'		=>	$message['id'],
					'img'		=>	$message['img'],
					'content' 	=>  $message['chatContent'],
					'username'	=>  $message['name'], 
				]);
				$room_id = $_SESSION['room_id'] ? $_SESSION['room_id'] : 1;
				Gateway::sendToGroup($room_id , $speak);

			//私聊
			case $type[3]:
				$room_id = isset($message['room_id']) ? intval($message['room_id']) : 1;

				$client_lists = Gateway::getClientSessionsByGroup($room_id);	
				//遍历所有群组是否有该客户端连线
				foreach($client_lists as $k=>$v){
					if($message['to'] == $v['client_name']){
						$privateId = $k;
					}
				}

				$privateTalk = json_encode([
					'type'		=>	$type[3],
					'id'		=>	$message['id'],
					'img'		=>	$message['img'],
					'content' 	=>  '<b style="color:red">' .$message['self']. '</b>对你说：' . $message['chatContent'],
					'username'	=>  $message['name'], 

				]);
				// var_export($privateId);
				//发送消息给私聊的人
				Gateway::sendToClient($privateId , $privateTalk);

			default:
				# code...
				return;
		}
	}

	/**
	 * 关闭连接
	 */
	public static function onclose($client_id)
	{
		Gateway::sendToGroup(1, "i'm logout");
	}

}