myBool = false
mouseX = 0
mouseY = 0
toggleColor = false
baseSize = 15
shuffleDone = false

$(document).ready(function(){
	createBubbles(50);

	$('.num').mousemove(function(e){
		var newNum = e.target.value;
		changeBubbleNum(newNum)
	})

	$('.disco').change(function(e){
		toggleColor = !toggleColor
	})

	$('.size').mousemove(function(e){
		var newSize = e.target.value;
		if(newSize !== baseSize){
			baseSize = newSize
			resizeBubbles(newSize);
		}
	})

	$('.shuffle').click(function(){
		$('.shuffle').attr('disabled', 'disabled');
		clearInterval(moveInterval);
		var bubbles = $('.bubble');
		var promises = [];

		for(var i=0, l=bubbles.length; i<l; i++){
			var vertical = random(800),
				left = random(1600),
				pro = new Promise((resolve, reject) => {
					$(bubbles[i]).animate({
						left: left,
						top: vertical
					}, 1500, function(){
						resolve('done')
					});
				});
			promises.push(pro);
		}

		Promise.all(promises).then( values => {
			moveInterval = setInterval(moveStuff, 50);
			$('.shuffle').removeAttr('disabled')
		});
	})

	$('body').mousemove(function(e){
		mouseX = e.clientX
		mouseY = e.clientY	
	})

	$(document).click(() => myBool = !myBool);
	var moveInterval = setInterval(moveStuff, 100);
});

function changeBubbleNum(newNum){
	var	diff = newNum - getBubbles().length;

	(diff > 0) ? createBubbles(diff) : removeBubbles(diff)
}

function removeBubbles(diff){
	var bubbles = getBubbles();

	for(var i = 0; i < Math.abs(diff); i++){
		$(bubbles[i]).remove();
		var sound = $('.bubble-sound')[0]
		if(sound && sound.duration > 0) sound.currentTime = 0;
		sound.play()
	}
}

function resizeBubbles(newSize) {
	var bubbles = getBubbles()

	for(var i=0, l=bubbles.length; i<l; i++){
		var newWidth = Math.round(Math.random() * 50) + parseInt(newSize) + 'px';
		$(bubbles[i]).css('height', newWidth);
		$(bubbles[i]).css('width', newWidth);
	}
}

function createBubbles(n){
	for(var i = n; i>0; i--){
		var width= random(50, parseInt(baseSize)),
			vertical = random(800),
			left = random(1600);

		$('.bubble-box').append(`<div class='bubble' style='background-color: ${randomColor()}; height: ${width}px; width: ${width}px; top: ${vertical}px; left: ${left}px;'></div>`)
	}
	return $('.bubble')
}

function getBubbles(){
	return $('.bubble')
}

function moveStuff(){
	var bubbles = getBubbles();

	for(var i = 0, l = bubbles.length; i < l; i++){
		var bubbleX = $(bubbles[i]).offset().left,
			bubbleY = $(bubbles[i]).offset().top,
			distanceX = Math.abs(mouseX - bubbleX),
			distanceY = Math.abs(mouseY - bubbleY);
			if(myBool){
				var directionX = mouseX > bubbleX ? 1 : -1
				var directionY = mouseY > bubbleY ? 1 : -1
			} else {
				var directionX = mouseX > bubbleX ? -1 : 1
				var directionY = mouseY > bubbleY ? -1 : 1
			}

		if(distanceX > 5 || distanceY > 5){

			if(bubbleX > 0 && bubbleX < 1600 && bubbleY > 0 && bubbleY < 800){
				if(toggleColor){
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
				// var rand = Math.random() * 2 + 1
				var newX = bubbleX + directionX * width * 1.34 * Math.log(distance * distanceX)/distance
				var newY = bubbleY + directionY * width * 1.34 * Math.log(distance * distanceY)/distance


				// var newX = bubbleX + directionX * (Math.log((distanceX*distanceY)/(distanceX+distanceY)) * 100/distanceY);
				// var newY = bubbleY + directionY * (Math.log((distanceX*distanceY)/(distanceY+distanceX)) * 100/distanceX);
				

				// var newX = bubbleX + directionX * (width * width)/(7 * Math.sqrt( Math.pow(distanceY, 2) + Math.pow(distanceX, 2)));
				// var newY = bubbleY + directionY * (width * width)/(7 * Math.sqrt( Math.pow(distanceY, 2) + Math.pow(distanceX, 2)));
				
				$(bubbles[i]).finish()
				$(bubbles[i]).animate({
					left: newX,
					top: newY
				}, 100)
			} else {
				$(bubbles[i]).css('left', Math.round(Math.random() * 1600))
				$(bubbles[i]).css('top', Math.round(Math.random() * 800))
				
			}
		}
	}
}