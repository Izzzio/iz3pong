const NODES = ["ws://176.9.104.200:6031"];
const PONG_ADDRESS = 'iz3pongServer';

//*******************************************************

const MESSAGES = {handshake: 'HDSHK', left: 'LFT', right: 'RGT', playerName: 'NM', win: 'WIN', lose: 'LOSE'};

let playerAAddress = '';
let playerBAddress = '';

let candy;

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

let pong;
window.onload = function () {
    pong = new Pong(document.getElementById('pong'));

    pong.players.a.setSpeed(500);
    pong.players.b.setSpeed(500);

    /**
     * Change screen message
     * @param msg
     */
    function changeMsg(msg) {
        pong.startScreen.setMessage(msg);
        pong.refresh();
    }

    /**
     * Resize screen
     */
    function resize() {
        document.getElementById('pong').style.height = window.innerHeight - 40 + 'px';
        pong.resize();
    }

    /**
     * Start game countdown
     * @param time
     */
    function startGame(time) {
        changeMsg('3      3');

        let milTime = Math.round(time / 3);

        setTimeout(function () {
            pong.start();
        }, time);

        setTimeout(function () {
            changeMsg('2      2');
        }, milTime);

        setTimeout(function () {
            changeMsg('1      1');
        }, milTime * 2);
    }

    window.startGame = startGame;

    resize();
    window.onresize = resize;

    changeMsg('WAITING FOR CONNECTION...');

    candy = new Candy(NODES).start();
    candy.recieverAddress = PONG_ADDRESS;
    candy.onready = function () {
        changeMsg('WAITING FOR PLAYERS');
    };

    /**
     * Get handshakes
     */
    candy.starwave.registerMessageHandler(MESSAGES.handshake, function (message) {
        if(playerBAddress !== 0) {
            return;
        }

        if(playerAAddress.length === 0) {
            playerAAddress = message.sender;
            changeMsg('Waiting for player B');
            sendMessage(playerAAddress, {name: 'A'}, MESSAGES.playerName);
            return;
        }

        if(playerAAddress.length !== 0) {
            playerBAddress = message.sender;
            changeMsg('Loading...');
            sendMessage(playerBAddress, {name: 'B'}, MESSAGES.playerName);
            startGame(3000);
            return;
        }
    });

    candy.starwave.registerMessageHandler(MESSAGES.left, function (message) {
        if(message.sender === playerAAddress) {
            pong.players.a.move(1);
        } else {
            pong.players.b.move(1);
        }
    });

    candy.starwave.registerMessageHandler(MESSAGES.right, function (message) {
        if(message.sender === playerAAddress) {
            pong.players.a.move(-1);
        } else {
            pong.players.b.move(-1);
        }
    });

};
