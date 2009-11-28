
TTOS.mouse = {};

TTOS.mouse.eventQueue = [];

TTOS.mouse.fireMap = function(map, modifiers) {
  var ctx = TTOS.context;
  ctx.save();
  if (typeof modifiers == 'function') modifiers(ctx);
  for (evt in TTOS.mouse.eventQueue) {
    evt = TTOS.mouse.eventQueue[evt];
    for (m in map) {
      ctx.save();
      ctx.beginPath();
      map[m].path(ctx);
      if (ctx.isPointInPath(evt.x, evt.y)) {
        //console.log(evt.type+": "+evt.x+","+evt.y+" ("+m+")");
        if (typeof map[m][evt.type] == 'function') map[m][evt.type](evt);
        if (!map[m].hovering && evt.type == "mousemove") {
          map[m].hovering = true;
          if(typeof map[m].mouseover == 'function') map[m].mouseover(evt);
        }
      } else {
        if (map[m].hovering && evt.type == "mousemove") {
          map[m].hovering = false;
          if(typeof map[m].mouseout == 'function') map[m].mouseout(evt);
        }
      }
      ctx.restore();
    }
  }
  ctx.restore();
};

TTOS.mouse.clearQueue = function() { TTOS.mouse.eventQueue = []; };

TTOS.mouse.eventHandler = function(e) {
  TTOS.mouse.eventQueue.push(e);
  return false;
};

window.onmousedown = TTOS.mouse.eventHandler;
window.onmouseup = TTOS.mouse.eventHandler;
window.onmousemove = TTOS.mouse.eventHandler;
