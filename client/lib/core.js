TTOS = {};

TTOS.init = function() {
  var body = document.getElementsByTagName("body")[0];
  body.style.margin = "0px";
  TTOS.canvas = document.createElement("canvas");
  body.appendChild(TTOS.canvas);
  TTOS.canvas.style.position = "fixed"; // oddly enough, this is required to make the scrollbars go away?
  TTOS.context = TTOS.canvas.getContext('2d');
  TTOS.shell = new TTOS.AppShell();
  TTOS.appChooser.shell = TTOS.shell;
};

TTOS.Controls = {};
