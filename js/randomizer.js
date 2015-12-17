"use strict";

function randomizer() {

	var outputsSize = 10,		// size of recent outputs array "randomizer.outputs"
		xhr;					// XMLHttpRequest object

	if (!randomizer.outputs) {	// array of recent outputs
		randomizer.outputs = [];
	}


	// get list of recent outputs and init output step
	if (!randomizer.list) {		// list of nouns/adjectives
		try {
			xhr = new XMLHttpRequest();
			xhr.open('GET', 'https://fathomless-everglades-3680.herokuapp.com/api/dictionary', true);
			xhr.send();
		} catch (e) {
			console.log("Try to get from server has failed. " + e);

			setIncludedList();
			console.log(randomizer.list);

			return output();
		}
	} else {
		return output();
	}



	xhr.onreadystatechange = function () {
		if (xhr.readyState !== 4) return;

		button.innerHTML = 'Run randomizer';
		button.disabled = false;

		if (xhr.status !== 200) {
			throw new Error(console.log(xhr.status + ': ' + xhr.statusText));
		} else {
			randomizer.list = JSON.parse(xhr.responseText);
			console.log(randomizer.list);

			return output();
		}
	};

	button.innerHTML = 'Creating noun..';
	button.disabled = true;






	// return the result noun
	function output() {
		var noun;	// noun for output, noun = adjective + noun

		noun = createNoun();
		addToHistory(noun);

		result.innerHTML = noun;
		out.innerHTML = randomizer.outputs;
		console.log('\"' + noun + '\" ');
	}


	// set included list
	function setIncludedList() {
		randomizer.list = {
			"nouns" : ["Apple", "Street", "Tree", "Dog", "Friend"],
			"adjectives" : ["Good", "Excellent", "Free", "Great", "Yellow"]
		};
	}


	// generate number from range (min, max), min and max included
	function random(min, max) {
		var num = Math.random() * (max + 1 - min) + min;
		num = Math.floor(num);
		return num;
	}


	// return -1 if in array of last results
	function checkHistory(somePair) {
		var i, n;

		if ([].indexOf) {
			return randomizer.outputs.indexOf(somePair);
		} else {
			for (i = 0, n = randomizer.outputs.length; i < n; i += 1) {
				if (randomizer.outputs[i] === somePair) {
					return i;
				}
			}

			return -1;
		}
	}


	// up first letter
	function upFirstLetter(word) {
		var bigLetter;
		bigLetter = word[0].toUpperCase() + word.slice(1);

		return bigLetter;
	}


	// create noun = adjective + noun from range (minIndex, max*Index), minIndex and maxIndex included
	function createNoun() {
		var pair, // adjective + noun
			minIndex = 0,	//	first number for index range
			maxNounIndex,	// last number for nouns range
			maxAdjectiveIndex, // last number for adjectives range
			numberNoun,				// noun index getted with random function
			numberAdjective;		// adjectives index getted with random function

		maxNounIndex = randomizer.list.nouns.length - 1;
		maxAdjectiveIndex = randomizer.list.adjectives.length - 1;

		do {
			numberNoun = random(minIndex, maxNounIndex);
			numberAdjective = random(minIndex, maxAdjectiveIndex);

			pair = upFirstLetter(randomizer.list.adjectives[numberAdjective]) + upFirstLetter(randomizer.list.nouns[numberNoun]);
		} while (~checkHistory(pair));

		return pair;
	}


	// add to array last uotput
	function addToHistory(somePair) {
		if (randomizer.outputs.length === outputsSize) {
			randomizer.outputs.shift();
		}
		randomizer.outputs.push(somePair);
	}
}
