DebugSandboxApp = function(shell) {
  var app = new TTOS.Application({shell:shell});
  app.name = "Debug Sandbox";
  app.title = "Debug Sandbox";
  app.image = new Image();
  app.image.src = "res/sandbox.png";

  app.init = function() {
    this.spawnButton = new TTOS.Controls.Button(this, {px:0.5,ox:-87.5,ow:175,py:0.5,oy:-15,oh:30});
    this.spawnButton.text = "open message box";
    this.spawnButton.click = function() {
      new TTOS.MessageBox(app.shell, app, "This is a test.\nPlease remember to wear proper safety gear\n  when entering the time machine.");
    };
  };

  app.draw = function() {
    var ctx = TTOS.context;
    ctx.save();
    var grad = ctx.createLinearGradient(0,0,0,this.shell.panelHeight());
    with(grad) {
      addColorStop(0.0, "#000");
      addColorStop(1.0, "#822");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,this.shell.panelWidth(),this.shell.panelHeight());
    ctx.restore();
    this.spawnButton.draw();
  };

  app.close = function() {
  };

  return app;
};
