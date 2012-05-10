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
};