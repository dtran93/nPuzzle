var State1;
(function() {
	"use strict";
	
	// makes the buttons call when clicked and set up puzzle
	window.onload = function(){
		document.getElementById("shufflebutton").onclick = shuffle;
		// document.getElementById("solvebutton").onclick = solve;
		// document.getElementById("reset").onclick = reset;
		initializeTiles();
		// Finding exact values of puzzleTiles objects
		// for (var i = 0; i < 15; i++) {
		// 	console.log(puzzleTiles[i].innerHTML);
		// 	console.log(puzzleTiles[i].style.left);
		// 	console.log(puzzleTiles[i].style.top);
		// }
		// var point1 = new Point2(1, 3);
		// var point2 = new Point2(1, 3);
		// var point3 = new Point2(2, 3);
		// console.log(point1.toString().localeCompare(point2.toString()));
		// console.log(point1.toString().localeCompare(point3.toString()));
		// var State1 = new StatePuzzle(puzzleTiles);
		// var State2 = new StatePuzzle(puzzleTiles);
		// console.log(State1.equals(State2));
		State1 = new StatePuzzle(puzzleTiles);
		solvePath();
	};

	var PUZZLE_LENGTH = 4;
	var puzzleTiles = [];
	var TILE_SIZE = 100;
	var EMPTY_X = 300;
	var EMPTY_Y = 300;
	var prevX = 0;
	var prevY = 0;
	var theTile = null;
	var timer  = null;

	// solves the puzzle returns a path based on swaps needed
	// uses A* with a trivial manhatten distance, (amissable and consistant)
	function solvePath() {
		var child_pq = new PriorityQueue([]);
		var paretn_set = new Set([]);
		var parent_map = {};
		var priority = 0;
		child_pq.push(new StatePuzzle(puzzleTiles), priority);
		while (child_pq.sizeHeap > 0) {
			// console.log(child_pq.sizeHeap);
			// console.log(child_pq.pop());
			// console.log(child_pq.sizeHeap);
			var parent = child_pq.pop();
			
		}
	}

	// state of the puzzle rep. by tile possitions
	function StatePuzzle(puzzleTiles) {
		this.puzzleTiles = [15];
		for (var i = 0; i < 15; i++) {
			var point = new Point2(parseInt(puzzleTiles[i].style.left), parseInt(puzzleTiles[i].style.top));
			this.puzzleTiles[parseInt(puzzleTiles[i].innerHTML) - 1] = point;
		}

		this.equals = function (other) {
			for (var i = 0; i < puzzleTiles.length; i++) {
				if (this.puzzleTiles[i.toString()].toString().localeCompare(other.puzzleTiles[i.toString()].toString()) !== 0) {
					return false;
				}
			}
			return true;
		};
	}

	// standard point x, y
	function Point2 (x, y) {
		this.xLoc = x;
		this.yLoc = y;
		this.toString = function() {
			return "" + x + " " + y;
		};
	}

/*****************************************************Priority Queue*****************************************************/
/*****************************************http://jsfiddle.net/GRIFFnDOOR/r7tvg/******************************************/
/************************************************************************************************************************/

	function Node (data, priority) {
	    this.data = data;
	    this.priority = priority;
	}
	Node.prototype.toString = function(){return this.priority}

	// takes an array of objects with {data, priority}
	function PriorityQueue (arr) {
		this.sizeHeap = 0;
	    this.heap = [null];
	    if (arr) for (var i=0; i< arr.length; i++)
	        this.push(arr[i].data, arr[i].priority);
	}

	PriorityQueue.prototype = {
	    push: function(data, priority) {
	    	this.sizeHeap++;
	        var node = new Node(data, priority);
	        this.bubble(this.heap.push(node) -1);      
	    },
	    
	    // removes and returns the data of highest priority
	    pop: function() {
	    	this.sizeHeap--;
	        var topVal = this.heap[1].data;
	        this.heap[1] = this.heap.pop();
	        this.sink(1); return topVal;
	    },
	    
	    // bubbles node i up the binary tree based on
	    // priority until heap conditions are restored
	    bubble: function(i) {
	        while (i > 1) { 
	            var parentIndex = i >> 1; // <=> floor(i/2)
	            
	            // if equal, no bubble (maintains insertion order)
	            if (!this.isHigherPriority(i, parentIndex)) break;
	            
	            this.swap(i, parentIndex);
	            i = parentIndex;
	    }   },
	        
	    // does the opposite of the bubble() function
	    sink: function(i) {
	        while (i*2 < this.heap.length) {
	            // if equal, left bubbles (maintains insertion order)
	            var leftHigher = !this.isHigherPriority(i*2 +1, i*2);
	            var childIndex = leftHigher? i*2 : i*2 +1;
	            
	            // if equal, sink happens (maintains insertion order)
	            if (this.isHigherPriority(i,childIndex)) break;
	            
	            this.swap(i, childIndex);
	            i = childIndex;
	    }   },
	        
	    // swaps the addresses of 2 nodes
	    swap: function(i,j) {
	        var temp = this.heap[i];
	        this.heap[i] = this.heap[j];
	        this.heap[j] = temp;
	    },
	        
	    // returns true if node i is higher priority than j
	    isHigherPriority: function(i,j) {
	        return this.heap[i].priority < this.heap[j].priority;
	    }
	}

	/*****************************************************View/Control*******************************************************/
	/************************************************************************************************************************/
	/************************************************************************************************************************/

	// creates the puzzle pieces
	function initializeTiles(){
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
					puzzleTiles.push(tile);
				}
			}
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

	// finds the tile at given location
	function findTile(x, y){
		for(var i = 0; i < PUZZLE_LENGTH * 4 - 1; i++){
			if(parseInt(puzzleTiles[i].style.left) == x && parseInt(puzzleTiles[i].style.top) == y){
				return puzzleTiles[i];
			}
		}
		return null;
	}

	// shuffles the squares using spec's algorithm
	function shuffle() {
		for(var i = 0; i < 1000; i++){
			var neighbors = [];
			var tiles = document.querySelectorAll(".tile");
			for(var j = 0; j < tiles.length; j++){
				if(moveable(tiles[j])){
					neighbors.push(tiles[j]);
				}
			}
			var move = neighbors[parseInt(Math.random() * (neighbors.length))];
			movehelperNoSlide(move);
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
		}
	}

	// slides the tiles instead of swapping
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
			var State2 = new StatePuzzle(puzzleTiles);
			console.log(State1.equals(State2));
		}

	}

	// helper for the shuffle doesn't slide the tiles
	function movehelperNoSlide(tile){
		if(moveable(tile)){
			var x = parseInt(window.getComputedStyle(tile).left);
			var y = parseInt(window.getComputedStyle(tile).top);
			tile.style.left = "" + EMPTY_X + "px";
			tile.style.top = "" + EMPTY_Y + "px";
			EMPTY_X = x;
			EMPTY_Y = y;
		}
	}
	
})();