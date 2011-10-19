goog.require('battledroids.Canvas');
goog.require('easel.Stage');


function main() {
	var canvas = new battledroids.Canvas(800, 480, 16);
	var stage = new easel.Stage(canvas.getElement());

	document.body.appendChild(canvas.getElement());


/*
	var socket1 = new WebSocket('ws://172.16.202.4:8080/');
	socket1.onopen = function () { console.log('open'); this.send('asd'); };
	socket1.onerror = function (err) { console.log('error', err); };
	socket1.onmessage = function (e) { console.log('message', e.data); };

	var socket2 = new WebSocket('ws://172.16.202.4:8080/');
	socket2.onopen = function () { console.log('open'); this.send('asd2'); };
	socket2.onerror = function (err) { console.log('error', err); };
	socket2.onmessage = function (e) { console.log('message', e.data); };
*/
};

window.onload = main;
