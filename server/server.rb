require "ext/web-socket-ruby/lib/web_socket.rb"

$wss = WebSocketServer.new("ws://localhost:14484");
$wss.run do |conn|
  conn.handshake
  sleep 5
end
