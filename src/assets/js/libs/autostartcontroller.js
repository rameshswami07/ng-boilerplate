var isAutoConnect = false,
    socketController,
    userId,
    roomName;

function connectToSocket() {
    'use strict';
    var hostName = window.location.hostname,
        port,
        roomSetup,
        connectURL;

    userId = makeid(10);
    roomName = window.location.hostname;
    port = (hostName !== '0.0.0.0' && hostName !== 'localhost') ? '80' : '8081';
    connectURL = 'http://' + roomName + ':' + port;

    roomSetup = {
        roomName : roomName,
        subscriptions : {
            RoomInfoVO : true
        }
    };

    socketController = new SocketController({
        connectURL : connectURL,
        roomSetup : roomSetup,
        userConnectedCallBackFunction : userConnectedCallBackFunction,
        userRegisteredCallBackFunction : userRegisteredCallBackFunction,
        numOfUsersInARoomCallBackFunction : numOfUsersInARoomCallBackFunction,
        stateChangeCallBackFunction : stateChangeCallBackFunction,
        debugMode : true
    });

    socketController.connectToSocket();
}

function stateChangeCallBackFunction(data) {
    'use strict';
    // impl
}

function userConnectedCallBackFunction() {
    'use strict';
    if (isAutoConnect) {
        socketController.registerUser(userId);
    }
}

function userRegisteredCallBackFunction() {
    'use strict';
    socketController.getNumberOfRegisteredUsersInRoom(userId);

    $(function() {
        applicationConnectedReady();
    });
}

function numOfUsersInARoomCallBackFunction(data) {
    'use strict';
    var numofppl = data.size;
    document.getElementById('visitors').innerHTML = '<div style="font-size: 15px; top: 5px">Currently there are <b>'+numofppl+'</b> visitors on this page</div>';

    if (data.hasOwnProperty('register')) {
        console.log('register userId: ' + data.register);
    } else if (data.hasOwnProperty('disconnect')) {
        console.log('disconnect userId: ' + data.disconnect);
    }
}

function messageFromRoomCallBackfunction(data) {
    'use strict';
    console.log('messageFromRoomCallBackfunction');
    console.log(JSON.stringify(data.vo));
}

function messageFromRoomCallBackfunction2(data) {
    'use strict';
    console.log('messageFromRoomCallBackfunction2');
    console.log(JSON.stringify(data.vo));
}

$(document).ready(function () {
    'use strict';
    connectUser();
});

function connectUser() {
    'use strict';
    isAutoConnect = true;
    connectToSocket();
}

function makeid(numOfChar) {
    'use strict';
    var text = "",
        possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        i;

    for(i = 0; i < numOfChar; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

function serviceCall(serviceMethodName, retCallBackName, params) {
    'use strict';
    console.log('Calling: ' + serviceMethodName);
    socketController.callDbConnector(userId, serviceMethodName, retCallBackName, params);
}