
/*
 * Draw a rounded rectangle path.
 *
 * x, y: position of the rectangle
 *
 * w, h: width and height of the rectangle
 *
 * r (Integer): the radius of each corner
 * r (Array):   an array of radii like so:
 *                [topLeft, topRight, bottomRight, bottomLeft]
 */
CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
  with (this) {
    if (r instanceof Array) {
      var r1 = r[0];
      var r2 = r[1];
      var r3 = r[2];
      var r4 = r[3];
    } else {
      var r1 = r;
      var r2 = r;
      var r3 = r;
      var r4 = r;
    }
    beginPath();
    moveTo(x, y+r1);
    quadraticCurveTo(x, y, x+r1, y);
    lineTo(x+w-r2, y);
    quadraticCurveTo(x+w, y, x+w, y+r2);
    lineTo(x+w, y+h-r3);
    quadraticCurveTo(x+w, y+h, x+w-r3, y+h);
    lineTo(x+r4, y+h);
    quadraticCurveTo(x, y+h, x, y+h-r4);
    lineTo(x, y+r1);
  }
};
