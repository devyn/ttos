
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
  // FOR DEBUGGING
  var debugApp = new TTOS.Application({shell:this});
  debugApp.title = "Debug Application - just a test";
  debugApp.image = new Image();
  debugApp.image.src = "res/circles.png";
  debugApp.draw = function(shell) {
    var ctx = TTOS.context;
    ctx.save();
    var grad = ctx.createLinearGradient(0,0,0,shell.panelHeight());
    grad.addColorStop(0.0, "#000");
    grad.addColorStop(1.0, "#288");
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,shell.panelWidth(),shell.panelHeight());
    ctx.restore();
  };
  this.addApp(debugApp);
  var debugApp2 = new TTOS.Application(debugApp);
  debugApp2.draw = function(shell) {
    var ctx = TTOS.context;
    ctx.save();
    var grad = ctx.createLinearGradient(0,0,0,shell.panelHeight());
    grad.addColorStop(0.0, "#000");
    grad.addColorStop(1.0, "#822");
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,shell.panelWidth(),shell.panelHeight());
    ctx.restore();
  };
  this.addApp(debugApp2);
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
    ctx.translate(36,0);
    for (c in this.content) {
      ctx.drawImage(this.content[c].image, 3+3*c, 3, 24, 24);
      ctx.translate(24,0);
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
    TTOS.mouse.fireMap(this.flickMap);
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
    if (this.currentApp) TTOS.mouse.fireMap(this.currentApp.mouseMap, function(ctx){ctx.translate(0,30);});
  };
  /*
   * switch apps (index no.), null for app chooser
   */
  prototype.switchApp = function(appIndex) {
    if (appIndex != null && appIndex >= this.content.length || appIndex < 0) throw {name:"ArgumentError",message:"appIndex out of array bounds ["+appIndex+" / "+this.content.length+"]."};
    //console.log("switch from "+this.content.indexOf(this.currentApp)+" to "+appIndex+" ("+arguments.callee.caller.toString()+")");
    var t = this;
    var after = function() { with(t) { currentApp = content[appIndex]; } };
    if (this.content.indexOf(this.currentApp) == appIndex) {
      after();
    } else if (appIndex == null) {
      this.caiTracker.tween({opacity:0.0,ox:-30,oy:3}, 0.1, after);
    } else if (this.currentApp == null) {
      this.caiTracker.tween({opacity:0.3,ox:39+27*appIndex,oy:3}, 0.1, after);
    } else {
      this.caiTracker.tween({ox:39+27*appIndex,oy:3,opacity:0.3}, 0.1, after);
    }
  };
  /*
   * add application "app" to AppShell
   */
  prototype.addApp = function(app) {
    // TODO: add an effect
    if (this.content.indexOf(app) != -1) return false;
    this.content.push(app);
    var i = this.content.indexOf(app);
    var t = this;
    this.flickMap["app"+i] = {
      path: function(ctx) {
              ctx.rect(39+27*i,3,24,24);
            },
      mousedown: function(e) {
                   // why mousedown? because it feels more instant to the user.
                   t.switchApp(i);
                 }
    };
    return true;
  };
  /*
   * remove the application at appIndex
   *
   * [!] make sure to close the application first
   */
  prototype.removeApp = function(appIndex) {
    // TODO: add an effect
    if (!this.content[appIndex]) return false;
    delete this.content[appIndex];
    delete this.flickMap["app"+appIndex];
    return true;
  };
}
