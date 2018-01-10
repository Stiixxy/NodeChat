var socket = io();

function enterPressed(event){
    if(event.keycode == 13 || event.which == 13){
        var textBox = document.getElementById('messageBox');
        var messageText = textBox.value.trim();
        if(messageText.length > 0){
            //Send the message to the server and clear textbox
            socket.emit("sendMessage", messageText);
            textBox.value = "";

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
}

socket.on('receivedMessage', function(message){
    //message from somone else
    addMessage(message, "theirMessage")
});