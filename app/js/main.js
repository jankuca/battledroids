goog.require('battledroids.Canvas');
goog.require('battledroids.Droid');
goog.require('easel.Bitmap');
goog.require('easel.BitmapSequence');
goog.require('easel.DisplayObject');
goog.require('easel.Stage');
goog.require('easel.SpriteSheet');


function main() {
	var id = prompt('username?');
	var socket = new WebSocket('ws://172.16.202.4:8080/?id=' + id);
	socket.onopen = function () {
		play(id, socket);
	};
	socket.onerror = function (err) { alert('server not running?'); };
};

function play(id, socket) {
	var canvas = new battledroids.Canvas(800, 480, 16);
	var stage = new easel.Stage(canvas.getElement());

	document.body.appendChild(canvas.getElement());

	var bitmap = new easel.Bitmap(document.getElementById('img-ground'));
	stage.addChild(bitmap);

	var sprite = new easel.SpriteSheet(document.getElementById('img-droids-sprite'), 48, 48);
	droid = new battledroids.Droid(id, sprite, [1, 4]);
	droid.listenTo(document.body);
	stage.addChild(droid.getDisplayObject());

	var last_ts = 0;
	function render() {
		var ts = Date.now();
		var delta = last_ts ? ts - last_ts : 0;
		last_ts = ts;

		droid.applyDelta(delta);
		stage.update();
		socket.send(JSON.stringify({
			'id': droid.id,
			'object': 'tank',
			'action': 'move',
			'x': droid.x,
			'y': droid.y,
			'dir': droid.dir
		}));

		window.webkitRequestAnimationFrame(render);
	};

	window.webkitRequestAnimationFrame(render);

	var droids = {};
	droids[id] = droid;

	socket.onmessage = function (e) {
		var message = JSON.parse(e.data);
		var droid;
		switch (message['object']) {
			case 'tank':
				switch (message['action']) {
					case 'create':
						if (!droids[message['id']]) {
							droid = new battledroids.Droid(message['id'], sprite, [2, 5]);
							stage.addChild(droid.getDisplayObject());
							droid.setPosition(message['x'], message['y']);
							droid.setDir(message['dir']);

							droids[message['id']] = droid;
						}
						break;
					case 'move':
						droid = droids[message['id']];
						if (droid) {
							droid.setDir(message['dir']);
							droid.setPosition(message['x'], message['y']);
						}
						break;
				}
				break;
		}
	};
};

window.onload = main;
