var socket = io();

function enterPressed(event){
    if(event.keycode == 13 || event.which == 13){
        var textBox = document.getElementById('messageBox');
        var messageText = textBox.value.trim();
        if(messageText.length > 0){
            //Send the message to the server and clear textbox
            socket.emit("sendMessage", messageText);
            textBox.value = "";

            if(messageText.startsWith("/")){
                messageText = messageText.substring(1);
                sendCommand(messageText);
                return;
            }

            //Add our own message to the box
            addMessage(messageText, "ourMessage");
        }
    }
}

function addMessage(message, whos){
    var chatItem = document.createElement('div');
    chatItem.classList.add('message');                    
    chatItem.classList.add(whos);
    chatItem.innerHTML=message;
    document.getElementById('chatBox').appendChild(chatItem);
    return chatItem;
}

function sendCommand(message){
    var array = message.split(" ");
    socket.emit(array[0], array);
}

function showTemp(message, time){
    var chatItem = addMessage(message, "messageTemp");
    
    setTimeout(function(){
        document.getElementById('chatBox').removeChild(chatItem);
    }, time);
}

socket.on('receivedMessage', function(message){
    //message from somone else
    addMessage(message, "theirMessage")
});

socket.on('showTemp', function(message, time){
    showTemp(message, time);
});