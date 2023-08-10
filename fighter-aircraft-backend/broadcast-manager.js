
let broadcastOpened = false;
let broadcastTimeoutList = [];
let speed = 0;
let angle = 0;
let battery = 100;

function initializeBroadcastManager() {
    speed = 0;
    angle = 0;
    battery = 100;
    broadcastTimeoutList = [];
}

function startBroadcasting(ws) {
    initializeBroadcastManager();
    broadcastOpened = true;
    broadcast(ws);
}

function stopBroadcasting() {
    broadcastOpened = false;
    broadcastTimeoutList.forEach((timeout) => {
        clearTimeout(timeout);
    });
}

function broadcast(ws) {
    if (!broadcastOpened) {
        return;
    }
    for(let i = 0; i < 1000; i++) {
        const currentBroadcastTimeout = setTimeout(() => {
            if (broadcastOpened) {

                // plane speed
                if(i > 200 && i < 350){
                    speed = speed - 0.3;
                }
                else if(i > 750 && i < 830) {
                    speed = speed - 0.3;
                }
                else if(i >= 830 && i < 860) {
                    speed = speed + 0.1;
                } else if (i >= 350 && i < 420) {
                    speed = speed + 0;
                } else if (i >= 420 && i < 480) {
                    speed = speed + 0.2;
                }
                else if(i < 50) {
                    speed = speed + 0.02;
                }
                else if(i >= 50 && i < 100) {
                    speed = speed + 0.1;
                }
                else {
                    speed = speed + 0.5;
                }

                if(speed > 100) {
                    speed = 100;
                }
                if(speed < 0) {
                    speed = 0;
                }
                const objectToBeSent = { eventName: "PLANE_SPEED", data: { speed: speed.toFixed(2) } };
                sendObjectAsString(ws, objectToBeSent);

                // plane angle
                if(i > 0 && i < 200){
                    angle = angle + 1;
                }
                else if(i > 220 && i < 530) {
                    angle = angle - 1;
                } else if(i > 630) {
                    angle = angle + 1;
                }

                if(angle > 360) {
                    angle = angle - 360;
                }
                if(angle < 0) {
                    angle = angle + 360;
                }

                const objectToBeSent2 = { eventName: "PLANE_ANGLE", data: { angle: angle.toFixed(2) } };
                sendObjectAsString(ws, objectToBeSent2);

                // plane battery
                if(i > 0 && i < 190){
                    battery = battery - 0.5;
                }
                else if(i >= 230 && i < 580) {
                    battery = battery + 0.2;
                }
                else {
                    battery = battery - 0.3;
                }

                if(battery > 100) {
                    battery = 100;
                }
                if(battery < 0) {
                    battery = 0;
                }
                
                const objectToBeSent3 = { eventName: "PLANE_BATTERY", data: { battery: Math.round(battery) } };
                sendObjectAsString(ws, objectToBeSent3);

            }
        }, 10 * i);
        broadcastTimeoutList.push(currentBroadcastTimeout);
    }
}

function sendObjectAsString(ws, obj) {
    ws.send(JSON.stringify(obj));
}

module.exports = {
    startBroadcasting,
    stopBroadcasting
};
