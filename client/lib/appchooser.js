
TTOS.appChooser = {};

//TTOS.appChooser.textField = new TTOS.Controls.TextField();

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
};
