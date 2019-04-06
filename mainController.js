const NODES = ["ws://176.9.104.200:6031"];
const PONG_ADDRESS = 'iz3pongServer';

//*******************************************************

const MESSAGES = {handshake: 'HDSHK', left: 'LFT', right: 'RGT', playerName: 'NM', win:'WIN', lose:'LOSE'};

let leftDown = false, rightDown = false;

$('#left').on('mousedown touchstart',function (e) {
    console.log(e);
    e.preventDefault();
    leftDown = true;
});

$('#left').on('mouseup touchend',function (e) {
    e.preventDefault();
    leftDown = false;
});


$('#right').on('mousedown touchstart',function (e) {
    e.preventDefault();
    rightDown = true;
});

$('#right').on('mouseup touchend',function (e) {
    e.preventDefault();
    rightDown = false;
});


/**
 * Send message
 * @param {string} to
 * @param {object} message
 * @param {string} messageId
 */
function sendMessage(to, message, messageId) {
    let msg = candy.starwave.createMessage(message, to, undefined, messageId);
    candy.starwave.sendMessage(msg);
}

let candy = new Candy(NODES).start();
candy.onready = function () {
    setTimeout(function () {
        sendMessage(PONG_ADDRESS, {hello: 'Hello'}, MESSAGES.handshake);
    }, 1000);
};

candy.starwave.registerMessageHandler(MESSAGES.playerName, function (message) {
    document.getElementById('playerNo').innerText = message.data.name;
});

setInterval(function () {
    if(leftDown) {
        sendMessage(PONG_ADDRESS, {}, MESSAGES.left);
    }

    if(rightDown) {
        sendMessage(PONG_ADDRESS, {}, MESSAGES.right);
    }
}, 10);