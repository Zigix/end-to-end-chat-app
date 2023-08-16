'use strict';

var messageInput = document.querySelector('#message-input');
var messageList = document.querySelector('#message-list');
var activeUsersList = document.querySelector('.active-users-list');
var privateUsersList = document.querySelector('.private-users-list');
var btnSend = document.querySelector('#button-send');
var messageArea = document.querySelector('.message-area');

var activeUElement = document.querySelector('#activeU');
var privateUElement = document.querySelector('#privateU');

var username = null;
var stompClient = null;

var privateMessageQueue = new MessageList();
var publicMessageQueue = new MessageList();

/**/
var privateMessageUsers = [];
var currentChannel = '@$public$@';
var chatTitleElement = document.querySelector('.chat-title');
/**/

var allReminders = [];

var backToPublicButtonElement = document.querySelector('#public-chat-btn');

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];


// enter event listener for send message button
messageInput.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        btnSend.click();
    }
});

function connect() {
    username = document.getElementById('name').value.trim();

    console.log(username);

    if(username) {
        var socket = new SockJS('/chat');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected);
    }
}

function onConnected() {
    stompClient.subscribe('/topic/public', onPublicMessageReceived);
    stompClient.subscribe('/topic/private/' + username, onPrivateMessageReceived);

    var joinMessage = JSON.stringify({
        sender: username,
        channel: '@$public$@',
        type: 'JOIN'
    });

    stompClient.send('/app/chat.register', {}, joinMessage);
}

function sendMessage() {
    var messageContent = messageInput.value.trim();

    if(messageContent && stompClient) {
        var chatMessage = JSON.stringify({
            sender: username,
            channel: currentChannel,
            content: messageContent,
            type: 'CHAT'
        });
    }

    if(currentChannel === '@$public$@') {
        stompClient.send('/app/chat.send', {}, chatMessage);
    }
    else {
        stompClient.send('/app/chat/' + currentChannel, {}, chatMessage);

        var parsedMessage = JSON.parse(chatMessage);
        privateMessageQueue.add(parsedMessage);
        updatePrivateUsers(currentChannel);

        messageList.appendChild(getChatMessageElement(parsedMessage));
    }

    messageInput.value = '';
    scrollDown(messageArea);
}

function onPublicMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    if(message.type === 'UPDATE') {
        updateActive(message);
    }
    else {
        publicMessageQueue.add(message);
        if(currentChannel === '@$public$@') {
            var messageElement = getChatMessageElement(message);
            messageList.appendChild(messageElement);
        }
    }

    scrollDown(messageArea);
    console.log(publicMessageQueue);
}

function onPrivateMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    message.channel = message.sender;

    privateMessageQueue.add(message);
    updatePrivateUsers(message.sender);

    if(message.channel === currentChannel) {
        var msgElement = getChatMessageElement(message);
        messageList.appendChild(msgElement);
    }
    else {
        if(!allReminders.includes(message.sender)) {
            allReminders.push(message.sender);
        }
        createReminderOnUserElement(allReminders);
    }

    scrollDown(messageArea);
}

function getAvatarColor(name) {
    var index = hashCode(name) % 8;
    return colors[index];
}

function hashCode(str) {
    var hash = 0, i, chr;
    for (i = 0; i < str.length; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function activeUserOnClick(name) {
    console.log('Clicked username: ' + name);

    if((currentChannel !== name) && (name !== username)) {
        chatTitleElement.innerHTML = 'To: ' + name;

        var privateMessages = privateMessageQueue.filterByChannel(name);
        messageList.innerHTML = '';
        for (let x of privateMessages) {
            messageList.appendChild(getChatMessageElement(x));
        }
        currentChannel = name;
        backToPublicButtonElement.classList.replace('hidden', 'visible');

        if(allReminders.includes(currentChannel)) {
            var index = allReminders.indexOf(currentChannel);
            allReminders.splice(index, 1);
            removeReminderFromUserElement(currentChannel);
        }
    }
    scrollDown(messageArea);
}

function updatePrivateUsers(name) {
    console.log(privateMessageUsers)
    var exists = privateMessageUsers.includes(name);

    if(!exists) {
        privateMessageUsers.push(name);
        console.log(privateMessageUsers);
        var privateUsersElements = getUsersElements(privateMessageUsers);

        privateUsersList.innerHTML = '';

        for(let user of privateUsersElements) {
            privateUsersList.appendChild(user);
        }
    }
}

function getChatMessageElement(message) {
    var messageElement = document.createElement('li');

    if (message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' has joined!';
    }
    else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' has left!';
    }
    else if (message.type === 'CHAT') {
        messageElement.classList.add('user-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var userElement = document.createElement('span');
        var userNameText = document.createTextNode(message.sender);
        userElement.appendChild(userNameText);

        messageElement.appendChild(userElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);
    messageElement.appendChild(textElement);

    return messageElement;
}

function getUsersElements(usersList) {
    var updateUsersElements = [];
    for(let user of usersList) {
        var userElement = document.createElement('li');
        var userAvatarElement = document.createElement('i');
        var usernameElement = document.createElement('span');
        var reminderElement = document.createElement('div');
        var fontelloElement = document.createElement('i');

        userAvatarElement.classList.add('avatar');
        reminderElement.classList.add('hidden');
        fontelloElement.classList.add('icon-mail-circled');

        reminderElement.appendChild(fontelloElement);

        var userAvatarText = document.createTextNode(user.charAt(0));
        userAvatarElement.appendChild(userAvatarText);
        userAvatarElement.style['background'] = getAvatarColor(user);

        var usernameText = document.createTextNode(user);
        usernameElement.appendChild(usernameText);

        userElement.appendChild(userAvatarElement);
        userElement.appendChild(usernameElement);
        userElement.appendChild(reminderElement);

        userElement.onclick = function () {activeUserOnClick(user)}

        updateUsersElements.push(userElement);
    }

    return updateUsersElements;
}

function updateActive(message) {
    activeUsersList.innerHTML = '';
    var activeUsersElements = getUsersElements(message.activeUsers);
    for(let user of activeUsersElements) {
        activeUsersList.appendChild(user);
    }
}

function backToPublicChat() {
    if(currentChannel !== '@$public$@') {
        currentChannel = '@$public$@';
        chatTitleElement.innerHTML = 'Public Chat';
        messageList.innerHTML = '';

        var publicMessages = publicMessageQueue.getAllMessages();

        for(let msg of publicMessages) {
            messageList.appendChild(getChatMessageElement(msg));
        }

        backToPublicButtonElement.classList.replace('visible', 'hidden');
    }
    scrollDown(messageArea);
}

function createReminderOnUserElement(nameList) {
    for(let name of nameList) {
        for (let singleLiElement of privateUsersList.children) {
            if (singleLiElement.querySelector('span').innerHTML === name) {
                var x = singleLiElement.querySelector('div');
                x.classList.replace('hidden', 'new-message-reminder');
                var y = singleLiElement.querySelector('.avatar');
                y.style.border = '2px solid #FFD700';
                y.style.boxShadow = '0 0 5px 2px #FFD700';

                break;
            }
        }
    }
}

function removeReminderFromUserElement(name) {
    for (let singleLiElement of privateUsersList.children) {
        if (singleLiElement.querySelector('span').innerHTML === name) {
            var x = singleLiElement.querySelector('div');
            x.classList.replace('new-message-reminder', 'hidden');
            var y = singleLiElement.querySelector('.avatar');
            y.style.border = 'none';
            y.style.boxShadow = 'none';

            break;
        }
    }
}

function scrollDown(element) {
    element.scrollTop = element.scrollHeight;
}