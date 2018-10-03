$(document).ready(function() {
	$("#dialog").hide();
	$("td").dblclick(function(){
		//var rowClicked = $(this);
		var name=localStorage.getItem("userNameValue");
		alert(name);
		var targetUser = document.getElementById('subbu');
		//var random_room = Math.floor((Math.random() * 2) + 1);
		socket = socket_connect(name+'_'+targetUser.innerText);
		//alert(random_room);
		//$('#rowDialogDiv).text('In the dialog, show we clicked row:' + rowClicked.index());
		$('#dialog').dialog();
	});
    /* $(this).dblclick(function(){
		 $( "#dialog" ).dialog();
		 var random_room = Math.floor((Math.random() * 2) + 1);
		 socket = socket_connect(random_room);

	//socket.emit('chat message', 'hello room #'+random_room);
	  });*/
		
  });
 var socket_connect = function (room) {
			return io('localhost:4000', {
			query: 'r_var='+room
			});
}