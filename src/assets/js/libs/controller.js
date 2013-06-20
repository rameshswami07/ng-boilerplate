var isOffline = false; // true | false
var isAutoConnect = false;
var socketController;
var cursors = new Object();
var clientVO;
var isDragging = true;
var userId = makeid(10);
var roomName = roomName = window.location.hostname;
var topPositionVideoStart = 50; // 50 | 480 on blog

function listenToUserActions() {

    $("#numOfRegisteredUsersButton").bind('click', function() {
            socketController.getNumberOfRegisteredUsersInRoom(userId);
        }
    );

    $("#grabAllPodsButton").bind('click', function() {
            var i = -1;
            var dropDivPosition = $(".well").position();
            for (var user in cursors) {
                clientVO = new ClientVO(user, dropDivPosition.left + (++i * 150), topPositionVideoStart, '');
                console.log('grabAllPodsButton: ' + clientVO);
                draggingUserPod(clientVO,user);
            }
        }
    );

    $(".well").bind('click', function() {
        isDragging = !isDragging;
    });
}

function acceptWebCam() {
    console.log('acceptWebCam');
    $('#userDraggableContainer'+userId).draggable();
    $('#userDraggableContainer'+userId).stop();
    listnToEventMouseMoveEvent();
}

function listnToEventMouseMoveEvent() {
    $(document).mousemove( function(event) {
        var comment = cursors.hasOwnProperty(userId) ? $('.comment'+userId).val() : '';
        clientVO = new ClientVO(userId, event.pageX, event.pageY, comment);

        if (!cursors.hasOwnProperty(userId)) {
            cursors[userId] = true;

            // add own component
            $('body').append('<textarea class="comment'+userId+'" type="text" size="10" value="'+clientVO.clientId+'" style="position: absolute;">');

            $('.comment'+userId).bind('keyup', function() {
                clientVO.comment = $('.comment'+userId).val();
                socketController.storeState(clientVO,'ClientVO', userId);
            });

            $('.comment'+userId).focus();
        }

        if (isDragging)
            draggingUserPod(clientVO,userId);

        socketController.storeState(clientVO,'ClientVO', clientVO.clientId);
    });

    $('body').keydown(function() {
        $('.comment'+userId).focus();
    });
}

function draggingUserPod(clientVO,userId) {
    $('.comment'+userId).css('top',(clientVO.mouseY)+'px');
    $('.comment'+userId).css('left',(clientVO.mouseX+30)+'px');
    $('#userDraggableContainer'+userId).css('top',(clientVO.mouseY+50)+'px');
    $('#userDraggableContainer'+userId).css('left',(clientVO.mouseX+40)+'px');
}

function connectToSocket() {
    var hostName = window.location.hostname;
    var port = (hostName != '0.0.0.0' && hostName != 'localhost') ? '80' : '8081';
    var connectURL = 'http://'+window.location.hostname+':'+port;

    var roomSetup = new Object();
    roomSetup.roomName = roomName;
    roomSetup.subscriptions = new Object();
    roomSetup.subscriptions['RoomInfoVO'] = true;
    roomSetup.subscriptions['ClientVO'] = true;

    socketController = new SocketController(connectURL,roomSetup,userConnectedCallBackFunction,userRegisteredCallBackFunction,
        messageFromRoomCallBackfunction,numOfUsersInARoomCallBackFunction,stateChangeCallBackFunction, true);
    socketController.connectToSocket();
}

function userConnectedCallBackFunction() {
    if (isAutoConnect)
        socketController.registerUser(userId);
}

function userRegisteredCallBackFunction() {
    socketController.getNumberOfRegisteredUsersInRoom(userId);
}

function numOfUsersInARoomCallBackFunction(data) {
    var numofppl = data.size;
    document.getElementById('visitors').innerHTML = '<div style="font-size: 15px; top: 5px">Currently there are <b>'+numofppl+'</b> visitors on this page</div>';

    if (data.hasOwnProperty('register')) {
        console.log('register userId: ' + data.register);
    } else if (data.hasOwnProperty('disconnect')) {
        console.log('disconnect userId: ' + data.disconnect);
    }
}

function stateChangeCallBackFunction(data) {
    var cursorId = 'cursor'+data.clientId;
    if (!cursors.hasOwnProperty(cursorId)) {
        cursors[cursorId] = true;
        $('body').append('<div class="'+cursorId+'" style="background-color: red; width: 5px; height: 5px; position: absolute;"></div>​');
        $('body').append('<div class="comment'+cursorId+'" id="comment'+cursorId+'" style="position: absolute;"></div>');
        addVideoPlayer(data.clientId,true);
    }

    $('.'+cursorId).css('top',(data.mouseY)+'px');
    $('.'+cursorId).css('left',(data.mouseX)+'px');

    $('.comment'+cursorId).css('top',(data.mouseY)+'px');
    $('.comment'+cursorId).css('left',(data.mouseX+30)+'px');
    document.getElementById('comment'+cursorId).innerHTML ='<i>'+data.comment+'</i>';

    console.log('#userDraggableContainer'+data.clientId+': x: '+data.mouseX+',y: '+data.mouseY);
    $('#userDraggableContainer'+data.clientId).css('top',(data.mouseY+50)+'px');
    $('#userDraggableContainer'+data.clientId).css('left',(data.mouseX+40)+'px');
}

function messageFromRoomCallBackfunction(data) {
    console.log('messageFromRoomCallBackfunction: '+data);
}

function addVideoPlayer(clientId,isViewer) {
    var dropDivPosition = $(".well").position();
    $('body').append('<div id="userDraggableContainer'+clientId+'" class="ui-widget-content" style="width: 120px; height: 100px; position:absolute; top: '+topPositionVideoStart+'px; left: '+(dropDivPosition.left+20)+'px;"><div id="flashcontent'+clientId+'">// HTML5 version goes here</div></div>');
    var movie = "/video/flash/release/WebCam.swf";
    var flashvars = (isViewer) ? {userType : 'viewer', userId: clientId} : {userType : 'presenter', userId: clientId};
    var params = { wmode: "transparent"};
    var attributes = { id: "WebCam" };
    swfobject.embedSWF(movie, "flashcontent"+clientId, "215", "140", "10.0.1", false, flashvars, params, attributes);

    if (isViewer) {
        $('#userDraggableContainer'+clientId).draggable();
        $('#userDraggableContainer'+clientId).stop();
    }
    else {
        console.log('waiting for user to accept webcam:: acceptWebCam');
        if (isOffline)
            acceptWebCam();
    }
}

if (typeof jQuery !== 'undefined') {
    $(document).ready(function() {
        listenToUserActions();
        connectUser();
    });
} else {
    console.log('jQuery not loaded');
}

function connectUser() {
    isAutoConnect = true;
    connectToSocket();
    addVideoPlayer(userId,false);
}

function makeid(numOfChar)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < numOfChar; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}