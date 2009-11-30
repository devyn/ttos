
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
  this.font = "18px sans-serif";
  this.text = "button"+this.id;
  app.mouseMap["button"+this.id] = this;
  this.clickable = true;
};

with(TTOS.Controls.Button) {
  prototype.draw = function() {
    var ctx = TTOS.context;
    ctx.save();
    ctx.globalAlpha = this.animator.opacity;
    ctx.save();
    var x = this.animator.px*(this.app instanceof TTOS.Application ? this.app.shell.panelWidth() : TTOS.canvas.width)+this.animator.ox;
    var y = this.animator.py*(this.app instanceof TTOS.Application ? this.app.shell.panelHeight() : TTOS.canvas.height)+this.animator.oy;
    var w = this.animator.pw*(this.app instanceof TTOS.Application ? this.app.shell.panelWidth() : TTOS.canvas.width)+this.animator.ow;
    var h = this.animator.ph*(this.app instanceof TTOS.Application ? this.app.shell.panelHeight() : TTOS.canvas.height)+this.animator.oh;
    var fillGrad = ctx.createLinearGradient(x,y,x,y+h);
    with (fillGrad) {
      addColorStop(0.00, "#5f5f5f");
      addColorStop(0.47, "#535353");
      addColorStop(0.53, "#646464");
      addColorStop(1.00, "#acacac");
    }
    ctx.fillStyle = fillGrad;
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 3;
    ctx.roundRect(x,y,w,h,5);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var textGrad = ctx.createLinearGradient(x,y,x,y+h);
    with (textGrad) {
      addColorStop(0.00, "#101010");
      addColorStop(0.47, "#3c3c3c");
      addColorStop(0.53, "#1b1b1b");
      addColorStop(1.00, "#030303");
    }
    ctx.fillStyle = textGrad;
    ctx.font = this.font;
    ctx.fillText(this.text, x+w/2, y+h/2);
    ctx.restore();
    ctx.restore();
  };
  prototype.path = function(ctx) {
    var x = this.animator.px*(this.app instanceof TTOS.Application ? this.app.shell.panelWidth() : TTOS.canvas.width)+this.animator.ox;
    var y = this.animator.py*(this.app instanceof TTOS.Application ? this.app.shell.panelHeight() : TTOS.canvas.height)+this.animator.oy;
    var w = this.animator.pw*(this.app instanceof TTOS.Application ? this.app.shell.panelWidth() : TTOS.canvas.width)+this.animator.ow;
    var h = this.animator.ph*(this.app instanceof TTOS.Application ? this.app.shell.panelHeight() : TTOS.canvas.height)+this.animator.oh;
    ctx.roundRect(x,y,w,h,5);
  };
  prototype.mouseup = function(evt) {
    //console.log("button "+this.id+" clicked (with mouse button "+evt.button+").");
    if(this.clickable) {
      if (typeof this.click == 'function') this.click(evt);
      this.clickable = false;
      var t = this;
      setTimeout(function(){t.clickable=true;},100);
    }
  };
};
