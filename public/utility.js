/*	//var user1=$('#loggedInUser').val();
	$(document).ready(function(){
		var socket1 = io.connect('http://localhost:4000?currentUser=aaa');
		//localStorage.setItem('socket',socket);
		//socket1  = localStorage.getItem('socket');
		//alert("socket.." +socket1);
        //var socket = io.connect('http://localhost:4000?currentUser='+cat);
		
		socket1.on('one-one chat', function(data){
		//alert('hi');
			if(document.getElementById(data.handle + '_'+ data.targetUser)){
			feedback.innerHTML = "";
			output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
			}
			else{
				feedback.innerHTML = "";
				output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
				var div=document.createElement('div');
				var divplaceholder= document.getElementById('dialogplaceholder');
				var divId=data.handle+'_'+ data.targetUser;
				div.setAttribute("id", divId);
				div.innerHTML = '<p>' +'hi....' + '</p>';
				var html1=' <div class="chat-window"><div id="output"></div><div id="feedback"></div>'+
				'</div><input id="message" type="text" placeholder="Message" /><button id="send" onclick="emitMessage()">Send</button>';
				div.innerHTML=html1;				
				divplaceholder.appendChild(div);			
				$('#'+divId).dialog();	
			}
    
		});

	function emitMessage(){
		var message = document.getElementById('message'),
        //btn = document.getElementById('send'),
        output2 = document.getElementById('output'),
		//loggedInUser = document.getElementById('loggedInUser'),
        feedback2 = document.getElementById('feedback');
	//alert(message.value);
	//alert(document.getElementById('loggedInUser').value);
	//alert(logedInUser.value);
	
		socket1.emit('one-one chat', {
					message: message.value,
					handle: document.getElementById('loggedInUser').value,
					targetUser:clickedCell.text()
		})
	}

	socket1.on('one-one chat', function(data){
		//alert('hi2');
		var feedback2 = document.getElementById('feedback');
		 output2 = document.getElementById('output'),
		feedback2.innerHTML = "";
		output2.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
	});

	socket1.on('typing', function(data){
		feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
	});

	});
// Make connection

//var socket = io.connect('http://localhost:4000', { query:"currentUser="+ document.getElementById('loggedInUser').value});

// Query DOM
/*ar message = document.getElementById('message1'),
      handle = document.getElementById('handle1'),
      btn = document.getElementById('send1'),
      output = document.getElementById('output1'),
      feedback = document.getElementById('feedback1');

// Emit events
btn.addEventListener('click', function(){
	var random_room = Math.floor((Math.random() * 2) + 1);
	//var socket      = socket_connect(random_room);

	//socket.emit('chat message', 'hello room #'+1);
    socket.emit('chat', {
        message: message.value,
        handle: handle.value,
		room_no:"1"
    });
    message.value = "";
});

message.addEventListener('keypress', function(){
    socket.emit('typing', handle.value);
})*/

//var socket_connect = function (room) {
  //  return io('localhost:3000', {
    //    query: 'r_var='+room
    //});
//}





// Emit events

/*btn.addEventListener('click', function(){
	//var random_room = Math.floor((Math.random() * 2) + 1);
	//var socket      = socket_connect(random_room);

	//socket.emit('one-one chat', 'hello room #'+2);
    socket.emit('one-one chat', {
        message: message.value,
        handle: handle.value,
		room_name:loggedInUser.value
    });
    message.value = "";
});*/

/*
message.addEventListener('keypress', function(){
    socket.emit('typing', handle);
})*/