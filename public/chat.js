var message = document.getElementById('message'),
      btn = document.getElementById('send'),
      output2 = document.getElementById('output'),
      feedback2 = document.getElementById('feedback');
	  loggedInUser = document.getElementById('loggedInUser');
	  handle=loggedInUser;
$(document).ready(function(){
	  var message = document.getElementById('message'),
      handle1 = document.getElementById('loggedInUser'),
      btn = document.getElementById('send'),
      output2 = document.getElementById('output'),
      feedback2 = document.getElementById('feedback');
	 
	$.get("/loadData", function(data,status){
		var obj = $.parseJSON(data);
		var table=document.getElementById('roomsTable');
		$('#loggedInUser').text(obj.userName);
		$('#welcomeMessage').text('Welcome '+ obj.userName);
		
		$.each(obj.roomsList,function(key,value){
			var tr=document.createElement('tr');
			tr.innerHTML = '<td>' + value.value + '</td>';
			table.appendChild(tr);
		});
		var table = document.getElementById('usersTable');
		$.each(obj.users,function(key,value){
			var tr=document.createElement('tr');
			tr.innerHTML = '<td class="highlight"'+'id='+value.userId+ '>' + value.userName + '</td>';
			table.appendChild(tr);
		});
		var table2 = document.getElementById('roomMembersTable');
		$.each(obj.roomsList,function(key,value){
			var tr=document.createElement('tr');
			tr.innerHTML = '<td>' + value.value + '</td>';
			table2.appendChild(tr);
		});		
	});
	 $("#usersTable td").mouseover(function(e) {
		 alert('hi');
		$(this).css("cursor", "pointer");
	});
	  $("td").click(function(e) {
		  alert('hi');
		$("#usersTable td").removeClass("highlight");
		var clickedCell= $(e.target).closest("td");
		clickedCell.addClass("highlight");
	    alert($('#clickedCell').attr("id"));// + 'fdfdd' + clickedCell.value);
            
				
				var div=document.createElement('div');
				var divplaceholder= document.getElementById('dialogplaceholder');
				var divId='rohit';
				div.setAttribute("id", divId);
				div.innerHTML = '<p>' +'hi....' + '</p>';
				var html1=' <p id="loggedInUser"></p><p>Chat</p><div id="chat-window"><div id="output"></div><div id="feedback"></div>'+
				'</div><input id="message" type="text" placeholder="Message" /><button id="send">Send</button>';
				div.innerHTML=html1;				
				divplaceholder.appendChild(div);			
                $("#rohit").dialog();				
              //  return false;
            }
        );
	$("#send").click(
		function () {
				socket.emit('one-one chat', {
					message: message.value,
					handle: 'subbu',
					room_name:'subbu'
				});
		message.value = "";
		}
  );
    
});	
// Make connection
var socket = io.connect('http://localhost:4000');

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


// Listen for events
/*socket.to(1).on('chat', function(data){
	alert('hi');
    feedback.innerHTML = "";
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});
*/



socket.on('one-one chat', function(data){
	//alert('hi2');
	var feedback2 = document.getElementById('feedback');
	 output2 = document.getElementById('output'),
    feedback2.innerHTML = "";
    output2.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
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


message.addEventListener('keypress', function(){
    socket.emit('typing', handle);
})