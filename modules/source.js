//The source of the vn, essentally a list of commands for the engine to execute
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
