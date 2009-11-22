require "ext/web-socket-ruby/lib/web_socket.rb"

TIME_APP_SCRIPT = <<-END
TTOS.TimeApp = {currentTime: "XX:XX:XX\\nXxxxx XX, XXXX", ticks: 0};

TTOS.TimeApp.fillPattern = function() {
  var col1 = Math.round((Math.sin(TTOS.TimeApp.ticks/40)+1)/2*255);
  var col2 = Math.round((Math.sin(TTOS.TimeApp.ticks/37)+1)/2*255);
  var col3 = Math.round((Math.sin(TTOS.TimeApp.ticks/38.5)+1)/2*255);
  return "rgb("+col1+","+col2+","+col3+")";
};

TTOS.drawing.timeApp = function(ctx) {
  var ct = TTOS.TimeApp.currentTime.split("\\n");
  ctx.save();
  ctx.fillStyle = TTOS.TimeApp.fillPattern();
  ctx.fillRect(0,0,TTOS.canvas.width,TTOS.canvas.height);
  ctx.restore();
  ctx.save();
  ctx.fillStyle = "#222";
  ctx.font = "32px sans-serif";
  ctx.fillText(ct[0], 50, 50);
  ctx.restore();
  ctx.save();
  ctx.fillStyle = "#444";
  ctx.font = "22px sans-serif";
  ctx.fillText(ct[1], 50, 50+34);
  ctx.restore();
};

TTOS.children.intervals += setInterval(function(){TTOS.TimeApp.ticks+=1;}, 1/30);
END

trap(:INT) { exit }

$wss = WebSocketServer.new("ws://localhost:14484");
$wss.run do |conn|
  conn.handshake
  conn.send "eval?#{TIME_APP_SCRIPT}"
  loop do
    ts = Time.now.strftime("%H:%M:%S\\n%b %d, %Y");
    conn.send "eval?TTOS.TimeApp.currentTime=\"#{ts}\";"
    conn.tcp_socket.flush
    conn.receive # dummy for now :D
    sleep 1
  end
end
