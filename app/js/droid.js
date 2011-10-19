goog.provide('battledroids.Droid');

goog.require('easel.BitmapSequence');


/**
 * @constructor
 * @param {string} id
 * @param {easel.SpriteSheet} sprite
 * @param {Array.<number>} frames
 */
battledroids.Droid = function (id, sprite, frames) {
	this.frames_ = frames;
	this.current_frame_index_ = 0;

	this.delta_ = 0;

	this.id = id;
	this.x = 0;
	this.y = 0;
	this.rotation = 0;
	this.movement = [ +0, +0 ];
	this.dir = 'left';

	var seq = new easel.BitmapSequence(sprite);
	seq.paused = true;
	seq.regX = 24;
	seq.regY = 24;
	seq.x = this.x + seq.regX;
	seq.y = this.y + seq.regY;
	seq.currentFrame = 1;
	this.seq_ = seq;
};

battledroids.Droid.prototype.applyDelta = function (delta) {
	this.delta_ += delta;

	var gain = Math.round(delta / 8);
	this.setPosition(this.x + this.movement[0] * gain, this.y + this.movement[1] * gain);

	if (this.delta_ > 500) {
		this.delta_ = 0;
		if (this.movement[0] || this.movement[1]) {
			this.seq_.currentFrame = this.frames_[this.current_frame_index_++];
			if (this.current_frame_index_ === this.frames_.length) {
				this.current_frame_index_ = 0;
			}
		}
	}
};

battledroids.Droid.prototype.setPosition = function (x, y) {
	this.x = x;
	this.y = y;
	this.seq_.x = x + this.seq_.regX;
	this.seq_.y = y + this.seq_.regY;
};

battledroids.Droid.prototype.setDir = function (dir) {
	this.dir = dir;
	switch (dir) {
		case 'left':
			this.setRotation(90);
			break;
		case 'up':
			this.setRotation(180);
			break;
		case 'right':
			this.setRotation(270);
			break;
		case 'down':
			this.setRotation(0);
			break;
	}
};

battledroids.Droid.prototype.setRotation = function (rotation) {
	this.rotation = rotation;
	this.seq_.rotation = rotation;
};

battledroids.Droid.prototype.getDisplayObject = function () {
	return this.seq_;
};

battledroids.Droid.prototype.listenTo = function (element) {
	var self = this;
	var dirs = [];
	element.addEventListener('keydown', function (e) {
		switch (e.keyCode) {
			case 37:
				self.setDir('left');
				self.movement = [ -1, +0 ];
				self.setRotation(90);
				break;
			case 38:
				self.setDir('up');
				self.movement = [ +0, -1 ];
				self.setRotation(180);
				break;
			case 39:
				self.setDir('right');
				self.movement = [ +1, +0 ];
				self.setRotation(270);
				break;
			case 40:
				self.setDir('down');
				self.movement = [ +0, +1 ];
				self.setRotation(0);
				break;
		}
	});
	element.addEventListener('keyup', function (e) {
		switch (e.keyCode) {
			case 37:
				self.movement[0] = 0;
				break;
			case 38:
				self.movement[1] = 0;
				break;
			case 39:
				self.movement[0] = 0;
				break;
			case 40:
				self.movement[1] = 0;
				break;
		}
	});
};
