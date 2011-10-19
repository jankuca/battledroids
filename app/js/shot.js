goog.provide('battledroids.Shot');


battledroids.Shot = function (id, droid, bitmap) {
	this.id = id;

	this.owner_ = droid;
	this.bitmap_ = bitmap;

	this.setPosition(droid.x, droid.y);
	this.setDir(droid.dir);
};

battledroids.Shot.prototype.getOwnerId = function () {
	return this.owner_.id;
};

battledroids.Shot.prototype.getDisplayObject = function () {
	return this.bitmap_;
};

battledroids.Shot.prototype.applyDelta = function (delta) {
	this.delta_ += delta;

	var gain = Math.round(delta / 4);
	this.setPosition(this.x + gain, this.y + gain);
};

battledroids.Shot.prototype.setPosition = function (x, y) {
	var stage = this.bitmap_.getStage();
	if (!stage) { return; }
	var canvas = stage.canvas;
	
	this.x = x;
	this.y = y;
	this.bitmap_.x = x + this.bitmap_.regX;
	this.bitmap_.y = y + this.bitmap_.regY;
};

battledroids.Shot.prototype.setDir = function (dir) {
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

battledroids.Shot.prototype.setRotation = function (rotation) {
	this.rotation = rotation;
	this.bitmap_.rotation = rotation;
};
