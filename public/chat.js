
	 var clickedCell='';
	 var clickedRoom='';
	 
	 $(document).ready(function(){
	  var socket1;
	 $("#mainchatplaceholder").hide();
	 $("#availableUsersMsgDiv").hide();
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
	
		userfinal=obj.userName;		
		$('#welcomeMessage').text(' '+ obj.userName);
		$('#welcomeMessage').addClass("welcomeuser");
		 $('#welcomeMessage').prepend('<img id="theImg" src='+obj.profilepic+'>')
		 //<img src="<%= obj.thumbnail %>" />

		 socket1 = io.connect('http://localhost:4000?currentUser='+obj.userName,{
				upgrade: false, transports: ['websocket']});
		
		 socket1.on('one-one chat', function(data,userwhopinged){
		    var outputelement=document.getElementById(data.handle+'_chat-window');
			if(outputelement){
				
				block_to_insert = document.createElement( 'div' );
				block_to_insert.innerHTML = userwhopinged+":"+data.message ;
				outputelement.appendChild(block_to_insert);				
			}
			else{
	
				var div=document.createElement('div');
				var divplaceholder= document.getElementById('dialogplaceholder');
		
				var divId=data.handle;
				
				var div=document.createElement('div');
				div.setAttribute("title",userwhopinged);
				div.setAttribute("id", divId);
				//div.innerHTML = '<p>' +'hi....' + '</p>';
				var divv=divId+'_chat-window';
				var html1=' <div id='+divv+' class="chat-window"><div id="output" class="mainoutput"></div><div id="feedback"></div>'+
				'</div><input id="message" type="text" class="msgclass" placeholder="Message" />';
				var button1=document.createElement('button');
				button1.setAttribute("id","btn_"+divId);
				button1.setAttribute("onclick","emitPrivateMessage(this.id,$('#loggedInUser').val(),$('#loggedInUser'));");
				var t = document.createTextNode("Send Message");
				button1.appendChild(t);			
				div.innerHTML=html1;
				div.appendChild(button1);			
				divplaceholder.appendChild(div);
				block_to_insert = document.createElement( 'div' );
				block_to_insert.innerHTML = userwhopinged+":"+data.message ;
				document.getElementById(data.handle+'_chat-window').appendChild(block_to_insert);								
			
				$('#'+divId).dialog();
			}
		 });
		socket1.on('main chat', function(data,userid){

			var user = userid;
			console.log("WHO PINGED "+ user);
			var outputelement=document.getElementById(data.handle+'_chat-window');//document.getElementById(data.handle);// .mainoutput");
			block_to_insert = document.createElement( 'div' );
			block_to_insert.innerHTML = user+":"+data.message ;
			outputelement.appendChild(block_to_insert);		
				
		});
		socket1.on('availableUsers', function(data){
	
		   var table = document.getElementById('usersTable');
		   var currentuser = $('#loggedInUser').val();
		   $("#usersTable tr").remove();
		   var obj=jQuery.parseJSON(data);
		   if(obj.length>1){
			   $("#waitingmsg").hide();
			   $("#availableUsersMsgDiv").show();			   
		   }
		   else{
			   $("#waitingmsg").show();
			   $("#availableUsersMsgDiv").hide();			   
		   }
		   for(var i in obj){
				//alert("socketid " + obj[i].socketid);
				var tr=document.createElement('tr');
				if(! (obj[i].userid == currentuser))
				tr.innerHTML = '<td '+'id='+obj[i].userid+ '>' + obj[i].userid + '</td>';
				table.appendChild(tr);
		   }
	
		});
		
		emitPrivateMessage = function(clickedid,targetUser,cellselected) {
 
			var typedmsg=clickedid.substr(4) + ' .msgclass';
			cellselected.text ="";
		
			socket1.emit('one-one chat', {
							message: $("#"+typedmsg).val(),
							handle: clickedid.substr(4),
							targetUser : targetUser
				})

				$(".msgclass").val("");	}

		emitMessage = function(clickedid) {
    
			var typedmsg=clickedid.substr(4) + ' .msgclass';
		
			socket1.emit('main chat', {
							message: $("#"+typedmsg).val(),
							handle: clickedid.substr(4)							
				})
				$(".msgclass").val("");	
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

	});
	
	
	 $("#usersTable").mouseover(function(e) {
		$(this).css("cursor", "pointer");
	 });
	 $("#roomsTable").mouseover(function(e) {
		$(this).css("cursor", "pointer");
	 });
	 $('#usersTable').on( 'click', 'tr', function (e) {
	  
		$("#usersTable td").removeClass("highlight");
		clickedCell= $(e.target).closest("td");
		clickedCell.addClass("highlight");
	    
            	var div=document.createElement('div');
				var divplaceholder= document.getElementById('dialogplaceholder');
				var divId=$('#loggedInUser').val()+'_'+ clickedCell.text();				
				var div=document.createElement('div');	
				div.setAttribute("title",clickedCell.text());
				div.setAttribute("id", divId);
				div.innerHTML = '<p>' +'hi....' + '</p>';
				var divv=divId+'_chat-window';
				var html1=' <div id='+divv+' class="chat-window"><div id="output" class="mainoutput"></div><div id="feedback"></div>'+
				'</div><input id="message" type="text" class="msgclass" placeholder="Message" />';
				var button1=document.createElement('button');
				button1.setAttribute("id","btn_"+divId);
				button1.setAttribute("onclick","emitPrivateMessage(this.id,clickedCell.text(),clickedCell);");
				var t = document.createTextNode("Send Message");
				button1.appendChild(t);			
				div.innerHTML=html1;
				div.appendChild(button1);			
				divplaceholder.appendChild(div);	
			
				$('#'+divId).dialog();				
            
            }
        );
		
		$('#roomsTable').on( 'click', 'tr', function (e) {
		
			clickedRoom= $(e.target).closest("td");
			$("#roomsTable td").removeClass("highlight");
			clickedRoom.addClass("highlight");
			var roomDiv=clickedRoom.text();
			$("#mainchatplaceholder").show();
			
			$("#mainchatplaceholder div:visible").hide();
			$("#"+roomDiv).show();
		
			var roomDiv1=clickedRoom.text()+" div:hidden";
				
			$("#"+roomDiv1).show();
						
        });
	});
	