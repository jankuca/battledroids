goog.require('battledroids.Canvas');
goog.require('battledroids.Droid');
goog.require('battledroids.Shot');
goog.require('easel.Bitmap');
goog.require('easel.BitmapSequence');
goog.require('easel.DisplayObject');
goog.require('easel.Stage');
goog.require('easel.SpriteSheet');


function main() {
	var id = prompt('username?');
	var socket = new WebSocket('ws://169.254.182.15:8080/?id=' + id);
	socket.onopen = function () {
		play(id, socket);
	};
	socket.onerror = function (err) { alert('server not running?'); };
	socket.onclose = function (err) { alert('disconnected!'); };
};

function play(id, socket) {
	var canvas = new battledroids.Canvas(800, 480);
	var stage = new easel.Stage(canvas.getElement());

	document.body.appendChild(canvas.getElement());

	createGround(stage);

	var droids = {};
	var shots = {};

	var droid = createDroid(stage, id);
	droid.listenTo(document.body);
	droids[id] = droid;

	droid.onshoot = function (shot_id) {
		var shot = createShot(stage, shot_id, droid);
		shots[shot_id] = shot;

		socket.send(window.JSON.stringify({
			'object_id': droid.id,
			'id': shot.id,
			'object': 'shot',
			'action': 'move',
			'x': shot.x,
			'y': shot.y,
			'dir': shot.dir
		}));
	};

	listenToServer(socket, function (message) {
		switch (message['object']) {
			case 'tank':
				var droid;
				switch (message['action']) {
					case 'create':
						if (!droids[message['id']]) {
							droid = createDroid(stage, message['id']);
							droid.setPosition(message['x'], message['y']);
							droid.setDir(message['dir']);

							droids[message['id']] = droid;
						}
						break;
					case 'destroy':
						droid = droids[message['id']];
						if (droid) {
							droid.remove();
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
			
			case 'shot':
				switch (message['action']) {
					case 'move':
						var shot = shots[message['id']];
						if (!shot) {
							shot = createShot(stage, droids[message['owner_id']]);
						}
						shot.setDir(message['dir']);
						shot.setPosition(message['x'], message['y']);
						break;
				}
				break;
		}
	});

	loop(stage, function (delta) {
		Object.keys(droids).forEach(function (id) {
			droids[id].applyDelta(delta);
		});
		Object.keys(shots).forEach(function (id) {
			var shot = shots[id];
			if (shot.getOwnerId() === droid.id) {
				shot.applyDelta(delta);
			}
		});

		if (droid.movement[0] !== 0 || droid.movement[1] !== 0) {
			socket.send(window.JSON.stringify({
				'id': droid.id,
				'object': 'tank',
				'action': 'move',
				'x': droid.x,
				'y': droid.y,
				'dir': droid.dir
			}));
		}	
	});
};

function createGround(stage) {
	var img = /** @type {Image} */ document.getElementById('img-ground');
	var bitmap = new easel.Bitmap(img);
	stage.addChild(bitmap);

	return bitmap;
};

function createDroid(stage, id) {
	var img = /** @type {Image} */ document.getElementById('img-droids-sprite');
	var sprite = new easel.SpriteSheet(img, 48, 48, null);
	var droid = new battledroids.Droid(id, sprite, [10, 7, 4, 1]);
	stage.addChild(droid.getDisplayObject());

	return droid;
};

function createShot(stage, id, droid) {
	var img = /** @type {Image} */ document.getElementById('img-shot');
	var bitmap = new easel.Bitmap(img);
	var shot = new battledroids.Shot(id, droid, bitmap);
	stage.addChild(shot.getDisplayObject());
	return shot;
}

function loop(stage, callback) {
	var last_ts = 0;
	function render() {
		var ts = Date.now();
		var delta = last_ts ? ts - last_ts : 0;
		last_ts = ts;

		callback(delta);
		stage.update();

		window.webkitRequestAnimationFrame(render);
	};
	window.webkitRequestAnimationFrame(render);
};

function listenToServer(socket, callback) {
	socket.onmessage = function (e) {
		var message = window.JSON.parse(e.data);
		callback(message);
	};
};


window.onload = main;
