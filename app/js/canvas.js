goog.provide('battledroids.Canvas');


/**
 * @constructor
 * @param {number} w The canvas width
 * @param {number} h The canvas height
 */
battledroids.Canvas = function (w, h) {
	var element = /** @type {HTMLCanvasElement} */ document.createElement('canvas');
	element.width = w;
	element.height = h;

	this.element_ = element;
};

/**
 * @return {HTMLCanvasElement}
 */
battledroids.Canvas.prototype.getElement = function () {
	return this.element_;
};
