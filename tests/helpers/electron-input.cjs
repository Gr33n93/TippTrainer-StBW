'use strict';

function scaleCssCoordinate(coordinate, zoomFactor) {
    return Math.round(coordinate * zoomFactor);
}

module.exports = { scaleCssCoordinate };
