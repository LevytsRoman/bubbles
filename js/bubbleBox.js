var BubbleBox = function(args = {}){
	this.createBubbles(args.num);
	this.mouseX = 0
	this.mouseY = 0
	this.myBool = true
	this.toggleColor = false
	this.baseSize = 15
	this.shuffleDone = false
	this.start()
}

BubbleBox.prototype.createBubbles = function(n){
	for(var i = n; i>0; i--){
		var width= random(50, this.baseSize),
			vertical = random(800),
			left = random(1600);

		$('.bubble-box').append(`<div class='bubble' style='background-color: ${randomColor()}; height: ${width}px; width: ${width}px; top: ${vertical}px; left: ${left}px;'></div>`)
	}
	this.bubbles = $('.bubble');
}

BubbleBox.prototype.resizeBubbles = function(newSize) {
	var bubbles = this.bubbles;

	for(var i = 0, l = bubbles.length; i < l; i++){
		var newWidth = random(50) + newSize + 'px';
		$(bubbles[i]).css({'height': newWidth, 'width': newWidth});
	}
}

BubbleBox.prototype.start = function(){
	this.addLesteners();
	this.moveInterval = setInterval(this.moveBubbles.bind(this), 50);
}

BubbleBox.prototype.addLesteners = function(){
	$('body').mousemove(e => {this.mouseX = e.clientX; this.mouseY = e.clientY});
	$('.disco').change(e => this.toggleColor = !this.toggleColor);
	$('.num').mousemove(e => this.changeBubbleNum(e.target.value));
	$('.size').mousemove(e => {
		var newSize = parseInt(e.target.value);
		if(newSize !== this.baseSize){
			this.baseSize = newSize
			this.resizeBubbles(newSize);
		}
	});

	$('.shuffle').click(() => {
		$('.shuffle').attr('disabled', 'disabled');
		clearInterval(this.moveInterval);
		var bubbles = $('.bubble');
		var promises = [];

		for(var i=0, l=bubbles.length; i<l; i++){
			var vertical = random(800),
				left = random(1600),
				pro = new Promise((resolve, reject) => {
					$(bubbles[i]).animate({
						left: left,
						top: vertical
					}, 1000, function(){
						resolve()
					});
				});
			promises.push(pro);
		}

		Promise.all(promises).then( values => {
			this.moveInterval = setInterval(this.moveBubbles.bind(this), 50);
			$('.shuffle').removeAttr('disabled')
		});
	});

	$('.direction').change(() => this.myBool = !this.myBool);
}

BubbleBox.prototype.moveBubbles = function(){
	var bubbles = this.bubbles;

	for(var i = 0, l = bubbles.length; i < l; i++){
		var bubbleX = $(bubbles[i]).offset().left,
			bubbleY = $(bubbles[i]).offset().top,
			distanceX = Math.abs(this.mouseX - bubbleX),
			distanceY = Math.abs(this.mouseY - bubbleY);

			if(this.myBool){
				var directionX = this.mouseX > bubbleX ? 1 : -1
				var directionY = this.mouseY > bubbleY ? 1 : -1
			} else {
				var directionX = this.mouseX > bubbleX ? -1 : 1
				var directionY = this.mouseY > bubbleY ? -1 : 1
			}

		if(distanceX > 5 || distanceY > 5){

			if(bubbleX > 0 && bubbleX < 1600 && bubbleY > 0 && bubbleY < 800){
				if(this.toggleColor){
					$(bubbles[i]).css('background-color', randomColor())

					//************* random between urls too during discotime ************
					// url = ['url(https://t0.rbxcdn.com/8a51a240a385a2328fec5d37d6c8386a)','url(https://ci.memecdn.com/6832273.jpg)', 'url(https://t6.rbxcdn.com/7211a0f42ca5eb1a4c5b049629b4e350)'][Math.round(Math.random() * 2)]
					// $(bubbles[i]).css('background-image', url)
					// ******************************************************************
				}

				//come up with a much better way to repell bubbles

				// I have bubbleX, bubbleY, mouseX and mouseY
				var width = $(bubbles[i]).width();
				var distance = Math.sqrt( Math.pow(distanceY, 2) + Math.pow(distanceX, 2));

				// var newX = bubbleX + directionX * Math.log(distanceX)
				// var newY = bubbleY + directionY * Math.log(distanceY)

				var newX = bubbleX + 	directionX * width * 1.34 * Math.log(distanceY * distanceX)/distance
				var newY = bubbleY + directionY * width * 1.34 * Math.log(distanceX * distanceY)/distance

				// var newX = bubbleX + directionX * (Math.log((distanceX*distanceY)/(distanceX+distanceY)) * 100/distanceY);
				// var newY = bubbleY + directionY * (Math.log((distanceX*distanceY)/(distanceY+distanceX)) * 100/distanceX);

				// var newX = bubbleX + directionX * (width * width)/(7 * Math.sqrt( Math.pow(distanceY, 2) + Math.pow(distanceX, 2)));
				// var newY = bubbleY + directionY * (width * width)/(7 * Math.sqrt( Math.pow(distanceY, 2) + Math.pow(distanceX, 2)));
				
				$(bubbles[i]).finish()

				$(bubbles[i]).animate({
					left: newX,
					top: newY
				}, 10)
			} else {
				$(bubbles[i]).css('left', random(1600))
				$(bubbles[i]).css('top', random(800))
				
			}
		}
	}
}

BubbleBox.prototype.changeBubbleNum = function(newNum){
	var	diff = newNum - this.bubbles.length;
	(diff > 0) ? this.createBubbles(diff) : this.removeBubbles(diff)
}

BubbleBox.prototype.removeBubbles = function(diff){
	var bubbles = this.bubbles;
	for(var i = 0; i < Math.abs(diff); i++){
		$(bubbles[i]).remove();
		var sound = $('.bubble-sound')[0]
		if(sound && sound.duration > 0) {
			sound.currentTime = 0;
		};
		sound.play()
	}
	this.bubbles = $('.bubble')
}