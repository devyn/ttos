
/*
 * Logo for the flick
 */
TTOS.flickLogo = new Image();
TTOS.flickLogo.src = "res/flick-logo.png";

/* constructor for TTOS.AppShell
 *
 * new TTOS.AppShell();
 */
TTOS.AppShell = function() {
  this.content = [];
  this.currentApp = null;
  this.caiTracker = new Animator({px:0.00,ox:-30,py:0.00,oy:3,opacity:0.0});
  var t = this;
  this.drawProc = setInterval(function(){with(t){draw();}}, 1); // use as much speed as we can get
  this.flickMap = {};
  this.flickMap.appChooser = {
    path: function(ctx) {
            ctx.rect(3, 3, 24, 24);
          },
    mouseup: function(e) {
               t.switchApp(null);
             }
  };
  this.messages = [];
};

with (TTOS.AppShell) {
  /*
   * return current panel dimensions
   * panelWidth():  get the current width
   * panelHeight(): get the current height
   */
  prototype.panelWidth  = function() { return TTOS.canvas.width;       }
  prototype.panelHeight = function() { return TTOS.canvas.height - 30; }
  /*
   * draw the current AppShell state to the canvas,
   * and handle events.
   */
  prototype.draw = function() {
    TTOS.canvas.width = window.innerWidth;
    TTOS.canvas.height = window.innerHeight;
    this.drawApp();
    this.drawFlick();
    this.drawMessage();
    TTOS.mouse.clearQueue();
  };
  /*
   * draw the "flick" bar
   */
  prototype.drawFlick = function() {
    var ctx = TTOS.context;
    ctx.save();
    var grad = ctx.createLinearGradient(0,0,0,30);
    grad.addColorStop(0.0, "#000");
    grad.addColorStop(0.5, "#333");
    grad.addColorStop(1.0, "#000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, TTOS.canvas.width, 30);
    ctx.restore();
    ctx.save();
    ctx.drawImage(TTOS.flickLogo, 3, 3, 24, 24);
    grad = ctx.createLinearGradient(32,2,32,28);
    grad.addColorStop(0.0, "rgba(200,200,200,0.0)");
    grad.addColorStop(0.5, "rgba(200,200,200,1.0)");
    grad.addColorStop(1.0, "rgba(200,200,200,0.0)");
    ctx.fillStyle = grad;
    ctx.fillRect(32, 2, 2, 28);
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,"+this.caiTracker.opacity+")";
    ctx.roundRect(this.caiTracker.px*TTOS.canvas.width+this.caiTracker.ox, this.caiTracker.py*TTOS.canvas.height+this.caiTracker.oy, 24, 24, 3);
    ctx.fill();
    ctx.restore();
    ctx.save();
    for (c in this.content) {
      c = this.content[c];
      ctx.globalAlpha = c.iconPos.opacity;
      ctx.drawImage(c.image, c.iconPos.x, c.iconPos.y, 24, 24);
    }
    ctx.restore();
    ctx.save();
    var d = new Date();
    var h = d.getHours() + "";
    var m = d.getMinutes() + "";
    h = (h.length == 1) ? "0" + h : h;
    m = (m.length == 1) ? "0" + m : m;
    var time = h+":"+m;
    var fs = 16;
    ctx.fillStyle = "#eee";
    ctx.font = fs+"px sans-serif";
    ctx.fillText(time, TTOS.canvas.width-(time.length*(fs/2)+10), 30-fs/2);
    ctx.restore();
    if (this.messages.length==0) TTOS.mouse.fireMap(this.flickMap);
  };
  /*
   * draw the currently open app
   */
  prototype.drawApp = function() {
    var ctx = TTOS.context;
    ctx.save();
    ctx.translate(0,30);
    ctx.save();
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.panelWidth(), this.panelHeight());
    ctx.restore();
    if (this.currentApp) this.currentApp.draw(this);
    else TTOS.appChooser.draw(this);
    ctx.restore();
    if (this.currentApp && this.messages.length==0) TTOS.mouse.fireMap(this.currentApp.mouseMap, function(ctx){ctx.translate(0,30);});
  };
  /*
   * switch apps (index no.), null for app chooser
   */
  prototype.switchApp = function(appIndex) {
    if (appIndex != null && appIndex >= this.content.length || appIndex < 0) throw {name:"ArgumentError",message:"appIndex out of array bounds ["+appIndex+" / "+this.content.length+"]."};
    if (appIndex == this.content.indexOf(this.currentApp)) return false;
    //console.log("switch from "+this.content.indexOf(this.currentApp)+" to "+appIndex+" ("+arguments.callee.caller.toString()+")");
    var t = this;
    var after = function() { with(t) { currentApp = content[appIndex]; } };
    this.updateCAI(appIndex, after);
  };
  prototype.drawMessage = function() {
    if (this.messages[0]) {
      this.messages[0].draw();
      TTOS.mouse.fireMap(this.messages[0].mouseMap);
    }
  };
  /*
   * update current app indicator
   */
  prototype.updateCAI = function(appIndex, after) {
    if(!after) after = function(){};
    if (appIndex < 0) appIndex = null;
    if (appIndex == null)
      this.caiTracker.tween({opacity:0.0,ox:-30,oy:3}, 0.1, after);
    else if (this.currentApp == null)
      this.caiTracker.tween({opacity:0.3,ox:39+27*appIndex,oy:3}, 0.1, after);
    else
      this.caiTracker.tween({ox:39+27*appIndex,oy:3,opacity:0.3}, 0.1, after);
  };
  /*
   * add application "app" to AppShell,
   * run app.init()
   */
  prototype.addApp = function(app) {
    if (this.content.indexOf(app) != -1) return false;
    this.content.push(app);
    var t = this;
    app.iconPos = new Animator({x:39+27*this.content.indexOf(app),y:-30,opacity:0.0});
    app.aid = Math.round(Math.random()*1000000000000);
    this.flickMap["app"+app.aid] = {
      path: function(ctx) {
              ctx.rect(app.iconPos.x,app.iconPos.y,24,24);
            },
      mousedown: function(e) {
                   // why mousedown? because it feels more instant to the user.
                   if (e.button == 2)
                     t.closeApp(t.content.indexOf(app));
                   else
                     t.switchApp(t.content.indexOf(app));
                 }
    };
    app.init();
    app.iconPos.tween({y:3,opacity:1.0}, 0.1);
    this.switchApp(this.content.indexOf(app));
    return true;
  };
  /*
   * remove the application at appIndex
   *
   * [!] make sure to close the application first
   */
  prototype.removeApp = function(appIndex) {
    if (!this.content[appIndex]) return false;
    if(this.content[appIndex] == this.currentApp) this.prevApp();
    else if (appIndex < this.content.indexOf(this.currentApp)) this.updateCAI(this.content.indexOf(this.currentApp)-1); // make sure CAI is in the right position
    var a = this.content.slice(appIndex+1);
    for (i in a) {
      a[i].iconPos.tween({x:a[i].iconPos.x-27},0.1);
    }
    var t = this;
    this.content[appIndex].iconPos.tween({y:-30,opacity:0.0}, 0.1,
      function() {
        t.content.splice(appIndex,1);
        delete t.flickMap["app"+this.content[appIndex].aid];
      });
  };
  /*
   * close and remove application.
   */
  prototype.closeApp = function(appIndex) {
    if(!this.content[appIndex]) return false;
    this.content[appIndex].close();
    this.removeApp(appIndex);
  };
  /*
   * move forward one app in this.content,
   * including the appChooser,
   * else move to back (cycle)
   */
  prototype.nextApp = function() {
    if (this.content.length == 0)
      return false;
    else if (this.currentApp == null)
      this.switchApp(0);
    else if (this.content.indexOf(this.currentApp) < this.content.length-1)
      this.switchApp(this.content.indexOf(this.currentApp)+1);
    else
      this.switchApp(null);
  };
  /*
   * move backward one app in this.content,
   * including the appChooser,
   * else move to front (cycle)
   */
  prototype.prevApp = function() {
    if (this.content.length == 0)
      return false;
    else if (this.content.indexOf(this.currentApp) == 0)
      this.switchApp(null);
    else if (this.currentApp == null)
      this.switchApp(this.content.length-1);
    else
      this.switchApp(this.content.indexOf(this.currentApp)-1);
  };
}
