var pl = {
	resources: [],
	length: 0,
	finished: 0,
	iid: 0,
	
	canvas: {},
	
	onload: {},
	
	draw: function() {
		pl.canvas.width = pl.canvas.width;
		var ctx = pl.canvas.getContext('2d');
		ctx.fillText(pl.finished + " out of " + pl.length, 50*pl.finished, 50);
	},
	
	check: function() {
		var complete = function(a) {
			return (a.complete || (a.img && a.img.complete) || a.readyState == 4);
		};
	
		var sorts = function(a, b) {
			if (complete(a))
				return -1;
			else if (complete(b))
				return 1;
			else
				return 0;
		};
		
		pl.resources.sort(sorts);
		
		var temp = pl.resources.shift();
		while (temp && complete(temp)) {
			pl.finished++;
			temp = pl.resources.shift();
		}
		pl.resources.push(temp);
		
		if (pl.finished == pl.length) {
			clearInterval(pl.iid);
			pl.onload();
		}
	},
	
	init: function(r, c, ol) {
		pl.resources = r;
		pl.length = r.length;
		pl.canvas = c;
		pl.onload = ol;
		pl.iid = setInterval(pl.check, 10);
	}
};