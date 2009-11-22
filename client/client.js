function loadScript(u) {
  var script = document.createElement("script");
  script.src = u;
  script.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(script);
}

function initWebSocket() {
  if ( !window.WebSocket ) {
    // Use Flash-based WebSockets (gimite/web-socket-js)
    loadScript("ext/web-socket-js/swfobject.js");
    loadScript("ext/web-socket-js/FABridge.js");
    loadScript("ext/web-socket-js/web_socket.js");
    WebSocket.__swfLocation = "ext/web-socket-js/WebSocketMain.swf";
  }
}

TTOS = {};

TTOS.init = function() {
  TTOS.canvas = document.getElementById("ttos-display");
  TTOS.drawing = {};
  TTOS.startDisplay();
  TTOS.connect(TTOS.serverURL);
};

TTOS.startDisplay = function() {
  TTOS.gc = TTOS.canvas.getContext('2d');
  TTOS.drawProcess = setInterval(TTOS.draw, 1);
};

TTOS.draw = function() {
  TTOS.canvas.width = window.innerWidth;
  TTOS.canvas.height = window.innerHeight;
  TTOS.gc.clearRect(0,0,TTOS.canvas.width,TTOS.canvas.height);
  for (n in TTOS.drawing) {
    TTOS.drawing[n](TTOS.gc);
  }
};

TTOS.connect = function(u) {
  TTOS.socket = new WebSocket(u);
  TTOS.socket.onmessage = TTOS.message;
  TTOS.socket.onclose = TTOS.noConnection;
  TTOS.socket.onopen = function(e) { TTOS.socket.onclose = TTOS.lostConnection; };
};

TTOS.message = function(e) {
};

TTOS.noConnection = function(e) {
  TTOS.fatalError("Could not connect to TTOS server.\nIt is possible that the server is down for maintenance.\nPlease try again later.");
};

TTOS.lostConnection = function(e) {
  TTOS.fatalError("Connection to server lost.\nIt is possible your network connection is down.\nThis page will refresh in 5 seconds.");
  setTimeout(function(){document.location.reload();}, 5000);
};

TTOS.percentX = function(i) { return i/100*TTOS.canvas.width;  };
TTOS.percentY = function(i) { return i/100*TTOS.canvas.height; };

TTOS.fatalError = function(s) {
  document.title = "TTOS - Fatal Error";
  TTOS.drawing = {};
  TTOS.drawing.modal = function(ctx) {
    ctx.save();
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, TTOS.canvas.width, TTOS.canvas.height);
    ctx.restore();
    ctx.save();
    ctx.font = "12pt sans-serif";
    ctx.fillStyle = "#999";
    var ss = s.split("\n");
    for (c in ss) {
      ctx.fillText(ss[c], TTOS.percentX(10), TTOS.percentY(10)+(16*c));
    }
    ctx.restore();
  };
};
