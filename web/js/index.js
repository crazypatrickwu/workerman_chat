//获取url里的内容
var url = decodeURI(location.href).split('?')[1].split('&');

//匹配
var loginButton	= document.getElementsByClassName('login-button')[0];

//获取聊天内容框
var chatContent = document.getElementsByClassName('chat-content')[0];

//获取聊天输入框
var editBox = document.getElementsByClassName('edit-box')[0];

//获取用户栏
var userName = document.getElementsByClassName('user-name')[0];

//获取在线人数栏
var onlineCount = document.getElementsByClassName('online-count')[0];

//把登录页面的名称放在右侧
userName.innerHTML = url[1].split('=')[1];
var userImg = document.getElementsByClassName('user-img')[0];
//把登录页面的名称放在右侧
userImg.src = 'img/' + url[0].split('=')[1];

var logOut = document.getElementsByClassName('log-out')[0];

//获取聊天输入框发送按钮
var editButton = document.getElementsByClassName('edit-button')[0];

//获取所有登录人员下拉框
var privateBox = document.getElementsByClassName('private-box')[0];

//发送按钮绑定点击事件
editButton.addEventListener('click', sendMessage);

//登录按钮绑定点击事件
// logOut.addEventListener('click', closePage);

//登录匹配
loginButton.addEventListener('click', login);

//绑定Enter键和发送事件
document.onkeydown = function(event){
	var e = event || window.event;
	if(e && e.keyCode === 13){
		if(editBox.value !== ''){
			editButton.click();
		}else{
			alert("不可发送空消息");
		}
	}
}

//关闭页面
function closePage()
{
	var userAgent = navigator.userAgent;
	if(userAgent.indexOf('FirxFox') !== -1 || userAgent.indexOf('Chrome') !== -1){
		window.location.href = 'about:blank';
	}else{
		window.opener = null;
		window.open('', '_self');
		window.close();
	}
}

var websocket;

//设置信息类型
var type = new Array('pong' , 'login' ,'chat' , 'privateChat' , 'publicChat' , 'logout');
window.onload = function(){
	websocket = new WebSocket("ws://127.0.0.1:3434");

	//连接事件
	websocket.onopen = function(){
		console.log(userName.textContent + '登录了');
		websocket.send(JSON.stringify({
			name : userName.textContent,
			chatContent : '我来了',
			img : userImg.src,
			type : type[1],
		}));
	}
	
	//接收服务端发来的消息
	websocket.onmessage = message;

	//关闭连接
	websocket.onclose = function(e){
		// console.log(e);
	};
}

//登录匹配
function login()
{
	loginButton.value	  =	'离开';
	loginButton.removeEventListener('click', login);
	loginButton.addEventListener('click', logout);
}

// debugger;
//登出离开
function logout()
{
	if(confirm('确定离开嘛')){
		loginButton.value	   =	'连接';
		loginButton.removeEventListener('click', logout);
		loginButton.addEventListener('click', login);
		//接收到有人断开连接
		console.log(websocket);
		
	}
}

//当接收到消息并且不是本机时生成聊天气泡
/*websocket.on('message', function(information){
	console.log('i am message');
	if(information.name !== userName.textContent){
		createOtherMessage(information);
		changeStatus(information.id);
	}
})

//接受到私聊消息
websocket.on('to' + userName.textContent, function(data){
	console.log(data.chatContent);
	if(data.to == userName.textContent){
		privateGetMessage();
		createOtherMessage(data); 
	}
})

//接收到有人连接进来
websocket.on('connected', function(users){
	createToggle(users.users);
	//查看所有的用户以及数量
	onlineCount.innerHTML = 'Online:' + users.onlineCount;
})

//接受到有人退出去
websocket.on('disconnected', function(onlinecount){
	privateBox.options.length = 1;
	onlineCount.innerHTML = 'Online:' + onlinecount;
})
*/

//处理数据消息
function message(e)
{
	var data = JSON.parse(e.data);
	console.log(data.type);
	switch(data['type']){
		//心跳检测
		case type[0]:
			websocket.send(JSON.stringify({
				type : type[0],
				data : userName.textContent,
			}));
			break;

		//登录
		case type[1]:
			createToggle(data['clients']);
			break;

		//聊天室聊天
		case type[2]:
			if(data.username != userName.textContent){
				createOtherMessage(data);
			}
			break;

		//私聊
		case type[3]:
			createOtherMessage(data);
			privateGetMessage();
			break;

		default:
			console.log(111);
			break;
	} 
}

//发送本机消息
function sendMessage()
{
	var date = new Date();
	let stringId = 'm' + date.getTime() + Math.floor(Math.random() * 100 , 2);
	if(editBox.value != ''){
		let index = privateBox.selectedIndex;
		let privateMan = privateBox.options[index].value;
		var myInformation = {
			name : userName.textContent,
			chatContent : editBox.value,
			img : userImg.src,
			id : stringId,
			type : type[2],
		};
		if(privateMan == 0){
			websocket.send(JSON.stringify(myInformation));
			createMyMessage(stringId);
		}else{
			privateMessage();
			myInformation.to = privateMan;
			myInformation.self = userName.textContent;
			myInformation.type = type[3];
			websocket.send(JSON.stringify(myInformation));
			let privateContent = '你对<b style="color:red">' + privateMan + '</b>说：' + editBox.value;
			createMyMessage(stringId, privateContent);
		}
		editBox.value = '';
	}
}

//生成本机的聊天气泡
function createMyMessage(stringId, privateContent = '')
{
	var myMessageBox = document.createElement('div');
	myMessageBox.className = 'my-message-box';
	myMessageBox.id = stringId;

	var statusContent = document.createElement('div');
	statusContent.className = 'message-status';
	var statusSpan = document.createElement('span');
	statusSpan.innerHTML = '已送达';
	statusContent.appendChild(statusSpan);
	myMessageBox.appendChild(statusContent);

	var messageContent = document.createElement('div');
	messageContent.className = 'message-content';	
	var text = document.createElement('span');

	let innerText = privateContent ? privateContent : editBox.value;
	text.innerHTML = innerText;

	messageContent.appendChild(text);
	myMessageBox.appendChild(messageContent);

	var arrow = document.createElement('div');
	arrow.className = 'message-arrow';
	myMessageBox.appendChild(arrow);

	var userInformation = document.createElement('div');
	userInformation.className = 'user-information';

	var userChatImg = document.createElement('img');
	userChatImg.className = 'user-chat-img';
	userChatImg.src = userImg.src;

	var userChatName = document.createElement('div');
	userChatName.className = 'user-chat-name';
	userChatName.innerHTML = userName.textContent;
	userInformation.appendChild(userChatImg);
	userInformation.appendChild(userChatName);
	myMessageBox.appendChild(userInformation);

	chatContent.appendChild(myMessageBox);
	chatContent.scrollTop = chatContent.scrollHeight;

}

//生成本机的聊天气泡
function createOtherMessage(information)
{
	var otherMessageBox = document.createElement('div');
	otherMessageBox.className = 'other-message-box';
	otherMessageBox.id = information.id;

	var otherUserInformation = document.createElement('div');
	otherUserInformation.className = 'other-user-information';
	var userChatImg = document.createElement('img');
	userChatImg.className = 'user-chat-img';
	userChatImg.src = information.img;
	var userChatName = document.createElement('span');
	userChatName.className = 'user-chat-name';
	userChatName.innerHTML = information.username;
	otherUserInformation.appendChild(userChatImg);
	otherUserInformation.appendChild(userChatName);
	otherMessageBox.appendChild(otherUserInformation);

	var otherMessageArrow = document.createElement('div');
	otherMessageArrow.className = 'other-message-arrow';
	otherMessageBox.appendChild(otherMessageArrow);
	var otherMessageContent = document.createElement('div');
	otherMessageContent.className = 'other-message-content';
	
	var text = document.createElement('span');
	text.innerHTML = information.content;
	otherMessageContent.appendChild(text);
	otherMessageBox.appendChild(otherMessageContent);

	var otherMessageStatus = document.createElement('div');
	otherMessageStatus.className = 'other-message-status';
	var statusSpan = document.createElement('span');
	statusSpan.innerHTML = '已送达';
	otherMessageStatus.appendChild(statusSpan);
	otherMessageBox.appendChild(otherMessageStatus);

	chatContent.appendChild(otherMessageBox);
	chatContent.scrollTop = chatContent.scrollHeight;

}

//监听是否输入，返回用户名消息
/*websocket.on('typing', function(data){
	// 
	if(data.user != userName.textContent && data.flag == true){
		//修改对方正在打字中
		logOut.innerHTML = '对方打字中......';
	}else{
		//修改聊天室
		logOut.innerHTML = '聊天室';
	}
})*/

//添加聚焦，失焦事件
editBox.addEventListener('click', function(){
	// websocket.emit('typing', {flag : true, user : userName.textContent});
})

editBox.addEventListener('blur', function(){
	// websocket.emit('typing', {flag : false, user : userName.textContent});
})

//创建所有用户的下拉框
function createToggle(users)
{
	privateBox.options.length = 1;
	for(var user in users){
		if(user != userName.textContent){
			var option = document.createElement('option');
			option.value = users[user];
			option.innerHTML = users[user];
			privateBox.appendChild(option);
		}
	}
}

//连接之后更新所有未读消息为已读
function changeStatus(id)
{

	var div = document.getElementById(id);
	div.children[3].innerHTML = '<span>已读</span>';
	// socket.emit('changeStatus', {user : userName.textContent , id : id});
}

/*socket.on('changeStatus', function(data){
	if(data.user != userName.textContent){
		var div = document.getElementById(data.id);
		div.children[0].innerHTML = '<span>已读</span>';
	}
})*/

//发送私聊消息
function privateMessage()
{
	console.log('找你私聊');
}

//接受私聊消息
function privateGetMessage()
{
	console.log('好的');
}