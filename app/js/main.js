goog.require('battledroids.Canvas');
goog.require('easel.Stage');


function main() {
	var canvas = new battledroids.Canvas(800, 480, 16);
	var stage = new easel.Stage(canvas.getElement());

	document.body.appendChild(canvas.getElement());




//    setInterval(function(){
//        socket1.send(JSON.stringify({x:10,y:20}))
//    }, 1000);

};


var socket1 = new WebSocket('ws://172.16.202.4:8080/?username=user1');
socket1.onopen = function () { console.log('open');  };
socket1.onerror = function (err) { console.log('error', err); };
socket1.onmessage = function (e) { console.log('message for s1: ', e.data); };

var socket2 = new WebSocket('ws://172.16.202.4:8080/?username=user2');
socket2.onopen = function () { console.log('open');  };
socket2.onerror = function (err) { console.log('error', err); };
socket2.onmessage = function (e) { console.log('message for s2:', e.data); };

var socket3 = new WebSocket('ws://172.16.202.4:8080/?username=user3');
socket3.onopen = function () { console.log('open');  };
socket3.onerror = function (err) { console.log('error', err); };
socket3.onmessage = function (e) { console.log('message for s3:', e.data); };


var objm = {
    object: 'tank',
    action: 'move',
    x:20,
    y:100,
    dir: 'left'
}

var objn = {
    object: 'shot',
    action:'new',
    shot_id:'1',
    x:20,
    y:100,
    dir: 'left'
}

var objs = {
    object: 'shot',
    action:'move',
    shot_id:'1',
    x:20,
    y:100,
    dir: 'left'
}

var objs = {
    object: 'shot',
    action:'end',
    shot_id:'1',
    x:20,
    y:100,
    dir: 'left'
}


window.onload = main;
