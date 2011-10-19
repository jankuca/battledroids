goog.provide('battledroids.Canvas');


/**
 * @constructor
 * @param {number} w The canvas width
 * @param {number} h The canvas height
 * @param {number=} cell_size The size of each grid cell
 */
battledroids.Canvas = function (w, h, cell_size) {
	var element = /** @type {HTMLCanvasElement} */ document.createElement('canvas');
	element.width = w;
	element.height = h;

	this.cell_size_ = cell_size;
	this.element_ = element;
};

/**
 * @return {HTMLCanvasElement}
 */
battledroids.Canvas.prototype.getElement = function () {
	return this.element_;
};
