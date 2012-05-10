//Configurations and settings
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
