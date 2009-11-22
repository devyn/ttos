# Copyright: Hiroshi Ichikawa <http://gimite.net/en/>
# Lincense: New BSD Lincense

require "web_socket"
require "thread"

Thread.abort_on_exception = true

server = WebSocketServer.new(
  ARGV[0] || "ws://localhost:10081",
  :host => "0.0.0.0")
puts("Ready")
connections = []
history = [nil] * 20

server.run() do |ws|
  begin
    
    puts("Connection accepted")
    ws.handshake()
    que = Queue.new()
    connections.push(que)
    
    for message in history
      next if !message
      ws.send(message)
      puts("Sent: #{message}")
    end
    
    thread = Thread.new() do
      while true
        message = que.pop()
        ws.send(message)
        puts("Sent: #{message}")
      end
    end
    
    while data = ws.receive()
      puts("Received: #{data}")
      for conn in connections
        conn.push(data)
      end
      history.push(data)
      history.shift()
    end
    
  ensure
    connections.delete(que)
    thread.terminate() if thread
    puts("Connection closed")
  end
end
