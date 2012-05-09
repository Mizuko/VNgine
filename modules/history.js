//Basic history
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
}