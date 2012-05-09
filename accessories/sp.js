//Version 1
function Sprite(_x, _y, _img, ix, iy, iw, ih) {
	this.x = _x;
	this.y = _y;
	if (typeof _img == 'string') {
		this.img = new Image();
		this.img.src = _img;
	} else {
		this.img = _img || new Image();
	}
	this.animations  = {};
	this.animation = [];
	this.transition = [];
	this.frames = [new Frame(ix, iy, iw, ih)];
	this.complete = false;
	
	if (_img.complete) {
		this.complete = true;
	}
	if (_img.getContext) {
		this.complete = true;
	}
};

function Frame(_x, _y, _w, _h) {
	var t = this;
	if (_x && (_x.x || _x.x==0)) {
		t.x = _x.x;
		t.y = _x.y;
		t.w = _x.w;
		t.h = _x.h;
	} else {
		t.x = _x || 0;
		t.y = _y || 0;
		t.w = _w || 0;
		t.h = _h || 0;
	}
	
	t.is = function(f) {
		return t.x == f.x
			? t.y == f.y
				? t.w == f.w
					? t.h == f.h
						? true
						: false
					: false
				: false
			: false;
	};
};

function Animation() {
	var a = [];
	
	a.addFrame = function(f, r) {
		if (typeof r != 'undefined') {
			f.loop = r;
		}
		this.push(f);
	};
	
	a.peek = function() {
		var f, p = this.pop();
		this.push(p);
		
		if (p.val && p.val == 'p') {
			return f;
		}
		
		if (p.peek) {
			return p.peek();
		}
			
			return p;		
	};
	
	a.nextFrame = function() {
		var loopChance = function(a, e) {
			if (e && e.loop) {
				if (e.loop > 0) {
					e.loop--;
				}
				if (e.loop != 0) {
					a.push(e);
				}
			}
		}
		
		var f, u, p = this.pop();
		if (p.val && p.val == 'p') {
			f = u;
		}	else {
			if (p.nextFrame) {
				f = p.nextFrame();
				if (p.length) {
					this.push(p);
				} else {
					if (p.loop) {
						var l = p.loop;
						p = p.backup.play();
						p.loop = l;
						loopChance(this, p);
					}
				}
				return f;
			} else {
				f = p;
			}
		}
		
		loopChance(this, f);
		
		return f;
	};
	
	a.play = function() {
		var t = [];
		t.addFrame = this.addFrame;
		t.nextFrame = this.nextFrame;
		t.peek = this.peek;
		for (var i = 0; i < this.length; i++) {
			if (this[i].play) {
				t[i] = this[i].play();
			} else {
				if (this[i].val) {
					t[i] = {val: 'p'};
				} else {
					t[i] = new Frame(this[i]);
				}
			}
			t[i].loop = this[i].loop;
		}
		
		t.backup = this;
		return t.reverse();
	}
		
	return a;
};

Sprite.prototype = {
	update: [],
	
	addFrame: function(x, y, w, h, num) {
		num = num || this.frames.length;
		this.frames[num] = new Frame(x, y, w, h);
		return num;
	},
	
	insertFrame: function(x, y, w, h, num) {
		if (typeof num == 'undefined') {
			for (var i = 0; i < this.frames.length; i++) {
				if (typeof this.frames[i] == 'undefined') {
					num = i;
					break;
				}
			}
		}
		
		return addFrame(x, y, w, h, num);
	},
	
	play: function(name, transition) {
		var a = this.animations[name];
		if (a) {
			if (transition) {
				this.transition.push(a.play());
			} else {
				this.animation.push(a.play());
			}
		}
	},
	
	stop: function() {
		this.animation = [];
	},
	
	nextFrame: function() {
		var f;

		if (this.animation.length) {
			var anime = this.animation.pop();
			while (anime.length == 0) {
				anime = this.animation.pop();
			}
			this.animation.push(anime);
			
			if (this.transition.length) {
				var t = this.transition.shift();
				if (anime.peek().is(t.peek())) {
					this.animation.push(t);
					return this.nextFrame();
				}	else {
					this.transition.unshift(t);
				}
			}
			var n = anime.nextFrame();
			n && (f = n);
			
		}
		return f;
	},
	
	draw: function(ctx, scaleW, scaleH) {
		for (var i = 0; i < this.update.length; i++) {
			this.update[i](this);
		}
		
		var f = this.nextFrame() || this.frames[0];
		
		if (f.w == 0) {
			f.w = this.img.width;
		}
		
		if (f.h == 0) {
			f.h = this.img.height;
		}
		
		scaleW = scaleW || 1;
		scaleH = scaleH || 1;
		
		ctx.drawImage(this.img, f.x, f.y, f.w, f.h, this.x * scaleW, this.y * scaleH, f.w * scaleW, f.h * scaleH);
	},
	
	newAnimation: function(name, string) {
		var isDigit = function(val) {
			return (val && val.match(/^[0-9]+$/)) ? true : false;
		}
		
		var isWs = function(val) {
			return (val && val.match(/^\s+$/)) ? true : false;
		}
		
		var state = 'e';
		var animation = Animation();
		string = string || "";
		
		for (var i = 0; i < string.length; i++) {
			var c = string[i];
			
			if (isWs(c)) {
				state = 'e';
				continue;
			}
			
			if (state == 'e') {
				if (c == 'p' || c == 'P') {
					animation.push({val: 'p'});
					state = 'r';
					continue;
				}
				
				if (c == '{') {
					i--;
					state = '{';
					continue;					
				}
				
				if (isDigit(c)) {
					while (true) {
						var t = string[++i];
						if (isDigit(t)) {
							c += t;
						} else {
							i--;
							break;
						}
					}
					state = 'r';
					animation.push(new Frame(this.frames[c]));
					continue;
				}
				
				break;
			}
			
			if (state == 'r') {
				if (c == 'r' || c == 'R') {
					var frame = animation.pop();
					i++;
					c = string[i];
					if (isDigit(c)) {
						while (true) {
							var t = string[++i];
							if (isDigit(t)) {
								c += t;
							} else {
								i--;
								break;
							}							
						}
						frame.loop = c;
						animation.push(frame);
						state = 'e';
						continue;
					} else {
						frame.loop = -1;
						animation.push(frame);
						state = 'e';
						break;
					}
				} else {
					i--;
					state = 'e';
					continue;
				}
				break;
			}
			
			if (state == '{') {
				var stack = [];
				for (var n = string.length - 1; n > i; n--) {
					if (string[n] == '}') {
						stack.push(n);
					}
					if (string[n] == '{') {
						stack.pop();
					}
				}
				
				if (stack.length > 0) {
					var n = stack.pop();
					animation.push(this.newAnimation("$", string.substring(i + 1, n)));
					i = n;
					state = 'r';
					continue;
				} else {
					break;
				}
			}
		}
		
		this.animations[name] = animation;
		return animation;
	}
};

Sprite.Fps25Interval = 40;
Sprite.Fps50Interval = 20;
