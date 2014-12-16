var State1;
(function() {
	"use strict";
	var PUZZLE_LENGTH = 4;
	var puzzleTiles = [];
	var TILE_SIZE = 100;
	var EMPTY_X = 300;
	var EMPTY_Y = 300;
	var BOUND = PUZZLE_LENGTH * TILE_SIZE - 100;
	var prevX = 0;
	var prevY = 0;
	var theTile = null;
	var timer  = null;
	var goalState;

	// makes the buttons call when clicked and set up puzzle
	window.onload = function(){
		document.getElementById("shufflebutton").onclick = shuffle;
		document.getElementById("solvebutton").onclick = solvePath;
		// document.getElementById("reset").onclick = reset;
		initializeTiles();

		// Finding exact values of puzzleTiles objects
		// for (var i = 0; i < 15; i++) {
		// 	console.log(puzzleTiles[i].innerHTML);
		// 	console.log(puzzleTiles[i].style.left);
		// 	console.log(puzzleTiles[i].style.top);
		// }

		// Debug/Test points
		// var point1 = new Point2(1, 3);
		// var point2 = new Point2(1, 3);
		// var point3 = new Point2(2, 3);
		// console.log(point1.toString().localeCompare(point2.toString()));
		// console.log(point1.toString().localeCompare(point3.toString()));
		
		// Debug/Test states objects
		// var State1 = new StatePuzzle(puzzleTiles);
		// var State2 = new StatePuzzle(puzzleTiles);
		// console.log(State1.equals(State2));
		// State1 = new StatePuzzle(puzzleTiles);

		goalState = new StatePuzzle(puzzleTiles, EMPTY_X, EMPTY_Y, false);
	};

	// solves the puzzle returns a path based on swaps needed
	// uses A* with a trivial manhatten distance, (amissable and consistant)
	function solvePath() {
		var child_pq = new PriorityQueue();
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Browser_compatibility
		var parent_set = new Set();
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
		var parent_map = new Map();
		var cost_map = new Map();
		
		// Debug/Test contains for map
		// console.log(cost_map[startState] == null);
		
		var priority = 0;
		var startState = new StatePuzzle(puzzleTiles, EMPTY_X, EMPTY_Y, false);

		child_pq.push(startState, priority);
		cost_map.set(startState, priority);
		// Debug/Test Map operation
		// console.log(cost_map[startState]);
		// cost_map[startState] = 3; 
		// cost_map[startState] = 3; 
		// cost_map[goalState] = 5;
		// console.log(goalState.equals(startState)); 

		while (child_pq.heap.length > 0) {
			// Debug Heap
			// console.log(child_pq.sizeHeap);
			// console.log(child_pq.pop());
			// console.log(child_pq.sizeHeap);

			var parent = child_pq.pop();
			if(parent.equals(goalState)){
				return getPath();
			}
			if (parent_set.has(parent)) {
				console.log("parent in parent set");
				continue;
			}

			parent_set.add(parent);

			var SuccessorStates = getSuccessorsStates(parent);

			// Debug/Test Heuristics
			// console.log(SuccessorStates);
			// console.log(heuristic(SuccessorStates[0]));
			// console.log(heuristic(SuccessorStates[1]));
			// console.log(heuristic(SuccessorStates[2]));

			// Debug/Test Map operations
			// console.log(!(parent_set.has(SuccessorStates[0])));
			// console.log(!(parent_set.has(SuccessorStates[1])));
			// console.log(!(parent_set.has(SuccessorStates[2])));
			for (var i = 0; i < SuccessorStates.length; i++) {
				var child = SuccessorStates[i];
				if (!(parent_set.has(child))) {

					var costMove = 1;
					var heurCost = heuristic(child);
					var costParent = cost_map.get(parent);

					if (costParent == null) {
						var cost = costMove + heurCost;
					} else{
						var cost = costParent + costMove + heurCost;
					}
					child_pq.push(child, cost);

					if (!parent_map.has(child) || cost_map.get(child) > cost) {
						parent_map.set(parent, child);
					}

					// Debug/Test cost function
					// console.log(cost_map[parent] + costMove + heuristic(child));
					
					// Debug/Test heurisitc
					// var heurCost = heuristic(child);
					// console.log(heurCost);

					//needs to be after for calculations
					cost_map.set(child, cost);
				}
			}
		}
	}

	// heuristic function
	function heuristic(state) {
		var cost = 0;
		for (var i = 0; i < 15; i++) {
			var pointState = state.puzzleTiles[i];
			var pointTiles = goalState.puzzleTiles[i];
			// manhatten distance
			var diffX = Math.abs(pointState.xLoc - pointTiles.xLoc);
			var diffY = Math.abs(pointState.yLoc - pointTiles.yLoc);
			cost = cost + diffX + diffY;
		}
		return cost / 100;
	}

	// get possible transition states for frindge
	function getSuccessorsStates(parent) {
		var emptyPoint = parent.emptyLoc;
		var PointN = new Point2(0, 100);
		var PointS = new Point2(0, -100);
		var PointE = new Point2(100, 0);
		var PointW = new Point2(-100, 0);
		var Directions = [PointN, PointS, PointE, PointW];

		// Debug/Test Directions
		// console.log(emptyPoint.toString());
		// for (var i = 0; i < 4; i++) {
		// 	console.log(emptyPoint.xLoc + Directions[i].xLoc);
		// 	console.log(emptyPoint.yLoc + Directions[i].yLoc);
		// }

		var SuccessorStates = [];
		for (var i = 0; i < Directions.length; i++) {
			var newX = emptyPoint.xLoc + Directions[i].xLoc;
			var newY = emptyPoint.yLoc + Directions[i].yLoc;
			if (newX >= 0 && newY >= 0 && newX <= BOUND && newY <= BOUND) {
				// Debug boolean test
				// console.log(newX + " " + newY);

				// find tile with given newX, newY
				// Debug/Test findTile
				//console.log(findTile(newX, newY, parent));

				var copyParent = parent.copyState();
				var tileToBeMoved = findTheTile(newX, newY, copyParent);
				// console.log(tileToBeMoved.xLoc);
				// console.log(tileToBeMoved.yLoc);
				tileToBeMoved.xLoc = copyParent.emptyLoc.xLoc;
				tileToBeMoved.yLoc = copyParent.emptyLoc.yLoc;
				// console.log(tileToBeMoved.xLoc);
				// console.log(tileToBeMoved.yLoc);
				copyParent.emptyLoc.xLoc = newX;
				copyParent.emptyLoc.yLoc = newY;
				SuccessorStates.push(copyParent);
			}
			
		}
		return SuccessorStates;
	}

	// finds the tile at given location
	// Should be using inverse indexing for faster look up
	function findTheTile(x, y, state){
		for(var i = 0; i < PUZZLE_LENGTH * 4 - 1; i++){
			if(state.puzzleTiles[i].xLoc == x && state.puzzleTiles[i].yLoc == y){
				// Debug/Test tile found
				// console.log("found");
				return state.puzzleTiles[i];
			}
		}
		return null;
	}

	// get shortest solving path
	function getPath() {
		console.log("get Path here");
	}

	// state of the puzzle rep. by tile possitions
	function StatePuzzle(puzzleTiles, emptyX, emptyY, copy) {
		this.puzzleTiles = [15];
		if (copy) {
			this.puzzleTiles = puzzleTiles;
		} else{
			for (var i = 0; i < 15; i++) {
				// effectively reducing memory size of state
				var point = new Point2(parseInt(puzzleTiles[i].style.left), parseInt(puzzleTiles[i].style.top));
				this.puzzleTiles[parseInt(puzzleTiles[i].innerHTML) - 1] = point;
			}
		}
		this.emptyLoc = new Point2(emptyX, emptyY);
		this.equals = function (other) {
			for (var i = 0; i < puzzleTiles.length; i++) {
				if (this.puzzleTiles[i].toString().localeCompare(other.puzzleTiles[i].toString()) !== 0) {
					return false;
				}
			}
			return true;
		};

		this.copyState = function () {
			var PointArray = [15]; 
			for (var i = 0; i < 15; i++) {
				PointArray[i] = this.puzzleTiles[i].copyPoint(); 
			}
			return new StatePuzzle(PointArray, this.emptyLoc.xLoc, this.emptyLoc.yLoc, true);
		}

		this.toString = function() {
			var string = "";
			for (var i = 0; i < 15; i++) {
				string += this.puzzleTiles[i].toString() + "  ";
			}
			return string;
		}
	}

	// standard point x, y
	function Point2 (x, y) {
		this.xLoc = x;
		this.yLoc = y;
		this.toString = function() {
			return "" + this.xLoc + " " + this.yLoc;
		};

		this.copyPoint = function() {
			return new Point2(this.xLoc, this.yLoc);
		}
	}

/********************************************Priority Queue: Modified From:**********************************************/
/*****************************************http://jsfiddle.net/GRIFFnDOOR/r7tvg/******************************************/
/************************************************************************************************************************/

	function Node (data, priority) {
	    this.data = data;
	    this.priority = priority;
	}
	Node.prototype.toString = function(){return this.priority}

	// takes an array of objects with {data, priority}
	function PriorityQueue (arr) {
	    this.heap = [null];
	    if (arr) for (i=0; i< arr.length; i++)
	        this.push(arr[i].data, arr[i].priority);
	}

	PriorityQueue.prototype = {
	    push: function(data, priority) {
	        var node = new Node(data, priority);
	        this.bubble(this.heap.push(node) -1);      
	    },
	    
	    // removes and returns the data of highest priority
	    pop: function() {
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