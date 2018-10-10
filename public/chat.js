	 //var handle='';
	 var clickedCell='';
	 var clickedRoom='';
	 
	 $(document).ready(function(){
	  var socket1;
	 $("#mainchatplaceholder").hide();
	  var message = document.getElementById('message'),
      btn = document.getElementById('send'),
      output2 = document.getElementById('output'),
      feedback2 = document.getElementById('feedback');
	  var userfinal='';
	$.get("/loadData", function(data,status){
		var obj = $.parseJSON(data);
		var table=document.getElementById('roomsTable');
		$('#loggedInUser').text(obj.userName);	
		$('#loggedInUser').val(obj.userName);
		//alert("logged.." + $('#loggedInUser').val());
		userfinal=obj.userName;		
		$('#welcomeMessage').text('Welcome '+ obj.userName);
		 socket1 = io.connect('http://localhost:4000?currentUser='+obj.userName,{
				upgrade: false, transports: ['websocket']});
		
		 socket1.on('one-one chat', function(data){
		   alert('on it');
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
				'</div><input id="message" class="msgclass" type="text" placeholder="Message" /><button id="send" onclick="emitMessage()">Send</button>';
				div.innerHTML=html1;				
				divplaceholder.appendChild(div);			
				$('#'+divId).dialog();	
			}
		 });
		socket1.on('main chat', function(data,userid){
		   // alert('grabbing it on client');
			//var identifiedRoom=data.handle + ' .msgclass';
			//alert('appended msg '+identifiedRoom);
			var user = userid;
			console.log("WHO PINGED "+ user);
			var outputelement=document.getElementById(data.handle+'_chat-window');//document.getElementById(data.handle);// .mainoutput");
			block_to_insert = document.createElement( 'div' );
			block_to_insert.innerHTML = user+":"+data.message ;
			outputelement.appendChild(block_to_insert);		
			//outputelement.innerHTML = '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
			
		});
		socket1.on('availableUsers', function(data){
		   // alert('grabbing it on client - available users');	
		   var table = document.getElementById('usersTable');
		   $("#usersTable tr").remove();
		   var obj=jQuery.parseJSON(data);		   
		   for(var i in obj){
				//alert("socketid " + obj[i].socketid);
				var tr=document.createElement('tr');
				tr.innerHTML = '<td '+'id='+obj[i].userid+ '>' + obj[i].userid + '</td>';
				table.appendChild(tr);
		   }
			
			/*$.each(obj.users,function(data){
				var tr=document.createElement('tr');
				tr.innerHTML = '<td '+'id='+obj.users.userId+ '>' + obj.users.userName + '</td>';
				table.appendChild(tr);
			});	*/	
		});
		
		
		//alert(localStorage.getItem('socket'));
		// $('#usersTable').on( 'click', 'tr', function (e) {
		emitMessage = function(clickedid) {
            //alert('hello..'+clickedid.substr(4));
			var typedmsg=clickedid.substr(4) + ' .msgclass';
			//alert('appended msg '+typedmsg);
			//alert('dummyy..'+ $("#Devops .msgclass").val());
     		//alert("typed msg.. " + $("#"+typedmsg).val());
				//var message = document.getElementById('message');
				/*btn = document.getElementById('send'),
				output2 = document.getElementById('output'),
				//loggedInUser = document.getElementById('loggedInUser'),
				feedback2 = document.getElementById('feedback');
			//alert(message.value);
			//alert(document.getElementById('loggedInUser').value);
			//alert(logedInUser.value);*/			
			socket1.emit('main chat', {
							message: $("#"+typedmsg).val(),
							handle: clickedid.substr(4)							
				})
		}

		$.each(obj.roomsList,function(key,value){
			var tr=document.createElement('tr');
			tr.innerHTML = '<td>' + value.value + '</td>';
			table.appendChild(tr);
			var div=document.createElement('div');
			var mainchatplaceholder= document.getElementById('mainchatplaceholder');
			//alert(clickedRoom.text());
			var divId=value.value;
			div.setAttribute("id", divId);
			div.innerHTML = '<p>' +'hi....' + '</p>';
			var divv=divId+'_chat-window';
			var html1=' <div id='+divv+' class="chat-window"><div id="output" class="mainoutput"></div><div id="feedback"></div>'+
			'</div><input id="message" type="text" class="msgclass" placeholder="Message" />';
			var button1=document.createElement('button');
			button1.setAttribute("id","btn_"+divId);
			button1.setAttribute("onclick","emitMessage(this.id);");
			var t = document.createTextNode("Send Message");
			button1.appendChild(t);			
			div.innerHTML=html1;
			div.appendChild(button1);			
			mainchatplaceholder.appendChild(div);	
		});
		//var table = document.getElementById('usersTable');
		/*$.each(obj.users,function(key,value){
			var tr=document.createElement('tr');
			tr.innerHTML = '<td '+'id='+value.userId+ '>' + value.userName + '</td>';
			table.appendChild(tr);
		});*/
		/*var table2 = document.getElementById('roomMembersTable');
		$.each(obj.roomsList,function(key,value){
			var tr=document.createElement('tr');
			tr.innerHTML = '<td>' + value.value + '</td>';
			table2.appendChild(tr);
		});		*/
	});
	//alert('hi');
	
		//localStorage.setItem('socket',socket);
		//socket1  = localStorage.getItem('socket');
		//alert("socket.." +socket1);
        //var socket = io.connect('http://localhost:4000?currentUser='+cat);
		
		
	
	 $("#usersTable").mouseover(function(e) {
		$(this).css("cursor", "pointer");
	 });
	 $("#roomsTable").mouseover(function(e) {
		$(this).css("cursor", "pointer");
	 });
	 $('#usersTable').on( 'click', 'tr', function (e) {
	  //$("#usersTable tr").click(function(e) {
		 // alert('hi');
		$("#usersTable td").removeClass("highlight");
		clickedCell= $(e.target).closest("td");
		clickedCell.addClass("highlight");
	    //alert($('#clickedCell').attr("id"));// + 'fdfdd' + clickedCell.value);
            	var div=document.createElement('div');
				var divplaceholder= document.getElementById('dialogplaceholder');
				//alert(clickedCell.text());
				var divId=$('#loggedInUser').val()+'_'+ clickedCell.text();
				div.setAttribute("id", divId);
				div.innerHTML = '<p>' +'hi....' + '</p>';
				var html1=' <p></p><div class="chat-window"><div id="output"></div><div id="feedback"></div>'+
				'<input id="message" type="text" placeholder="Message" />'+
				'<button id="send" onclick="emitMessage()">Send</button></div>';
				div.innerHTML=html1;				
				divplaceholder.appendChild(div);
				//$('#'+divId).dialog();
				$('#'+divId).dialog(
				  {
					width: 600,
					height: 400					
				  });				
                //$('#'+divId).dialog();				
              //  return false;
            }
        );
		
		$('#roomsTable').on( 'click', 'tr', function (e) {
		 // alert('hi');
		//$("#usersTable td").removeClass("highlight");
			clickedRoom= $(e.target).closest("td");
			$("#roomsTable td").removeClass("highlight");
			clickedRoom.addClass("highlight");
			//alert($('#clickedCell').attr("id"));// + 'fdfdd' + clickedCell.value);
			//$("#mainchatplaceholder").show();
			//$("#mainchatplaceholder div:visible").hide();
			var roomDiv=clickedRoom.text();
			$("#mainchatplaceholder").show();
			
			$("#mainchatplaceholder div:visible").hide();
			$("#"+roomDiv).show();
		
			var roomDiv1=clickedRoom.text()+" div:hidden";
			//alert(roomDiv1);		
			$("#"+roomDiv1).show();
			//$("#Agile div:hidden").show(); 			
        });
	});
	