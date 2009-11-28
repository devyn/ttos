
TTOS.Application = function(opt) {
  this.title = "Untitled";
  this.image = new Image();
  this.image.src = "res/circles.png";
  this.init  = function() {};
  this.draw  = function() {};
  this.close = function() {};
  this.mouseMap = {};
  this.keyFocus = null;
  if (typeof opt == 'object') {
    for (i in opt) {
      this[i] = opt[i];
    }
  }
  if(!this.shell instanceof TTOS.AppShell) throw {name: "ArgumentError", message: "No 'shell' option specified, or 'shell' is not an AppShell."};
};

TTOS.Application.prototype.mouseDown = function(e) {
  TTOS.mouse.down(this.mouseMap, e);
  return false;
};

TTOS.Application.prototype.mouseUp = function(e) {
  TTOS.mouse.up(this.mouseMap, e);
  return false;
};

TTOS.Application.prototype.mouseMove = function(e) {
  TTOS.mouse.move(this.mouseMap, e);
  return false;
};

TTOS.Application.prototype.keyDown = function(e) {
  if (this.keyFocus) {
    this.keyFocus.keyDown(e);
  }
  return false;
};

TTOS.Application.prototype.keyUp = function(e) {
  if (this.keyFocus) {
    this.keyFocus.keyUp(e);
  }
  return false;
};
