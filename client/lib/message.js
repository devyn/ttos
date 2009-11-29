// message boxes

TTOS.MessageBox = function(shell, app, text) {
  this.shell = shell;
  this.app = app || {name: "System"};
  this.text = text;
  this.optrack = new Animator({opacity:0.0});
  this.mouseMap = {};
  this.dismissButton = new TTOS.Controls.Button(this, {px:0.80,ox:-120,py:0.65,oy:-50,ow:100,oh:30});
  this.dismissButton.text = "dismiss";
  var t = this;
  this.dismissButton.click = function() {
    t.close();
  };
  this.switchToButton = new TTOS.Controls.Button(this, {px:0.80,ox:-225,py:0.65,oy:-50,ow:100,oh:30});
  this.switchToButton.text = "switch to";
  this.switchToButton.click = function() {
    t.shell.switchApp(t.shell.content.indexOf(t.app));
    t.close();
  };
  this.shell.messages.push(this);
};

with (TTOS.MessageBox) {
  prototype.close = function() {
    this.closing=true;
    var t = this;
    this.optrack.tween({opacity:0.0}, 0.1, function(){
      t.shell.messages.splice(t.shell.messages.indexOf(t),1);
    });
  };
  prototype.draw = function() {
    var ctx = TTOS.context;
    if(!this.closing && this.optrack.opacity==0.0 && this.optrack._iv == null) this.optrack.tween({opacity:1.0}, 0.1);
    ctx.save();
    ctx.globalAlpha = this.optrack.opacity;
    ctx.fillStyle = "rgba(32,32,32,0.8)";
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    ctx.roundRect(TTOS.canvas.width*0.20, TTOS.canvas.height*0.35, TTOS.canvas.width*0.60, TTOS.canvas.height*0.30, 25);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "rgba(208,208,208,"+this.optrack.opacity+")";
    ctx.textBaseline = "top";
    ctx.font = "18px sans-serif";
    ctx.fillText(this.app.name+" says:", TTOS.canvas.width*0.20+20, TTOS.canvas.height*0.35+20);
    ctx.font = "14px sans-serif";
    var lines = this.text.split("\n");
    for (ln in lines)
      ctx.fillText(lines[ln], TTOS.canvas.width*0.20+20, TTOS.canvas.height*0.35+20+30+19*ln);
    ctx.restore();
    this.dismissButton.animator.opacity = this.optrack.opacity;
    this.switchToButton.animator.opacity = this.optrack.opacity;
    this.dismissButton.draw();
    if (this.app instanceof TTOS.Application &&
        this.shell.currentApp != this.app &&
        this.shell.content.indexOf(this.app) != -1)
      this.switchToButton.draw();
  };
};
