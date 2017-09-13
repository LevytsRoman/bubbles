function random(max = 1, min = 0){
	return Math.round(Math.random() * max) + min
}

function randomColor(){
	var r = random(255)
		g = random(255),
		b = random(255),
		a = random(10)/10;
	return `rgba(${r}, ${g}, ${b}, ${a})`
}