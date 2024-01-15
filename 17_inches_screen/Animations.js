/*

	Script for animations, visual representations and drawings

	Copyright © of Di Lorenzo Giuliano, Mugnaini Nicola, Ouali Ernest

	1. Leds animations
	2. Buttons animations
	3. Canvas design functions
	4. Drawing functions
	5. Interactions animation functions
	6. Function callings

*/

/*
**********************************
    LEDS ANIMATIONS
**********************************
*/

function ledOn(led_name, led_type) {
	/*
	This function requires the name of the led and its type
	It turns on the targeted led and turns off all the other leds of the same type
	 */

	led_name.style.backgroundColor = "green";

	if (led_type =="letters"){
		for (led in ledLetters){
			if (ledLetters[led] != led_name){
				ledLetters[led].style.backgroundColor = "";
			}
		}
	}
	else if (led_type == "octaves"){
		for (led in ledOctaves){
			if (ledOctaves[led] != led_name){
				ledOctaves[led].style.backgroundColor = "";
			}
		} 
	}
	else if (led_type == "durations"){
		for (led in ledDurations){
			if (ledDurations[led] != led_name){
				ledDurations[led].style.backgroundColor = "";
			}
		} 
	}
	else if (led_type == "alterations"){
		for (led in ledAlterations){
			if (ledAlterations[led] != led_name){
				ledAlterations[led].style.backgroundColor = "";
			}
		} 
	}
	else if (led_type == "waves"){
		for (led in ledWaves){
			if (ledWaves[led] != led_name){
				ledWaves[led].style.backgroundColor = "";
			}
		} 
	}
}

/*
**********************************
    BUTTONS ANIMATIONS
**********************************
*/

function animatePlayButtons(clickedButton, disabledButtons){
	/*
	This function requires the clicked buttons and the disabled ones
	It animates the clicked button to show that it has been pressed
	*/

	// Highlighting the clicked button
	clickedButton.style.transform = "scale(1.15)";
	//Resetting all the other buttons' size
	for (b in buttonsList){
		if (buttonsList[b] != clickedButton){
			buttonsList[b].style.transform = "initial";
		}
	}
	//Disabling the target buttons and highlighting their status thanks to the grey color
	for (b in disabledButtons){
		disabledButtons[b].disabled =  true;
		if (disabledButtons[b] != clickedButton){
			disabledButtons[b].style.backgroundColor = "grey";
			disabledButtons[b].style.borderColor = "grey";
		}
	}
}

function animatePauseResume(clickedButton, otherButton){
	/*
	This function requires the clicked button and the other one 
	We suppose that the only considered buttons are the pause and resume ones
	This function handles the animation of the pause and resume buttons
	*/

	//Expanding the clicked button and shrinking the other one back to its original size
	clickedButton.style.transform = "scale(1.1)";
	otherButton.style.transform = "initial";
}
  
function restoreButtons(clickedButton, disabledButtons){
	/*
	This function requires the clicked buttons and the disabled ones
	It restores the buttons to their original size and color
	*/
	
	//disabledButtons is a list of buttons that have been disabled during the animation
	clickedButton.style.transform =  "initial";
	for (b in disabledButtons){
		//Resetting the disabled buttons' size and color
    	disabledButtons[b].style.transform =  "initial";
	  	disabledButtons[b].style.backgroundColor =  "";
		disabledButtons[b].style.borderColor =  "";
	  	disabledButtons[b].disabled = false;
	}
}

/*
**********************************
    CANVAS DESIGN FUNCTIONS
**********************************
*/

// Taking the Canvas element by HTML
const canvas = document.getElementById('myCanvas');
// Taking the Context inside the canvas
const ctx = canvas.getContext('2d');
// Initialisation of canvas' height and width
canvas.width = px_width * n_bars;
canvas.height = px_height * n_octaves_visible;
// Cursor style definition
canvas.style.cursor = "pointer";

function drawGrid() {
	/*
	This function doesn't require any arguments
	It draws the grid for the sequence representation
	*/

	// Updating the number of rows
	n_rows = 12 * n_octaves_visible;
	// Updating the number of columns
	n_columns = 16 * n_bars;
	// Updating the width of single cell
	cell_w = (canvas.width - keyboard_width) / n_columns;
	// Updating the height of single cell
	cell_h = canvas.height / n_rows;
	// Drawing the grid
	for (let i = 0; i < n_rows; i++) {		// for each row
		for (let j = 0; j < n_columns; j++) {	// for each column
			// Drawing a rectangular cell with starting point (j * cell_w, i * cell_h) and dimensions (cell_w x cell_h)
			ctx.strokeRect(keyboard_width + j * cell_w, i * cell_h, cell_w, cell_h);
		}
	}
}

function drawOctaveKeyboard(octave_position) {
	/*
	This function requires the position in px of the octave to draw
	It draws a single-octave keyboard
	*/
	
	// White keys drawing
	ctx.strokeRect(0, octave_position, keyboard_width, 1.5 * cell_h);
	ctx.strokeRect(0, octave_position + 1.5 * cell_h, keyboard_width, 2 * cell_h);
	ctx.strokeRect(0, octave_position + 3.5 * cell_h, keyboard_width, 2 * cell_h);
	ctx.strokeRect(0, octave_position + 5.5 * cell_h, keyboard_width, 1.5 * cell_h);
	ctx.strokeRect(0, octave_position + 7 * cell_h, keyboard_width, 1.5 * cell_h);
	ctx.strokeRect(0, octave_position + 8.5 * cell_h, keyboard_width, 2 * cell_h);
	ctx.strokeRect(0, octave_position + 10.5 * cell_h, keyboard_width, 1.5 * cell_h);
	// Black keys drawing
	ctx.fillStyle = "black";
	ctx.fillRect(0, octave_position + 1 * cell_h, 0.5 * keyboard_width, cell_h);
	ctx.fillRect(0, octave_position + 3 * cell_h, 0.5 * keyboard_width, cell_h);
	ctx.fillRect(0, octave_position + 5 * cell_h, 0.5 * keyboard_width, cell_h);
	ctx.fillRect(0, octave_position + 8 * cell_h, 0.5 * keyboard_width, cell_h);
	ctx.fillRect(0, octave_position + 10 * cell_h, 0.5 * keyboard_width, cell_h);
}

function drawKeyboard() {
	/*
	This function doesn't require any arguments
	It draws the keyboard next to the grid for notes representation
	*/
	
	// Drawing a single keyboard for each visible octave
	for (let i = 0; i < n_octaves_visible; i++) {
		drawOctaveKeyboard(i * 12 * cell_h)
	}
}

function clearAndDrawCanvas() {
	/*
	This function doesn't require any arguments
	It clears the canvas and draws the grid and the keyboard
	*/
	
	// Clearing the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// Drawing the grid
	drawGrid();
	// Drawing the keyboard
	drawKeyboard();
}

/*
**********************************
    DRAWING FUNCTIONS
**********************************
*/

function drawNoteInGrid(letter, octave, alteration, grid_index, note_duration) {
	/*
	This function requires the note attributes in musical terms and the index position
	It calculates where to draw the note and draws it
	*/
  
  	// Pause drawing check
	if (letter == -2500) {
		return ;
	}
	// Calculating row from the letter
	let row = Math.abs(letter - 11);
	// Updating row with relative octave
	row -= 12 * (octave - n_octaves + (n_octaves - max_octave_grid) + 1);		// Octave between 0 and n_octaves, (n_octaves - max_octave_grid) for shifting the drawing upward
	// Updating row with alteration
	row -= alteration;
	// Row letter adjustment
	row += 3;
	// Defining note length to draw
	let length = 16 / note_duration;
	// Block colour definition
	ctx.fillStyle = "green";
	// Drawing the note
	ctx.fillRect(grid_index * cell_w + keyboard_width + 1.5, row * cell_h + 1.5, (length * cell_w) - 2.5, cell_h - 2.5);		// Numerical values only for better visualisation
}

function drawSequenceInGrid(sequence) {
	/*
	This function requires the sequence loaded from the text file
	It draws the sequence on the grid
	*/

	// Reading the sequence loaded
	let s = sequence;
	// Error detection
	if (s.length == 0) {
		// alert("Empty sequences cannot be drawn");
		// error_audio();
		return ;
	}
	// Taking each note in the sequence
	for (let i = 0; i < s.length; i++) {
		// Drawing the single note
		drawNoteInGrid(s[i].letter, s[i].octave, s[i].alteration, s[i].start_index, s[i].duration);
	}
}

/*
**********************************
	INTERACTIONS ANIMATION FUNCTIONS
**********************************
*/

function highlightCell(event) {
    /* 
    This function requires an event to be triggered, "mousemove" in our case, see function call at the end of the script
	It highlights the cell in which the mouse is
	*/

    // Defining the offsets of the canvas
    const offset_x = canvas.getBoundingClientRect().left;
    const offset_y = canvas.getBoundingClientRect().top;
    // Defining the mouse coordinates relative to the canvas
    var x = event.clientX - offset_x;
    var y = event.clientY - offset_y;
    // Calculating the cell coordinates
    cell_x = Math.floor(x / cell_w) ;
    cell_y = Math.floor(y / cell_h);
	// Clearing and re-drawing the canvas
    clearAndDrawCanvas();
	// Drawing the sequence in the grid
	drawSequenceInGrid(sequence);
    // Highlighting the cell pointed by the mouse
    if (x > (keyboard_width + 3) && x <= canvas.width && y >= 0 && y <= canvas.height) {
		ctx.fillStyle = "lightblue";
		ctx.fillRect( (cell_x -0.09)* cell_w, cell_y * cell_h , cell_w, cell_h);
    }
}

/*
**********************************
	FUNCTION CALLINGS
**********************************
*/

clearAndDrawCanvas();
canvas.addEventListener('mousemove', highlightCell);