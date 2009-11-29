
TTOS.appChooser = {};

//TTOS.appChooser.textField = new TTOS.Controls.TextField();

TTOS.appChooser.mouseMap = {};
TTOS.appChooser.sandboxButton = new TTOS.Controls.Button(TTOS.appChooser, {ox:10,oy:20+24+15+5,ow:200,oh:45});
TTOS.appChooser.sandboxButton.text = "Debug Sandbox";
TTOS.appChooser.sandboxButton.click = function() {
  TTOS.shell.addApp(DebugSandboxApp(TTOS.shell));
};
TTOS.appChooser.draw = function(shell) {
  var ctx = TTOS.context;
  ctx.save();
  ctx.font = "24px sans-serif";
  ctx.fillStyle = "#ddd";
  ctx.fillText("<search box>", 50, 10+24);
  ctx.restore();
  ctx.save();
  ctx.strokeStyle = "#eee";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 20+24+15);
  ctx.lineTo(shell.panelWidth(), 20+24+15);
  ctx.stroke();
  ctx.restore();
  TTOS.appChooser.sandboxButton.draw();
  TTOS.mouse.fireMap(TTOS.appChooser.mouseMap);
};
