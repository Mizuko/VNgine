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
};