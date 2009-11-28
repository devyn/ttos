
/*
 * constructor for the Animator class.
 *
 * props: a list of initial properties.
 */
Animator = function(props) {
  this._iv = null;
  for (prop in props) {
    this[prop] = props[prop];
  }
};

/*
 * update the animator without doing any actual animation
 *
 * target: a list of properties to merge.
 */
Animator.prototype.update = function(target) {
  for (t in target) this[t] = target[t];
};

/*
 * make a tween motion from this to target, over duration seconds,
 * calling the optional oncomplete function after the tween motion finishes.
 *
 * target: a list of properties to merge.
 * duration: the number of seconds the animation should take place over.
 * oncomplete: an optional callback to run after the animation has completed
 *               (useful for chain-animations)
 */
Animator.prototype.tween = function(target, duration, oncomplete) {
  this.stop(); // make sure there is no conflict
  var frames = Math.round(duration * 30);
  var frame = 1;
  var tt = this;
  var to = new Animator(this);
  this._iv = setInterval(function() {
    for (t in target) {
      if (typeof tt[t] != typeof target[t]) continue;
      if (frame == frames) {
        tt[t] = target[t];
      } else {
        tt[t] += (target[t]-to[t])/frames;
      }
    }
    if (frame == frames) {
      tt.stop();
      if(typeof oncomplete == 'function') oncomplete();
    }
    else frame++;
  }, 1000/30);
};

/*
 * stop the animation!
 */
Animator.prototype.stop = function() {
  clearInterval(this._iv);
  this._iv = null;
};
