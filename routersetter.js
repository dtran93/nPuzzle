
/*David Tran, Hw8, HOLDEN,NICHOLAS B 5.29.2013
This is the js file for fifteen.html*/

//animation wrapper method
(function() {
	"use strict";
	
	// makes the buttons call when clicked and set up puzzle
	window.onload = function(){
		document.getElementById("shufflebutton").onclick = shuffle;
		document.getElementById("solvebutton").onclick = solve;
		document.getElementById("start").onclick = start;
		document.getElementById("stop").onclick = stop;
		document.getElementById("reset").onclick = reset;
		puzzle();
		actualPuzzle();
	};

	var lockedTiles = [];
	var EMPTY_X = 300;
	var EMPTY_Y = 300;
	var SHADOWEMPTY_X = 300;
	var SHADOWEMPTY_Y = 300;
	var PUZZLE_LENGTH = 4;
	var TILE_SIZE = 100;
	var tiles = [];
	var timer  = null;
	var prevX = 0;
	var prevY = 0;
	var theTile = null;
	var swaps = [];
	var actualTiles = [];
	var count = 0;
	var timerOut = null;
	var stopWatch = null;
	var sec = 0;
	var min = 0;
	var slow = null;
	
	function checkTiles() {
		for(var i = 0; i < actualTiles.length; i++){
			if(parseInt(actualTiles[i].innerHTML) != i+1){
				return false;
			}
		}
		return true;
	}
	
	function disableTiles() {
		for(var i = 0; i < actualTiles.length; i++){
			actualTiles.onclick = false;
		}
	}
	
	function enableTiles() {
		for(var i = 0; i < actualTiles.length; i++){
			actualTiles.onclick = move;
		}
	}
	
	function start(){
		stopWatch = setInterval(time, 1000);
		document.getElementById("stop").disabled = true;
	}
	
	function time(){
			sec++;
			if((("" + parseInt(sec)).length == 1) && parseInt(sec) != 10 && sec !== "00"){
				sec = "0" + sec;
			}
			if(sec == 60){
				sec = "00";
				if((("" + parseInt(sec)).length == 1) && parseInt(sec) != 10 && sec !== "00"){
					sec = "0" + sec;
				}
				min++;
				if((("" + parseInt(min)).length == 1) && parseInt(min) != 10 && min !== "00"){
					min = "0" + min;
				}
				document.getElementById("min").innerHTML = "" + min;
			}
			document.getElementById("sec").innerHTML = "" + sec;
	}
	
	function stop(){
		clearInterval(stopWatch);
		stopWatch = null;
	}
	
	function reset(){
		min = 0;
		sec = 0;
		document.getElementById("mills").innerHTML = "00";
		document.getElementById("sec").innerHTML = "00";
		document.getElementById("min").innerHTML = "00";
	}
	function solve(){
		document.getElementById("stop").disabled = true;
		document.getElementById("start").disabled = true;
		document.getElementById("reset").disabled = true;
		document.getElementById("shufflebutton").disabled = true;
		document.getElementById("solvebutton").disabled = true;
		lockedTiles = [];
		if(!(parseInt(window.getComputedStyle(tiles[0]).left) == 0 && parseInt(window.getComputedStyle(tiles[0]).top) == 0 && 
			parseInt(window.getComputedStyle(tiles[1]).left) == 100 && parseInt(window.getComputedStyle(tiles[1]).top) == 0 &&
			parseInt(window.getComputedStyle(tiles[2]).left) == 200 && parseInt(window.getComputedStyle(tiles[2]).top) == 0 &&
			parseInt(window.getComputedStyle(tiles[3]).left) == 300 && parseInt(window.getComputedStyle(tiles[3]).top) == 0 
			)){
		moveTileTo(tiles[0], 0, 0);
		
		moveTileTo(tiles[1], 100, 0);
		moveTileTo(tiles[2], 200, 0);
		if(parseInt(window.getComputedStyle(tiles[3]).left) == 0 && parseInt(window.getComputedStyle(tiles[3]).top) == 100){
			moveTileTo(tiles[3], 0, 200);
			lockedTiles.pop();
		}
		
		moveTileTo(tiles[2], 300, 0);
		moveTileTo(tiles[1], 200, 0);
		moveTileTo(tiles[0], 100, 0);		
		moveTileTo(tiles[3], 300, 100);
		moveTileTo(tiles[0], 0, 0);
		moveTileTo(tiles[1], 100, 0);
		moveTileTo(tiles[2], 200, 0);
		moveTileTo(tiles[3], 300, 0);
		}

		// row two
						if(!(parseInt(window.getComputedStyle(tiles[4]).left) == 0 && parseInt(window.getComputedStyle(tiles[4]).top) == 100 && 
					parseInt(window.getComputedStyle(tiles[5]).left) == 100 && parseInt(window.getComputedStyle(tiles[5]).top) == 100 &&
					parseInt(window.getComputedStyle(tiles[6]).left) == 200 && parseInt(window.getComputedStyle(tiles[6]).top) == 100 &&
					parseInt(window.getComputedStyle(tiles[7]).left) == 300 && parseInt(window.getComputedStyle(tiles[7]).top) ==  100 
						)){	
		moveTileTo(tiles[4], 0, 100);
		moveTileTo(tiles[5], 100, 100);
		moveTileTo(tiles[6], 200, 100);
		
		if(parseInt(window.getComputedStyle(tiles[7]).left) == 0 && parseInt(window.getComputedStyle(tiles[7]).top) == 200){
			moveTileTo(tiles[7], 0, 300);
			lockedTiles.pop();
		}
		
		moveTileTo(tiles[6], 300, 100);
		moveTileTo(tiles[5], 200, 100);
		moveTileTo(tiles[4], 100, 100);
		moveTileTo(tiles[7], 300, 200);
		moveTileTo(tiles[4], 0, 100);
		moveTileTo(tiles[5], 100, 100);
		moveTileTo(tiles[6], 200, 100);
		moveTileTo(tiles[7], 300, 100);
		}
		lockedTiles = [];
		
		moveTileTo(tiles[9], 300, 200);
		moveTileTo(tiles[8], 0, 200);
		
		if(parseInt(window.getComputedStyle(tiles[8]).left) == 300 && parseInt(window.getComputedStyle(tiles[8]).top) == 300){
			moveTileTo(tiles[8], 200, 300);
			moveTileTo(tiles[9], 300, 300);
			moveTileTo(findTile(200, 200), 300, 200);
			lockedTiles.pop();
			moveTileTo(tiles[8], 200, 200);
			moveTileTo(tiles[8], 0, 200);
			moveTileTo(tiles[9], 300, 200);
		}else{		
			moveTileTo(tiles[8], 0, 200);
		}
		
		moveTileTo(tiles[9], 100, 200);
		moveTileTo(tiles[8], 0, 300);
		moveTileTo(tiles[9], 0, 200);
		
		moveTileTo(tiles[11], 300, 200);
		moveTileTo(tiles[10], 200, 200);
		
		if(parseInt(window.getComputedStyle(tiles[10]).left) == 300 && parseInt(window.getComputedStyle(tiles[10]).top) == 300){
			moveTileTo(tiles[10], 200, 300);
			moveTileTo(tiles[11], 300, 300);
			moveTileTo(findTile(200, 200), 300, 200);
			lockedTiles.pop();
			moveTileTo(tiles[10], 200, 200);
			moveTileTo(tiles[10], 100, 200);
			moveTileTo(tiles[11], 200, 200);
		}else{
			moveTileTo(tiles[10], 100, 200);
			moveTileTo(tiles[11], 200, 200);
		}
		moveTileTo(tiles[8], 100, 300);
		moveTileTo(tiles[9], 0, 300);
		moveTileTo(tiles[10], 0, 200);
		moveTileTo(tiles[11], 100, 200);
		
		moveTileTo(tiles[12], 200, 300);
		moveWhiteSquare(200, 200);
		
		moveTileTo(tiles[11], 200, 200);
		moveTileTo(tiles[10], 100, 200);
		moveTileTo(tiles[9], 0, 200);
		moveTileTo(tiles[8], 0, 300);
		
		moveTileTo(tiles[12], 100, 300);
		moveTileTo(tiles[13], 200, 300);
		moveTileTo(tiles[14], 300, 300);
		
		moveTileTo(tiles[11], 300, 200);
		moveTileTo(tiles[10], 200, 200);
		moveTileTo(tiles[9], 100, 200);
		moveTileTo(tiles[8], 0, 200);
		
		moveTileTo(tiles[12], 0, 300);
		moveTileTo(tiles[13], 100, 300);
		moveTileTo(tiles[14], 200, 300);
		
		timerOut = setInterval(function swaping(){
			if(count > swaps.length - 1){
				count = 0;
				swaps = [];
				document.getElementById("swaparea").innerHTML = "";
				clearInterval(timerOut);
				document.getElementById("stop").disabled = false;
				document.getElementById("start").disabled = false;
				document.getElementById("reset").disabled = false;
				document.getElementById("shufflebutton").disabled = false;
				document.getElementById("solvebutton").disabled = false;
				stop();
				enableTiles();
			}else{
				theTile = findTileB(parseInt(window.getComputedStyle(swaps[count]).left), parseInt(window.getComputedStyle(swaps[count]).top));
				prevX = parseInt(window.getComputedStyle(swaps[count]).left);
				prevY = parseInt(window.getComputedStyle(swaps[count]).top);
				timer = setInterval(slideTile, 12);
				count++;
			}
		}, 240);
	}
	// recursive
	function moveTileTo(tile, locX, locY){
		if(locX != parseInt(window.getComputedStyle(tile).left) || locY != parseInt(window.getComputedStyle(tile).top)){
			var route = [];
			route = findRoute(tile, locX, locY, route);
			deleteBadRoute(route);
			if(notIn(tile)){
				lockedTiles.push(tile);
			}
			
			for(var i = 0; i < route.length; i++){
					var tileX = parseInt(window.getComputedStyle(tile).left);
					var tileY = parseInt(window.getComputedStyle(tile).top);
					if(route[i] === "R"){
						moveWhiteSquare(tileX + 100, tileY);
						swap(tile);
					}else if(route[i] === "L"){
						moveWhiteSquare(tileX - 100, tileY);
						swap(tile);
					}else if(route[i] === "U"){
						moveWhiteSquare(tileX, tileY - 100);
						swap(tile);
					}else if(route[i] === "D"){
						moveWhiteSquare(tileX, tileY + 100);
						swap(tile);
					}
			}
			
		}
		if(notIn(tile)){
			lockedTiles.push(tile);
		}
	}
	
	function notIn(tile){
		for(var i = 0; i < lockedTiles.length; i++){
			if(tile === lockedTiles[i]){
				return false;
			}
		}
		return true;
	}
	
	// moves empty square to location
	// must avoid tile
	// given tile, location X,Y for the swap.
	// assume swap location is what is necessary
	function moveWhiteSquare(locX, locY){
		var route = [];
		route = findRoute(null, locX, locY, route);
		deleteBadRoute(route);
		for(var i = 0; i < route.length; i++){
				if(route[i] === "R"){
					swap(findTile(SHADOWEMPTY_X + 100, SHADOWEMPTY_Y));
				}else if(route[i] === "L"){
					swap(findTile(SHADOWEMPTY_X - 100, SHADOWEMPTY_Y));
				}else if(route[i] === "U"){
					swap(findTile(SHADOWEMPTY_X, SHADOWEMPTY_Y - 100));
				}else if(route[i] === "D"){
					swap(findTile(SHADOWEMPTY_X, SHADOWEMPTY_Y + 100));
				}
		}
	}
	
	//swap objects
	function swap(tile){
		var newTile = document.createElement("div");
		document.getElementById("swaparea").appendChild(newTile);
		newTile.className = "swap";
		
		var x = parseInt(window.getComputedStyle(tile).left);
		var y = parseInt(window.getComputedStyle(tile).top);
		
		newTile.style.left = "" + x + "px";
		newTile.style.top = "" + y + "px";
		swaps.push(newTile);
		
		tile.style.left = "" + SHADOWEMPTY_X + "px";
		tile.style.top = "" + SHADOWEMPTY_Y + "px";
		SHADOWEMPTY_X = x;
		SHADOWEMPTY_Y = y;
	}
	

	
	// finds the tile at given location
	function findTile(x, y){
		for(var i = 0; i < PUZZLE_LENGTH * 4 - 1; i++){
			if(parseInt(tiles[i].style.left) == x && parseInt(tiles[i].style.top) == y){
				return tiles[i];
			}
		}
		return null;
	}
	
	function findTileC(x, y){
		for(var i = 0; i < PUZZLE_LENGTH * 4 - 1; i++){
			if(parseInt(tiles[i].style.left) == x && parseInt(tiles[i].style.top) == y){
				return i;
			}
		}
		return -1;
	}
	
		// finds the tile at given location
	function findTileB(x, y){
		for(var i = 0; i < PUZZLE_LENGTH * 4 - 1; i++){
			if(parseInt(window.getComputedStyle(actualTiles[i]).left) == x && parseInt(window.getComputedStyle(actualTiles[i]).top) == y){
				return actualTiles[i];
			}
		}
		return null;
	}
		
	function findRoute(tile, locX, locY, route){
		var tileX = SHADOWEMPTY_X;
		var tileY = SHADOWEMPTY_Y;
		if(tile != null){
			tileX = parseInt(window.getComputedStyle(tile).left);
			tileY = parseInt(window.getComputedStyle(tile).top);
		}
		return findRouter(tileX, tileY, locX, locY, route);
	}
	
	function deleteBadRoute(route){
		for(var i = 0; i < route.length - 1; i++){
			if((route[i] === "U" && route[i + 1] === "D") || (route[i] === "D" && route[i + 1] === "U") ||
					(route[i] === "L" && route[i + 1] === "R") || (route[i] === "R" && route[i + 1] === "L")){
				route[i] = "";
				route[i + 1] = "";
				i++;
			}
		}
		return route;
	}
	
	
	function findRouter(tileX, tileY, locX, locY, route){
		if(tileX != locX || tileY != locY){
			if(notLocked(tileX + closer(tileX, tileY, locX, locY, 0), tileY) && tileX != locX && notLR(route)){
				route.push(dir(tileX, tileY, locX, locY, 0));
				findRouter((tileX + closer(tileX, tileY, locX, locY, 0)), tileY, locX, locY, route);
			}else if(notLocked(tileX, tileY + closer(tileX, tileY, locX, locY, 1)) && tileY != locY){
				route.push(dir(tileX, tileY, locX, locY, 1));
				findRouter(tileX, (tileY + closer(tileX, tileY, locX, locY, 1)), locX, locY, route);
			}else if(notLocked(tileX + closer(tileX, tileY, locX, locY, 0), tileY)){
				route.push(dir(tileX, tileY, locX, locY, 0));
				findRouter((tileX + closer(tileX, tileY, locX, locY, 0)), tileY, locX, locY, route);
			}else if (notLocked(tileX, tileY + closer(tileX, tileY, locX, locY, 1))){
				route.push(dir(tileX, tileY, locX, locY, 1));
				findRouter(tileX, (tileY + closer(tileX, tileY, locX, locY, 1)), locX, locY, route);
			}else if (notLocked(tileX, tileY - closer(tileX, tileY, locX, locY, 1))){	
				if(dir(tileX, tileY, locX, locY, 1) === "U"){
					route.push("D");
				}else{
					route.push("U");
				}
				findRouter(tileX, (tileY - closer(tileX, tileY, locX, locY, 1)), locX, locY, route);
			}else if(notLocked(tileX - closer(tileX, tileY, locX, locY, 0), tileY)){
				if(dir(tileX, tileY, locX, locY, 0) === "L"){
					route.push("R");
				}else{
					route.push("L");
				}
				findRouter((tileX - closer(tileX, tileY, locX, locY, 0)), tileY, locX, locY, route);
			}
		}
		return route;
	}
	
	function notLR(route){
		if(route.length < 2){
			return true;
		}
		return (!((route[route.length-1] === "L" && route[route.length-2] === "R") 
				|| route[route.length-1] === "R" && route[route.length-2] === "L"));
	}
	
	// adjust tile
	function closer(tX, tY, x, y, dir){
		if(dir == 0){
			if((tX - x) > 0){
				return -100;
			}else{
				return +100;
			}
		}else{
			if((tY - y) > 0){
				return -100;
			}else{
				return +100;
			}
		}
	}

	function dir(tX, tY, x, y, d){
		// equals?
		if(d == 0){
			if((tX - x) > 0){
				return "L";
			}else{
				return "R";
			}
		}else{
			if((tY - y) > 0){
				return "U";
			}else{
				return "D";
			}
		}
	}

	function notLocked(x, y){
		for(var i = 0; i < lockedTiles.length; i++){
			var tileX = parseInt(window.getComputedStyle(lockedTiles[i]).left);
			var tileY = parseInt(window.getComputedStyle(lockedTiles[i]).top);
			if(!((tileX != x || tileY != y) && x >= 0 && x <= 300 && y >= 0 && y <= 300)){
				return false;
			}
		}
		if(lockedTiles.length == 0){
			return (x >= 0 && x <= 300 && y >= 0 && y <= 300);
		}
		return true;
	}
	
	// shadow puzzle
	function puzzle(){
		for(var i = 0; i < PUZZLE_LENGTH; i++){
			for(var j = 0; j < PUZZLE_LENGTH; j++){
				// no 16th puzzle div
				if(j+i*PUZZLE_LENGTH+1 != PUZZLE_LENGTH*PUZZLE_LENGTH){
					var tile = document.createElement("div");
					tile.innerHTML = "" + (j+i*PUZZLE_LENGTH+1);
					tile.className = "tile2";
					document.getElementById("shadowarea").appendChild(tile);
					tile.style.left = "" + j*TILE_SIZE + "px";
					tile.style.top = "" + i*TILE_SIZE + "px";
					tiles.push(tile);
				}
			}
		}
	}

	// moves the puzzle piece if possible
	function move(){
		movehelper(this);
	}
	
	// helps move method
	function movehelper(tile){
		if(moveable(tile)){
			var x = parseInt(window.getComputedStyle(tile).left);
			var y = parseInt(window.getComputedStyle(tile).top);
			prevX = x;
			prevY = y;
			theTile = tile;
			timer = setInterval(slideTile, 20);

			var tileNumber = findTileC(x, y);
			var xB = parseInt(window.getComputedStyle(tiles[tileNumber]).left);
			var yB = parseInt(window.getComputedStyle(tiles[tileNumber]).top);
			tiles[tileNumber].style.left = "" + SHADOWEMPTY_X + "px";
			tiles[tileNumber].style.top = "" + SHADOWEMPTY_Y + "px";
			SHADOWEMPTY_X = xB;
			SHADOWEMPTY_Y = yB;
		}
			if(checkTiles()){
				document.getElementById("stop").disabled = false;
				stop();
			}
	}
	
	// Returns if tile is moveable ie empty space adjacent in the x,y not diagonal
	function moveable(tile) {
		var x = parseInt(window.getComputedStyle(tile).left);
		var y = parseInt(window.getComputedStyle(tile).top);
		// check for empty adjacents
		if((x - TILE_SIZE == EMPTY_X || x + TILE_SIZE == EMPTY_X || x == EMPTY_X) && 
				(y - TILE_SIZE == EMPTY_Y || y + TILE_SIZE == EMPTY_Y || y == EMPTY_Y) && 
				(EMPTY_X == x || EMPTY_Y == y)){
			return true;
		}
		return false;
	}

	
	
	// helps move method shadow
	function movehelperB(tile){
		if(moveable(tile)){
			var x = parseInt(window.getComputedStyle(tile).left);
			var y = parseInt(window.getComputedStyle(tile).top);
			tile.style.left = "" + EMPTY_X + "px";
			tile.style.top = "" + EMPTY_Y + "px";
			EMPTY_X = x;
			EMPTY_Y = y;
			var tileNumber = findTileC(x, y);
			var xB = parseInt(window.getComputedStyle(tiles[tileNumber]).left);
			var yB = parseInt(window.getComputedStyle(tiles[tileNumber]).top);
			tiles[tileNumber].style.left = "" + SHADOWEMPTY_X + "px";
			tiles[tileNumber].style.top = "" + SHADOWEMPTY_Y + "px";
			SHADOWEMPTY_X = xB;
			SHADOWEMPTY_Y = yB;
		}
	}
	



/************************************************************************************************************************/
/************************************************************************************************************************/
/************************************************************************************************************************/

	// highlist the tile if moveable when hovered
	function highlight(){
		if(moveable(this)){
			if (!this.classList.contains("highlight")) {
				this.classList.add("highlight");
			}
		}else {
			if (this.classList.contains("highlight")) {
				this.classList.remove("highlight");
			}
		}
	}

	// creates the puzzle pieces
	function actualPuzzle(){
		for(var i = 0; i < PUZZLE_LENGTH; i++){
			for(var j = 0; j < PUZZLE_LENGTH; j++){
				// no 16th puzzle div
				if(j+i*PUZZLE_LENGTH+1 != PUZZLE_LENGTH*PUZZLE_LENGTH){
					var tile = document.createElement("div");
					tile.innerHTML = "" + (j+i*PUZZLE_LENGTH+1);
					tile.className = "tile";
					document.getElementById("puzzlearea").appendChild(tile);
					
					tile.onclick = move;
					tile.onmouseover = highlight;
					
					tile.style.left = "" + j*TILE_SIZE + "px";
					tile.style.top = "" + i*TILE_SIZE + "px";
					tile.style.backgroundPosition = "" + (j*-TILE_SIZE) + "px" + " " + (i*-TILE_SIZE) + "px";
					actualTiles.push(tile);
				}
			}
		}
	}

	// shuffles the squares using spec's algorithm
	function shuffle() {
		start();
		for(var i = 0; i < 1000; i++){
			var neighbors = [];
			var tiles = document.querySelectorAll(".tile");
			for(var j = 0; j < tiles.length; j++){
				if(moveable(tiles[j])){
					neighbors.push(tiles[j]);
				}
			}
			var move = neighbors[parseInt(Math.random() * (neighbors.length))];
			var apple = findTile(parseInt(window.getComputedStyle(move).left), parseInt(window.getComputedStyle(move).top));
			movehelperB(move);
		}
	}

	function slideTile(){
		var x = parseInt(window.getComputedStyle(theTile).left);
		var y = parseInt(window.getComputedStyle(theTile).top);
		if(x != EMPTY_X){
			if((EMPTY_X - x) > 0){
				theTile.style.left = "" + (x + 10) + "px";
			}else if((EMPTY_X - x) < 0){
				theTile.style.left = "" + (x - 10) + "px";
			}
		}else if(y != EMPTY_Y){
			if((EMPTY_Y - y) > 0){
				theTile.style.top = "" + (y + 10) + "px";
			}else if((EMPTY_Y - y) < 0){
				theTile.style.top = "" + (y - 10) + "px";
			}
		}else{
			EMPTY_X = prevX;
			EMPTY_Y = prevY;
			clearInterval(timer);
		}

	}
})();