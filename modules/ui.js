//User Interface--textbox, menus, and such fancies, played out in a state machine
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
};