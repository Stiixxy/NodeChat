var socket = io();

var chatBox;
var messageBox;

$( document ).ready(function() {
    chatBox = document.getElementById('chatBox');
    messageBox = document.getElementById('messageBox');
});

function enterPressed(event){
    if(event.keycode == 13 || event.which == 13){
        var messageText = messageBox.value.trim();
        messageBox.value = "";
        if(messageText.length > 0){
            //Check if it is a command, if so send it
            if(messageText.startsWith("/")){
                messageText = messageText.substring(1);
                sendCommand(messageText);
                return;
            }

            //Send the message to the server and clear textbox
            socket.emit("sendMessage", messageText);
        }
    }
}

function addMessage(message, whos){
    var chatItem = document.createElement('div');
    chatItem.classList.add('message');                    
    chatItem.classList.add(whos);
    chatItem.innerHTML=message;
    chatBox.appendChild(chatItem);
    return chatItem;
}

function sendCommand(message){
    var array = message.split(" ");
    socket.emit(array[0], array);
}

function showTemp(message, time){
    var chatItem = document.createElement('div');
    chatItem.classList.add('message');                    
    chatItem.classList.add("messageTemp");
    chatItem.innerHTML=message;
    insertAfter(chatItem, chatBox);

    setTimeout(function(){
        document.body.removeChild(chatItem);
    }, time);
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

socket.on('receivedMessage', function(message){
    //message from somone else
    addMessage(message, "theirMessage")
});

socket.on('showTemp', function(message, time){
    showTemp(message, time);
});

socket.on('ownMessage', function(message){
   	//Add our own message to the box
    addMessage(message, "ourMessage");
});

socket.on('clear', function(){
    while (chatBox.firstChild) {
        chatBox.removeChild(chatBox.firstChild);
    }
});