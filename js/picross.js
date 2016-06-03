var intervalID = -1;

// Generate new Puzzle
$("#btn-generate").click(start);

// Returns a jagged 2D array like the following: array[rows][numOfHints]
function getHorizontalHints(x,y,puzzle) {
	var horizontalHints = [];
	var index = 0;
	var num = 0;
	var previousIsHit = false;

	for(var i = 0; i < x; i++) {
		horizontalHints[i] = [];
		for(var j = 0; j < y; j++) {
			// if it is a hit
			if(puzzle[i][j] === "H") {
				// check if previous is also a hit
				if(previousIsHit) {
					num++; //if so, add to the current num
					// edge case
				} else {
					num = 1; //initalize hit
				}
				previousIsHit = true; // after doing things, set hit to true
			}
			// if not a hit
			else {
				if(previousIsHit) {
					horizontalHints[i][index] = num; // set first hint
					num = 0;	// reset num
					index++;	// move to next hint
				}
				previousIsHit = false; // after doing things, set hit to false
			}

			// edge case
			if((j+1) == y && num != 0) {
				horizontalHints[i][index] = num; // set first hint
			}
		}
		// reset params
		index = 0;
		num = 0;
		previousIsHit = false;
	}

	return horizontalHints;
}

// Returns a jagged 2D array like the following: array[rows][numOfHints]
function getVerticalHints(x,y,puzzle) {
	var verticalHints = [];
	var index = 0;
	var num = 0;
	var previousIsHit = false;

	for(var i = 0; i < x; i++) {
		verticalHints[i] = [];
		for(var j = 0; j < y; j++) {
			// if it is a hit
			if(puzzle[j][i] === "H") {
				// check if previous is also a hit
				if(previousIsHit) {
					num++; //if so, add to the current num
					// edge case
				} else {
					num = 1; //initalize hit
				}
				previousIsHit = true; // after doing things, set hit to true
			}
			// if not a hit
			else {
				if(previousIsHit) {
					verticalHints[i][index] = num; // set first hint
					num = 0;	// reset num
					index++;	// move to next hint
				}
				previousIsHit = false; // after doing things, set hit to false
			}

			// edge case
			if((j+1) == y && num != 0) {
				verticalHints[i][index] = num; // set first hint
			}
		}
		// reset params
		index = 0;
		num = 0;
		previousIsHit = false;
	}

	return verticalHints;
}

function drawPuzzle(x, y, puzzle, hHints, vHints) {
	var hit = '<button class="btn-picross" value="H"></button>';
	var miss = '<button class="btn-picross" value="M"></button>';

	var max = -1;
	for(var i = 0; i < vHints.length; i++) {
		if(vHints[i].length > max)
			max = vHints[i].length;
	}

	var width = -1;
	for(var i = 0; i < hHints.length; i++) {
		if(hHints[i].length > width)
			width = hHints[i].length;
	}

	var buffer = '<div><div style="width: ' + (width * 20) + 'px; height: 20px; display: inline-block;"></div>';
	var topHints = buffer + '<div style="width: ' + (x * 20) + 'px; height: ' + (max * 20) + 'px; display: inline-block;">';
	for(var i = 0; i < max; i++) {
		var topBox = "";
		for(var j = 0; j < vHints.length; j++) {
			topBox = '<div style="float:left; text-align: center; vertical-align: middle; width: ' + 100 / x + '%; height: 20px;">';
			if(vHints[j][i] != undefined) {
				topBox += vHints[j][i];
			}
			topBox += '</div>'
			topHints += topBox;
		}
		topHints += "<br>";
	}
	topHints += "</div></div>";

	var sideHints = '<div><div style="float: left; width: ' + (width * 20) + 'px; height: ' + (y * 20) + 'px; display: inline-block;">';
	for(var i = 0; i < x; i++) {
		var line = "";
		for(var j = 0; j < y; j++) {
			if(j < width) {
				line = '<div style="float:left; text-align: center; vertical-align: middle; width: ' + 100 / width + '%; height: 20px;">';
				if(hHints[i][j] != undefined) {
					line += hHints[i][j];
				}
				line += '</div>';
				sideHints += line;
			}
		}
		sideHints += '<br>';
	}
	sideHints += "</div>"

	var buttons = '<div id="grid" style="width: ' + (x * 20) + 'px; height: ' + (y * 20) + 'px; display: inline-block;">';
	for(var i = 0; i < x; i++) {
		var line = "";
		for(var j = 0; j < y; j++) {
			if(puzzle[i][j] === "H") {
				line += hit;
			} else {
				line += miss;
			}
		}
		buttons += line + "<br>";
	}
	buttons += "</div></div>"

	var full = '<div id="picross">' + topHints + sideHints + buttons + '</div>';

	$("#picross").replaceWith(full);
}

function setHitResponse(puzzle) {
	$(".btn-picross").mousedown(function(event) {
		// check click type
		switch (event.which) {
			// left click
			case 1:
				if($(this).hasClass('off')) {
					$(this).toggleClass('off');
				} else {
					$(this).toggleClass('on');
				}
				break;
			// right click
			case 3:
				if($(this).hasClass('on')) {
					$(this).toggleClass('on');
				} else {
					$(this).toggleClass('off');
				}
				break;
			// what happened even
			default:
				console.log('You have a strange Mouse!');
		}
		if(checkGameOver(puzzle)) {
			winningAnimation();
		}
	});
}

function checkGameOver(solution) {
	//setup 2D array
	var puzzle = [];
	for(var i = 0; i < solution.length; i++) {
		puzzle[i] = [];
	}

	var x = solution.length;
	var y = solution[0].length;

	$("#grid button").each(function(index) {
	  if($(this).hasClass('on')) {
			puzzle[index % x][Math.floor(index / y)] = "H";
		} else {
			puzzle[index % x][Math.floor(index / y)] = "M";
		}
	});

	for(var i = 0; i < x; i++) {
		for (var j = 0; j < y; j++) {
			if(puzzle[j][i] != solution[i][j])
				return false;
		}
	}
	return true;
}

function winningAnimation() {
	console.log("WINNER");
	intervalID = setInterval(function() {
		$('#grid .on').css("background-color", rgb(randInt(0,255), randInt(0,255), randInt(0,255)));
	}, 500);

	var playAgain = '<h4>Winner!</h4><br><button id="btn-playagain">Play Again?</button>';

	$('#picross').append(playAgain);
	$("#btn-playagain").click(start);
}

function rgb(r,g,b) {
	return "rgb(" + r + "," + g + "," + b + ")";
}

// from Mozilla Developer Network
function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function start() {
	console.log(intervalID);
	clearInterval(intervalID);

	var puzzleSize = parseInt($("#puzzle-size option:selected").val());

	var x, y;
	// 1 = 10x10, 2=15x10, 3=15x15, 4=20x15, 5=20x20
	switch(puzzleSize) {
		case 1:
			x = 5; y = 5; break;
		case 2:
			x = 10; y = 10; break;
		case 3:
			x = 15; y = 15; break;
		case 4:
			x = 20; y = 20; break;
		case 5:
			x = 25; y = 25; break;
	}

	var puzzle = [];

	// create 2d array of puzzle
	for(var i = 0; i < x; i++) {
		puzzle[i] = [];
		for(var j = 0; j < y; j++) {
			if(Math.random() >= 0.4) {
				puzzle[i][j] = "H";
			} else {
				puzzle[i][j] = "M";
			}
		}
	}

	var horizontalHints = getHorizontalHints(x, y, puzzle);
	var verticalHints = getVerticalHints(x, y, puzzle);

	drawPuzzle(x,y,puzzle,horizontalHints, verticalHints);

	setHitResponse(puzzle);
}
