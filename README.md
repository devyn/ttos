# The TerraTop Operating System

TTOS runs in your HTML5-capable browser. All processes run server-side, and may communicate with the client through a WebSocket.

The goal is to provide a "WebOS" with an attractive canvas-based interface and low-latency WebSocket for live server communication.

## Usage

First, run the server:

    $ cd server/
    $ ruby server.rb

This will start a whole bunch of TTOS processes, and then open the WebSocket server. Now open client/client.html in your favorite HTML5-capable browser. Native WebSockets will be used if available, otherwise, [web-socket-js](http://github.com/gimite/web-socket-js) will be used (requires Flash).

When TTOS is started with no database, the setup wizard will be shown. It mostly involves setting up an administrator account and database location, as well as a few other minor options.

Once that's done, you will be presented with the TTOS user interface!

## TTOS-UI

TTOS has a single-application interface. You can have multiple applications open at one time, but you may only display one at a time. The bar at the top is called the "flick."

The left of the flick contains _tasks_, while the right of the flick contains _applets_.

Tasks are the applications you have open. You can switch between tasks by left-clicking on them, and you can close tasks by right-clicking on them (with one exception: the Application Manager can not be closed).

Applets are little applications usually used for notification. One such example is the default "clock" applet.
