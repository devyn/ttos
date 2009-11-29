
/*
 * create a button
 *
 * note: animation enabled, just use #animator to get an Animator object
 */
TTOS.Controls.Button = function(app, opt) {
  this.app = app;
  var o = {px:0,ox:0,py:0,oy:0,pw:0,ow:0,ph:0,oh:0,opacity:1};
  for (sw in opt) o[sw] = opt[sw];
  this.animator = new Animator(o);
  this.id = Math.round(Math.random()*1000000000000);
  app.mouseMap['button'+this.id] = this;
};

with(TTOS.Controls.Button) {
  prototype.draw = function() {
    var ctx = TTOS.context;
    ctx.save();
    var x = this.animator.px*this.app.shell.panelWidth()+this.animator.ox;
    var y = this.animator.py*this.app.shell.panelHeight()+this.animator.oy;
    var w = this.animator.pw*this.app.shell.panelWidth()+this.animator.ow;
    var h = this.animator.ph*this.app.shell.panelHeight()+this.animator.oh;
    var fillGrad = ctx.createLinearGradient(x,y,x,y+h);
    with (fillGrad) {
      addColorStop(0.0, "#222");
      addColorStop(0.5, "#333");
      addColorStop(1.0, "#222");
    }
    ctx.fillStyle = fillGrad;
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 3;
    ctx.roundRect(x,y,w,h,10);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };
  prototype.path = function(ctx) {
    var x = this.animator.px*this.app.shell.panelWidth()+this.animator.ox;
    var y = this.animator.py*this.app.shell.panelHeight()+this.animator.oy;
    var w = this.animator.pw*this.app.shell.panelWidth()+this.animator.ow;
    var h = this.animator.ph*this.app.shell.panelHeight()+this.animator.oh;
    ctx.roundRect(x,y,w,h,10);
  };
  prototype.mouseup = function(evt) {
    console.log("button "+this.id+" clicked (with mouse button "+evt.button+").");
  };
};
