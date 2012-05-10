(function() {
var vn = vn || {}; 

//Base class and general methods
vn = {
	config: {},
	
	history: {},
	source: {},

	main: {},
	ui: {},
	
	init: function() {
		vn.canvas = document.getElementById('vpc');
		vn.ctx = vn.canvas.getContext('2d');
		//vn.text.clock = vn.config.textSpeed;
		
		vn.source.init();
		
		//prototype	  
		resources = [new Sprite(0, 0, "catgrump.jpg"), vn.source.cg, new Image(), new Image(), new Image()];
		resources[2].src = "catstare.jpg";
		resources[3].src = "catgrump.jpg";
		resources[4].src = "catscreen.png";
		//prototype
		
		pl.init(resources.slice(0), vn.canvas, function() {
			setInterval(vn.draw, Sprite.Fps25Interval);
			setInterval(vn.update, 1);
			vn.advanceSource();
			vn.ui.switchState("text");
		});
		
		vn.adjust();
		window.addEventListener("resize", vn.adjust, false);
	},
	
	//Finishes displaying the text, or advances to the next text line
	advance: function() {
		if (vn.main.complete()) {
			vn.advanceSource();
		} else {
			vn.main.finish();
		}
	},
	
	//Read the next state from the source
	advanceSource: function() {
		this.source.advance();
	},
	
	//Routine draw and updates
	draw: function() {
		if (vn.config.sW +  vn.config.sH > 0) {
			vn.canvas.width = vn.config.sW;
			vn.canvas.height = vn.config.sH;
			vn.config.sW = 0; vn.config.sH = 0;
		}
		vn.ctx.clearRect(0, 0, vn.canvas.width, vn.canvas.height);
	
		vn.main.draw(vn.ctx);
		vn.ui.draw(vn.ctx);
	},
	
	//Advances clock
	update: function() {
		vn.main.update();
	},

	
	setText: function(str) {
		vn.main.setText(str);
	},
	  
	//Correctly sets linebraks in a string of text
	textFormat: function(str) {
		var splitup = str.split(" ");
		var totalSpace = 10 * vn.config.wScale * (vn.config.wTextBox / vn.config.fontSize);
		var spaceleft = totalSpace
		str = "";
		for (var i = 0; i < splitup.length; i++) {
			var curWidth = vn.ctx.measureText(splitup[i] + " ").width;
			if (curWidth > spaceleft) {
				spaceleft = totalSpace - curWidth;
				str += "\n";      
			} else {
				spaceleft -= curWidth;        
			} 
			str += splitup[i] + " ";       
		}
		return str;
	},
	
	//Adjusts the vn bounds to the browser window
	adjust: function() {
		var w, h;
		
		if (typeof(window.innerWidth) == 'number') {
			w = window.innerWidth;
			h = window.innerHeight;
		} else if (document.documentElement && document.documentElement.clientWidth) {
			w = document.documentElement.clientWidth;
			h = document.documentElement.clientHeight;
		} else {
			w = document.body.clientWidth;
			h = document.body.clientHeight;
		}
		
		if (!w ) {
			return;
		}
		
		//give it a border for visible vs total space
		w -= vn.config.border;
		h -= vn.config.border;
		
		//scale it to what we want percent-wise        
		w = Math.round(w * vn.config.sPercentW);
		h = Math.round(h * vn.config.sPercentH);
		
		//ratio setting
		var wr = vn.config.sRatioW,
		hr = vn.config.sRatioH;
		
		if (w * hr != h * wr) {
			if (w * hr < h * wr) {
				h = hr * w / wr;     
			} else {
				w = wr * h / hr;
			}
		}
		
		vn.config.sW = w;
		vn.config.sH = h; 
		vn.config.wScale = w/vn.config.wDefault;
		vn.config.hScale = h/vn.config.hDefault;
		vn.config.fontSize = w / 40;
	}
};//User Interface--textbox, menus, and such fancies, played out in a state machine
vn.ui = {
	//all states should have enter, draw, and exit functions
	text: {},
	menu: {},
	log: {},
	
	state: "text",

	switchState: function(state) {
		this[this.state].exit();
		this.state = state;
		this[this.state].enter();
	},

	draw: function(ctx) {
		this[this.state].draw(ctx);
	}
};

//The ui centered around the text box
vn.ui.text = {
	draw: function(ctx) {
		
	},

	enter: function() {
		vn.main.unfreeze();
		this.addListeners();
		vn.main.showText();
	},

	exit: function() {
		this.removeListeners();
	},

	addListeners: function() {
		vn.canvas.addEventListener("mousedown", this.clickHandle, false);
		vn.canvas.addEventListener("mousewheel", this.scrollHandle, false);
		vn.canvas.addEventListener("DOMMouseScroll", this.scrollHandle, false);
		document.body.addEventListener("keydown", this.keyHandle, false);
	},
	
	removeListeners: function() {
		vn.canvas.removeEventListener("mousedown", this.clickHandle, false);
		vn.canvas.removeEventListener("mousewheel", this.scrollHandle, false);
		vn.canvas.removeEventListener("DOMMouseScroll", this.scrollHandle, false);
		document.body.removeEventListener("keydown", this.keyHandle, false);
	},
	
	//Handles mouse clicks to advance or show menu
	clickHandle: function(event) {
		switch (event.button) {
			case 0: //Left
				vn.advance();
				break;
			case 1: //Middle
				break;
			case 2: //Right
				vn.ui.switchState("menu");
				break;
		}
	},
	
	//Handles keyboard input to advance or show log
	keyHandle: function(event) {
		var keyCode = (event.hasOwnProperty("which")) ? event.which : event.keyCode;
		switch (keyCode) {
			case 13: //enter
			case 39: //right
			case 40: //down
				vn.advance();
				break;
			case 37: //left
			case 38: //up
				vn.ui.switchState("log");
				break;
			default:
				break;
		}
	},
	
	//Handles mousewheel scrolling to advance or show log
	scrollHandle: function(event) {
		event.hasOwnProperty("wheelDelta")
			? event.wheelDelta < 0  
				? vn.advance() 
				: vn.ui.switchState("log")
			: event.detail > 0  
				? vn.advance() 
				: vn.ui.switchState("log")
		;
	}
};

//The menu for the user interface
vn.ui.menu = {
	draw: function(ctx) {
		
	},
	
	enter: function() {
		vn.main.freeze();
		vn.main.hideText();
		this.addListeners();
	},

	exit: function() {
		this.removeListeners();
	},

	addListeners: function() {
		vn.canvas.addEventListener("mousedown", this.clickHandle, false);
	},
	
	removeListeners: function() {
		vn.canvas.removeEventListener("mousedown", this.clickHandle, false);
	},
	
	clickHandle: function() {
		vn.ui.switchState("text");
	}
};

//The log state for the user interface
vn.ui.log = {	
	draw: function(ctx) {
		vn.history.draw(ctx);
	},

	enter: function() {
		vn.main.freeze();
		vn.main.hideText();
		this.addListeners();
	},

	exit: function() {
		this.removeListeners();
	},
	
	addListeners: function() {
		vn.canvas.addEventListener("mousedown", this.clickHandle, false);
		vn.canvas.addEventListener("mousewheel", this.scrollHandle, false);
		vn.canvas.addEventListener("DOMMouseScroll", this.scrollHandle, false);
		document.body.addEventListener("keydown", this.keyHandle, false);
	},
	
	removeListeners: function() {
		vn.canvas.removeEventListener("mousedown", this.clickHandle, false);
		vn.canvas.removeEventListener("mousewheel", this.scrollHandle, false);
		vn.canvas.removeEventListener("DOMMouseScroll", this.scrollHandle, false);
		document.body.removeEventListener("keydown", this.keyHandle, false);
	},
	
	clickHandle: function(event) {
		switch (event.button) {
			case 0: //Left
				vn.ui.switchState("text");
				break;
			case 1: //Middle
				break;
			case 2: //Right
				vn.ui.switchState("menu");
				break;
		}
	},
	
	keyHandle: function(event) {
		var keyCode = (event.hasOwnProperty("which")) ? event.which : event.keyCode;
		switch (keyCode) {
			case 13: //enter
			case 39: //right
			case 37: //left
				vn.ui.switchState("text");
				break;
			case 38: //up
				vn.history.scrollUp();
				break;
			case 40: //down
				vn.history.scrollDown();
				break;
			default:
				break;
		}
	},
	
	scrollHandle: function(event) {
		event.hasOwnProperty("wheelDelta")
			? event.wheelDelta < 0  
				? vn.history.scrollDown()	//down
				: vn.history.scrollUp()		//up
			: event.detail > 0  
				? vn.history.scrollDown()	//down
				: vn.history.scrollUp()		//up
		;
	}
};//The source of the vn, essentally a list of commands for the engine to execute
//Prototype source; runs cats
vn.source = {
	
	init: function() {
		this.catIndex = 0;
		this.cats = [];
		this.catsText = [];
				
		this.cg = new Sprite(400, 100, "sprite0_strip100.png", 0, 0, 85, 70);
		this.cats[0] = [new Sprite(0, 0, "catgrump.jpg"), this.cg];
		this.cats[1] = [new Sprite(0,0, "catsit.gif"), new Sprite(400,100, "catscreen.png"), this.cg];
		this.cats[2] = [new Sprite(0,0, "catsit.gif"), new Sprite(400,100, "catscreen.png"), this.cg];
		this.cats[3] = [new Sprite(0,0, "catsit.gif"), new Sprite(400,100, "catscreen.png"), this.cg];
		this.cats[4] = [new Sprite(0,0, "catgrump.jpg"), this.cg];
		this.cats[5] = [new Sprite(0,0, "catside.jpg"), new Sprite(50,50, "catstare.jpg"), this.cg];
		this.cats[6] = [new Sprite(50,50, "catstare.jpg"), new Sprite(0,0, "catside.jpg"), this.cg];  
		this.cats[7] = [this.cg];
		  
		var anime = "{0 ";
		for (var i = 1; i < 100; i += 2) {
			this.cg.addFrame(i * 85, 0, 85, 70);
			anime += i + " ";
		}
		anime += "}";
		this.cg.newAnimation("spin", anime);
		this.cg.newAnimation("twitch", "{0 1 2 3 4 5 6 7 8 9 10 9 8 7 6 5 4 3 2 1}r");
		this.cg.play("twitch");
				  
		this.catsText[0] = "Grumpy Cat: Miau!  Mi-miau-miau-miau miaau miaaau miau miau."; //Sirs! The princesses are escaping!
		this.catsText[1] = "Left Cat: Nyan.  Nya-nya-nyaaa nya-nya nya."; //Bah.  This is most unpleasent.
		this.catsText[2] = "Cat on Telecommunicator: Mew mew mewmewmew.  Mewmew meew meeew meeeew.";  //Let them go for now. They will not get far.
		this.catsText[3] = "Left Cat: Nyanfred.  Nyan nya nyan nyanyans nyan-nya nyan."; //Alfred.  Send our most skilled pilots after them
		this.catsText[4] = "Grumpy Cat: MIAU MIAU!"; //Yes sir!
		this.catsText[5] = "Stacked Cat I:Meeeeow.  Mew meow meow meeeeow."; //Maan, this is dumb
		this.catsText[6] = "Stacked Cat II: Maow.  Maow maaaow maaaow maow maow. Maow maowmaowmaow maow maow maow-maow maow maowmaowowow. Mao maow, maow mao!";  //Quiet.  This is your patriotic duty.  Where would this country be without it's princesses?  No where, that's where!  
		this.catsText[7] = "And so it begins..."
	},
	
	advance: function() {
		vn.history.addEntry(new HistoryTextEntry(this.catsText[this.catIndex]));
		vn.setText(this.catsText[this.catIndex]);
		vn.main.clear();
		vn.main.addImages(this.cats[this.catIndex++], 0);
		if (this.catIndex == this.cats.length) {
			this.catIndex = 0;
		}
	}
};
//Collection of images in the main part of the window
vn.main = {
	images: {},
	
	frozen: false,
	frozenImg: {},
	frozenCtx: {},

	text: {},

	draw: function(ctx) {
		var sH = vn.config.hScale,
			sW = vn.config.wScale;
		if (this.frozen) {
			ctx.drawImage(this.frozenImg, 0, 0, this.frozenImg.width * sW, this.frozenImg.height * sH);
		} else {
			for (var i = 0; i <  this.images.length(); i++) {
				var img = this.images.get(i);
				if (img.draw) {
					img.draw(ctx, sW, sH);
				}
				else if(img.width) {
					ctx.drawImage(img, 0, 0, img.width * sW, img.height * sH); 	
				}
			}
		}

		this.text.draw(ctx);
	},
	
	freeze: function() {
		if (!this.frozen) {
			if (!(this.frozenImg.tagName && this.frozenImg.tagName.toUpperCase() == "CANVAS")) {
				this.frozenImg = document.createElement("canvas");
				this.frozenCtx = this.frozenImg.getContext('2d');
			}
			this.frozenImg.width = vn.config.wDefault;
			this.frozenImg.height = vn.config.hDefault;
			
			for (var i = 0; i <  this.images.length(); i++) {
				var img = this.images.get(i);
				if (img.draw) {
					img.draw(this.frozenCtx, 1, 1);
				}
				else if(img.width) {
					this.frozenCtx.drawImage(img, 0, 0, img.width , img.height); 	
				}
			}
			
			this.frozen = true;
			this.text.frozen = true;
		}
	},
	
	unfreeze: function() {
		this.frozen = false;
		this.text.frozen = false;
	},

	showText: function() {
		this.text.visible = true;
	},

	hideText: function() {
		this.text.visible = false;
	},
	
	setText: function(str) {
		this.text.set(str);
	},
	
	clear: function() {
		this.images.clear();
	},
	
	update: function() {
		this.text.update();
	},
	
	complete: function() {
		//possibly take into account animations in the future
		return this.text.complete();
	},

	finish: function() {
		//possibly finish animations
		this.text.finish();
	},
	
	addImage: function(img, depth) {
		this.images.addImage(img, depth);
		this.images.sort();
	},
	
	addImages: function(imgArray, depth) {
		var tenFactor = 1;
		while (tenFactor < imgArray.length) {
			tenFactor = tenFactor * 10;
		}
		
		for (var i = 0; i <  imgArray.length; i++) {
			this.images.addImage(imgArray[i], depth + (i / tenFactor))
		}
		
		this.images.sort();
	}
};

//Depth based image list
vn.main.images = {
	images: [],
	
	clear: function() {
		this.images.splice(0, this.images.length);
	},
	
	get: function(i) {
		return this.images[i].image;
	},
	
	length: function() {
		return this.images.length;
	},
	
	addImage: function(img, depth) {
		this.images.push({image: img, d: depth});
	},
	
	sort: function() {
		this.images.sort(function(a,b) { return a.d - b.d; });
	}
};

//Text box
vn.main.text = {
	clock: 0,
	index: 0,
	
	display: "",
	pallet: "",
	
	frozen: false,
	visible: true,
	
	draw: function(ctx) {
		if (!this.visible) {
			return;
		}

		ctx.save();
		var c = vn.config;
		var left = (c.wDefault - c.wTextBox)/2;
		var top = (c.hDefault - c.hTextBox) - left;
		
		ctx.fillStyle = c.cTextBox;
		ctx.fillRect(left * c.wScale, top * c.hScale, c.wTextBox * c.wScale, c.hTextBox * c.hScale)
		
		c.setFont(ctx);
		
		var split = this.display.split("\n");
		for (var i = 0; i < split.length; i++) {
		  ctx.fillText(split[i], (left + ((c.fontSizeBase) / 2)) * c.wScale, (top + (c.fontSizeBase * (i + 0.25))) * c.hScale);
		}
		
		ctx.restore();
	},
	
	//Updates the clock and displayed text
	update: function() {
		if (!this.frozen && !this.complete()) {
			if (vn.config.textSpeed == -1) {
				this.display = this.pallet;
			} else if (this.clock-- == 0) {
				this.clock = vn.config.textSpeed;
				this.display += this.pallet.charAt(this.index++);
			}
		}
	},
	
	//Returns true if the text is displaying everything
	complete: function() {
		return this.pallet.length <= this.display.length;
	},
	
	//Makes the text display nothing
	reset: function() {
		this.clock = 0;
		this.index = 0;
		this.display = "";
	},
	
	//Makes the text display all in the pallet
	finish: function() {
		this.display = this.pallet;
	},
	
	//Resets and sets the pallet to the given string, formatted
	set: function(str) {
		this.reset();
		this.pallet = vn.textFormat(str);
	}
};//Basic history
//only supports non-interactive entries
//doesn't support partial scrolling
vn.history = {
	entries: [],
	
	logCanvas: {},
	logContext: {},
	
	position: 0,
	
	addEntry: function(entry) {
		this.entries.push(entry);
		if (this.entries.length > vn.config.historySize) {
			this.entries.splice(0,1);
		}
	},
	
	draw: function(ctx) {
		var top, left;
		var c = vn.config;
		
		left = (c.wDefault - c.wHistory)/2;
		top = (c.hDefault - c.hHistory)/2;
		
		if (!(this.logCanvas.tagName && this.logCanvas.tagName.toUpperCase() == "CANVAS")) {
			this.logCanvas = document.createElement("canvas");
			this.logContext = this.logCanvas.getContext('2d');
		}
		
		this.logCanvas.width = c.wHistory * c.wScale;
		this.logCanvas.height = c.hHistory * c.hScale;
		
		this.logContext.fillStyle = c.cTextBox;
		this.logContext.fillRect(0, 0, c.wHistory * c.wScale, c.hHistory * c.hScale);
		
		c.setFont(this.logContext);
		this.logContext.textBaseline = 'bottom';
		
		var index = this.entries.length - this.position - 1;
		var remainingHeight = this.logCanvas.height;
		
		while (index >= 0 && remainingHeight > 0) {
			var entry = this.entries[index];
			remainingHeight = remainingHeight - entry.height(this.logContext, c.hScale);
			entry.draw(this.logContext, 0, remainingHeight, c.wScale, c.hScale);
			remainingHeight = remainingHeight - (c.historyGap * c.hScale);
			index--;
		}
		
		ctx.drawImage(this.logCanvas, left, top, this.logCanvas.width, this.logCanvas.height);
	},
	
	scrollUp: function(i) {
		if (!isNaN(parseFloat(i)) && isFinite(i) && i > 1) {
			this.scrollUp(--i);
		}
		
		if (this.position < this.entries.length - 1) {
			this.position++;
		}
	},
	
	scrollDown: function(i) {
		if (!isNaN(parseFloat(i)) && isFinite(i) && i > 1) {
			this.scrollDown(--i);
		}
		
		if (this.position != 0) {
			this.position--;
		}
	}
};

function HistoryTextEntry(str) {
	this.string = vn.textFormat(str).split("\n");
	this.fontSize = vn.config.fontSizeBase;
	
	this.height = function(ctx, hScale) {
		return this.string.length * this.fontSize * hScale;
	};
	
	this.draw = function(ctx, left, top, wScale, hScale) {
		for (var i = 0; i < this.string.length; i++) {
		  ctx.fillText(this.string[i], left + (this.fontSize / 2 * wScale), top + (this.fontSize * i * hScale));
		}
	};
}

function HistoryImageEntry(img) {
	this.image = img;
	
	this.height = function(ctx, hScale) {
		return this.image.height * hScale;
	};
	
	this.draw = function(ctx, left, top, wScale, hScale) {
		ctx.drawImage(this.image, left, top, this.image.width * wScale, this.image.height * hScale);
	};
}//Configurations and settings
vn.config = {	
	//0-1 , decimal % of screen to take up.  Ratio has priority
	//Set by operator
	sPercentW: 1,
	sPercentH: 1,
	
	//The screen ratio graphics should be displayed at, ie 4:3, 16:9
	//Set by operator
	sRatioW: 4,
	sRatioH: 3,

	//A border so the canvas area doesn't underlap the sides of it's container
	//Set by operator
	border: 15,
		
	//The resolution the graphics were designed for.
	//Set by operator
	wDefault: 800,
	hDefault: 600,
	
	//The width and height of the text box at default resolution
	//Set by operator
	wTextBox: 750,
	hTextBox: 175,
	
	//The width and height of the history at default resolution
	//Set by operator
	wHistory: 750,
	hHistory: 550,

	//The size of the text history, in text boxes
	//Set by operator
	historySize: 60,
	
	//The gap between the entries in the history, in unscaled pixels
	//Set by operator
	historyGap: 25,
	
	//The display width and height, and flags to trigger size change.
	//Set by program.
	sW: this.wDefault,
	sH: this.hDefault,
	
	//The scale conversion between the default resolution and current resolution
	//Set by program
	wScale: 1,
	hScale: 1,
	
	//The font of the text box's text
	//(Possibly) Set by progam
	fontType: "PTSansRegular",
	
	//The colors of the text and background of the text box
	//(Possibly) Set by program.
	cText: "rgba(255,255,255,1)",
	cTextBox: "rgba(0,0,0,.4)",
	
	//Text speed as number of frames to wait before next letter
	//(Possibly) Set by program
	textSpeed: 1,
	
	//The size of the font, varying on the screen width.
	//Set by program.
	fontSizeBase: 20,
	fontSize: this.fontSizeBase,
	
	setFont: function(ctx) {
		ctx.shadowOffsetX = -2;
	    ctx.shadowOffsetY = 2;
	    ctx.shadowBlur = 2;
	    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
	    ctx.font = this.fontSize + "px " + this.fontType;
	    ctx.fillStyle = this.cText;
	    ctx.textBaseline = 'top';
	}	
};
vn.init();})();