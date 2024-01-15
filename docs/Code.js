/*

    Script for main audio elaborations, sound synthesis and file management

    Copyright © of Di Lorenzo Giuliano, Mugnaini Nicola, Ouali Ernest

    1. Basic functions
    2. Sequence change functions
    3. Playing functions
    4. File management functions
    5. Canvas interaction functions
    6. Function callings

*/

/*
**********************************
    BASIC FUNCTIONS
**********************************
*/

function defineNoteFrequency(letter, octave, alteration, tune) {
    /*
    This function requires the note parameters (letter, octave, alteration) and tuning frequency
    It returns the note frequency in Hz
    */
    
    // frequency = tuning_frequency * Math.pow(2, letter / 12);         // Letter recognition
    // frequency *= 2 **(height - 4);       // Height recognition
    // frequency *= Math.pow(2, alteration / 12);       // Alteration recognition
    
    return tune * Math.pow(2, (letter + alteration) / 12) * Math.pow(2, (octave - 4));
}

function defineNoteDuration(bpm, duration) {
    /*
    This function requires bpm value and the note musical duration
    It returns the note duration in ms
    */

    return (4 * 60 * 1000 / bpm) / duration;
}

function createNote(letter, octave, alteration, duration, start_index) {
    /*
    This function requires the note's musical information
    It returns a 5-elements object
    */

    // Note definition
    let note = {
        letter: letter,
        octave: octave,
        alteration: alteration,
        duration: duration,
        start_index: start_index
    }
    
    return note;
}

function translateNoteIntoData(note, tune, bpm) {
    /*
    This function requires the note object, the tuning frequency and the bpm
    It returns a 3-elements object of the same note with frequency, time duration and time instant
    */

    // Note data definition
    let f = defineNoteFrequency(note.letter, note.octave, note.alteration, tune);
    let ms = defineNoteDuration(bpm, note.duration);
    let start = note.start_index * (4 * 60 * 1000 / bpm) / 16;

    // Data definition
    let data = {
        frequency: f,
        duration_ms: ms,
        time_ms: start
    }

    return data;
}

/*
**********************************
    SEQUENCE CHANGE FUNCTIONS
**********************************
*/

function addNote() {
    /*
    This function doesn't require arguments
    It creates a note and pushes it in the sequence
    */

    // Error detection for note's attributes
    if (isNaN(note_letter)) {
        alert("Letter not recognized: please retry!");
        return ;
    }
    if (isNaN(note_octave) && (note_letter != -2500)) {
        alert("Octave not recognized: please retry!");
        return ;
    }
    if (isNaN(note_alteration) && (note_letter != -2500)) {
        alert("Alteration not recognized: please retry!");
        return ;
    }
    if (isNaN(note_duration)) {
        alert("Note duration not recognized: please retry!");
        return ;
    }
    // Creating the note object
    let new_note = createNote(note_letter, note_octave, note_alteration, note_duration, start_index);

    // console.log("new note = ", new_note);

    // Cell index extraction from the note
    let cell_index = fromMusicalAttributesToCellIndex(new_note);

    // console.log("cell index = ", cell_index);

    // Checking the presence of written notes in the grid, aside from rests
    if (new_note.letter != 2500){
        for (let i = 0; i < 16 / note_duration; i++){
            if (!mirror[cell_index[0]][start_index + i]) {
                alert("Time slot already taken: please retry!");
                return ;
            }
        }
    }
    // Pushing the note inside the sequence
    sequence.push(new_note);
    //Updating the mirror grid
    updateMirrorGrid(mirror, new_note, 'add');
    // Drawing the note into the grid
    drawNoteInGrid(note_letter, note_octave, note_alteration, start_index, note_duration);
    
    // alert("Note successfully added!");

    // Updating automatically the next note starting instant right after the note just created
    start_index += (16 / note_duration);
}

function cleanNote() {
    /*
    This function doesn't require arguments
    It deletes the last note added in the sequence
    */
    
    // Error detection for empty sequence
    if (sequence.length == 0) {
        return ;
    }
    // Updating the start_index for the new note
    start_index = sequence[sequence.length - 1].start_index;
    //Removing the last note of the sequence from the mirror grid
    updateMirrorGrid(mirror, sequence[sequence.length -1], 'remove');
    // Popping the last element of the sequence
    sequence.pop();
    // Clearing and re-drawing the canvas
    clearAndDrawCanvas();
    // Drawing the sequence into the grid
    drawSequenceInGrid(sequence);
}

function translateSequenceIntoData(sequence) {
    /*
    This function requires the music sequence
    It returns the data sequence, where the notes are described as (f, ms, time)
    */

    // Reading the music sequence
    let music = sequence;
    // Data array initialisation
    let data = [];
    // Reading bpm value
    bpm = parseInt(document.getElementById("bpm_html").value);
    // Reading tuning frequency value
    tuning_frequency = parseInt(document.getElementById("tune").value);
    // Translating each note of the sequence from music into data
    for (let i = 0; i < music.length; i++) {
        data.push(translateNoteIntoData(music[i], tuning_frequency, bpm))
    }  

    return data;
}

function sortData(data) {
    /*
    This function requires a data sequence, where notes are as (f, ms, time)
    It returns the same data array with sorted elements, based on the time parameter
    */

    // Reading the data array into a temporal array
    let array = data;
    // Sorting the data using its temporal copy
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - 1; j++) {
            if (array[j].time_ms > array[j + 1].time_ms) {
                let temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
            }
        }
    }
    // Defining the array for the sorted collection of notes
    let sorted_data = [];
    // Defining a sub-array to collect the notes with same starting time instant
    let multiple_notes = [];
    // Collecting notes with same time_ms
    for (let i = 0; i < array.length; i++) {
        // Adding note in the sub-array
        multiple_notes.push(array[i]);
        // Operation for the last element only
        if (i == (array.length - 1)) {
            // console.log("last element at index: ", i);
            // console.log("time instant is: ", array[i].time_ms);
            
            // Adding the last sub-array created into sorted_data
            sorted_data.push(multiple_notes);
            // Emptying the sub-array
            multiple_notes = [];
        }
        // Operation for all the elements but the last one
        else {
            // console.log("reading index: ", i);
            // console.log("reading note at time: ", array[i].time_ms)
            // console.log("next note should be at time: ", array[i+1].time_ms);
            
            // Checking the starting time instant of two notes
            if (array[i].time_ms != array[i + 1].time_ms) {
                // Adding this sub-array created into sorted_data
                sorted_data.push(multiple_notes);
                // Emptying the sub-array
                multiple_notes = [];
            }
        }
    }

    return sorted_data;
}

function defineTotalTime(sequence) {
    /*
    This function requires a musical sequence
    It returns the total time of the sequence in ms
    */

    // Translating music sequence into data sequence
    let data = translateSequenceIntoData(sequence);

    // sorting the data and collecting notes
    // let sorted_data = sortData(data);

    // Computing the total_time
    for (let i = 0; i < data.length; i++){
        let note = data[i];
        if (note.duration_ms + note.time_ms > total_time) {
            total_time = note.duration_ms + note.time_ms;
        }
    }

    return total_time;
}

/*
**********************************
    PLAYING FUNCTIONS
**********************************
*/

function playNote(note) {
    /*
    This function requires a note object
    It plays a single note
    */

    // Defining the main oscillator
    let o = c.createOscillator();
    o.frequency.value = note.frequency;
    o.type = wave_type;
    // Defining the gain node for ADSR and its connections
    let g_adsr = c.createGain();
    o.connect(g_adsr);
    g_adsr.connect(comp)
    // ADSR parameters definition
    let attack = 0.01;
    let release = 0.1;
    // Envelope shaping
    g_adsr.gain.setValueAtTime(0, c.currentTime);
    g_adsr.gain.linearRampToValueAtTime(1, c.currentTime + attack);
    g_adsr.gain.linearRampToValueAtTime(1, c.currentTime + note.duration_ms / 1000 - release);
    g_adsr.gain.linearRampToValueAtTime(0, c.currentTime + note.duration_ms / 1000);
    // Defining the delay effect branch
    if (delay_bool) {
        // Defining the delay effect 1
        let delay_1 = c.createDelay();
        delay_1.delayTime.value = 120 / 1000;
        // Defining the gain node 1
        let g_delay_1 = c.createGain();
        g_delay_1.gain.value = 0.5;
        // Defining the connections for branch 1
        g_adsr.connect(delay_1);
        delay_1.connect(g_delay_1);
        g_delay_1.connect(comp);
        // Defining the delay effect 2
        let delay_2 = c.createDelay();
        delay_2.delayTime.value = 90 / 1000;
        // Defining the gain node 2
        let g_delay_2 = c.createGain();
        g_delay_2.gain.value = 0.2;
        // Defining the connections for branch 2
        g_adsr.connect(delay_2);
        delay_2.connect(g_delay_2);
        g_delay_2.connect(comp);
    }
    // Defining the reverb effect branch
    if (reverb_bool) {
        // Defining the bandpass filter
        let lp_filter = c.createBiquadFilter();
        lp_filter.type = "bandpass";
        lp_filter.frequency.value = 1000;
        // Defining the pre-delay
        let pre_delay = c.createDelay();
        pre_delay.delayTime.value = 80 / 1000;
        // Defining the reverb effect
        let reverb = c.createDelay();
        reverb.delayTime.value = 150 / 1000;
        // Defining the gain node for the feedback
        let g_reverb = c.createGain();
        g_reverb.gain.value = 0.05;
        // Defining the connections
        g_adsr.connect(lp_filter);
        lp_filter.connect(pre_delay);
        pre_delay.connect(reverb);
        reverb.connect(g_reverb);
        g_reverb.connect(comp);
        g_reverb.connect(reverb);
    }
    // Playing the oscillator
    o.start();
    // Scheduling the oscillator stop
    setTimeout(() => o.stop(), c.currentTime + note.duration_ms);
    // Additive synthesis for sine waves
    if (wave_type == "sine") {
        // Creating a compressor to use before the envelope shaping
        let comp_sine = c.createDynamicsCompressor();
        comp_sine.connect(g_adsr);
        // Creating gain node 1 for oscillator 1
        let g1 = c.createGain();
        g1.gain.value = 1;
        // Connecting oscillator 1 to the new compressor
        o.disconnect();
        o.connect(g1);
        g1.connect(comp_sine);
        // Creating oscillator 2 and gain node 2
        let o2 = c.createOscillator();
        o2.frequency.value = 2 * note.frequency;
        let g2 = c.createGain();
        g2.gain.value = 0.5;
        // Connecting oscillator 2 branch
        o2.connect(g2);
        g2.connect(comp_sine);
        // Creating oscillator 3 and gain node 3
        let o3 = c.createOscillator();
        o3.frequency.value = 3 * note.frequency;
        let g3 = c.createGain();
        g3.gain.value = 0.3;
        // Connecting oscillator 3 branch
        o3.connect(g3);
        g3.connect(comp_sine);
        // Creating oscillator 4 and gain node 4
        let o4 = c.createOscillator();
        o4.frequency.value = 4 * note.frequency;
        let g4 = c.createGain();
        g4.gain.value = 0.2;
        // Connecting oscillator 4 branch
        o4.connect(g4);
        g4.connect(comp_sine);
        // Creating oscillator 5 and gain node 5
        let o5 = c.createOscillator();
        o5.frequency.value = 0.5 * note.frequency;
        let g5 = c.createGain();
        g5.gain.value = 0.05;
        // Connecting oscillator 5 branch
        o5.connect(g5);
        g5.connect(comp_sine);
        // PLaying all new oscillators
        o2.start();
        o3.start();
        o4.start();
        o5.start();
        // Scheduling all new oscillators stop
        setTimeout(() => o2.stop(), c.currentTime + note.duration_ms);
        setTimeout(() => o3.stop(), c.currentTime + note.duration_ms);
        setTimeout(() => o4.stop(), c.currentTime + note.duration_ms);
        setTimeout(() => o5.stop(), c.currentTime + note.duration_ms);
    }
}   

function playSequence(sorted_data, index) {
    /*
    This function requires the music sequence array
    It plays this array of notes
    */

    // Reading the sorted data array
    let music = sorted_data;
    // Playing all simultaneous notes in position "index"
    for (let i = 0; i < music[index].length; i++) {
        playNote(music[index][i]);
    }
    // Checking if there are other notes left to be played
    if (index != (music.length - 1)) {
        // Scheduling the next collection of notes to be played
        timeOut = setTimeout(() => playSequence(music, index + 1), (music[index + 1][0].time_ms - music[index][0].time_ms));
        // Updating the pause index reference
        pause_index = index;
    }
}

function playSequenceInLoop(sorted_data, index) {
    /*
    This function requires the sequence array and the actual note index
    It plays this array of notes in loop
    */

    // Reading the sorted data array
    let music = sorted_data;
    // Initialising the duration of the longest note of a collection
    let max_duration = 0;
    // Playing all simultaneous notes in position "index"
    for (let i = 0; i < music[index].length; i++) {
        // Updating the longest note duration for this collection
        if (max_duration < music[index][i].duration_ms) {
            max_duration = music[index][i].duration_ms;
        }
        // Playing the notes
        playNote(music[index][i]);
    }
    // Operations for the last element of the sequence
    if (index % music.length == (music.length - 1)) {
        // Scheduling the beginning of the sequence after "max_duration"
        timeOut = setTimeout(() => playSequenceInLoop(music, (index + 1) % music.length), max_duration);
        // Updating the pause index reference
        pause_index = index;
    }
    // Operations for all the elements of the sequence but the last one
    else {
        // Scheduling the next collection of notes to be played
        timeOut = setTimeout(() => playSequenceInLoop(music, (index + 1) % music.length), (music[(index + 1) % music.length][0].time_ms - music[index % music.length][0].time_ms));
        // Updating the pause index reference
        pause_index = index;
    }
}

/*
**********************************
    FILE MANAGEMENT FUNCTIONS
**********************************
*/

function saveFile(file_data) {
    /*
    This function downloads a .txt file in the user's computer with the content of file_data in it
    We suppose that file_data is an array of notes objects [ {frequency , duration_ms},...]
    */

    // Popping a window to enter the file's name, the default value is null to force the user to enter a valid file_name
    var file_name = window.prompt("Pick a beautiful name for your beautiful melody: ", "");
    // Error detection for invalid name
    if (file_name == "") {
        alert("Invalid file name: please retry!");
        saveFile(file_data);
        return ;
    }
    // Error detection for exit function (cancel is clicked)
    else if (file_name === null) {
        return ;
    }
    // Creating an element with <a> tag, i.e a link
    const link = document.createElement("a");
    // Positioning the link in the page
    document.body.appendChild(link);
    // Adapting file_data into a string
    var file_data_str = JSON.stringify(sequence)
    // Creating a blob object with the file content we want to add to the file
    const new_file = new Blob([file_data_str]);
    // Adding file content in the object URL
    link.href = URL.createObjectURL(new_file);
    // Adding file_name to the file we want to download
    link.download = file_name + ".txt";
    // Forcing the immediate download
    link.click();
    // Deleting the download link we just created
    window.URL.revokeObjectURL(link.href);

    return ;
}

function loadFileAndSequence() {
    /*
    This function asks the user to browse his files to choose the sequence he wants to load into the sequencer
    This function modifies the value of the sequence to match the one inside the input file
    */

    let loaded_data;
    let converted_data;
    // Input section reference
    var input_file = document.getElementById("fileSelector");
    // Output section reference
    var content = document.getElementById("fileSelected");
    // Launching the file selection process
    input_file.click();
    // Listening to a change in the content of input_file
    input_file.addEventListener("change", function(event) {
        // Preventing the page from refreshing while we choose a file
        event.preventDefault();
        // Creating a new instance of the FileReader class
        var fileReader = new FileReader();
        // When we are reading the function, here are the following instruction
        fileReader.onload = function(){
            // We put the content of the input file into loaded Data which is a string
            loaded_data = fileReader.result;
            
            // console.log("loaded data = ", loaded_data);
            // console.log("loaded data type = ", typeof(loaded_data));

            // Printing the loaded sequence on the output of the webpage
            content.innerText = loaded_data;
            // Converting the str into an object
            converted_data = JSON.parse(loaded_data);
            
            // console.log("converted data = ", converted_data);
            
            // Modifying the global variable sequence
            sequence = converted_data;
            // Resetting the mirror grid for the new sequence
            mirror = buildMirrorGrid(n_rows = 7 * 12, n_columns = 4 * 16);
            // Updating the mirror grid with the new sequence
            if (sequence.length != 0){
                for (let i = 0; i < sequence.length; i++) {
                    updateMirrorGrid(mirror, sequence[i], "add");
                }
            }
            // Clearing and re-drawing the canvas
            clearAndDrawCanvas();
            // Drawing the sequence into the grid
            drawSequenceInGrid(sequence);
        }
        // "this" refers to input_file & "this.files[0]"" is the 1st element loaded within input_file
        fileReader.readAsText(this.files[0]);
    });
}

/*
**********************************
    CANVAS INTERACTION FUNCTIONS
**********************************
*/

function fromCellCOeffToNote() {
    /*
    This function requires no arguments
    It converts the cell coordinates into musical note attributes, adds it to the sequence and draws it into the grid
    */

    // Defining note duration
    var duration;
    // Defining starting time index
    var index;    
    // Operations at first click: cell note identification
    if (!clickBool) {
        // We save the first clicked cell (x-wise) to use it as time boundary reference for the second click
        cell_x_0 = cell_x;
        // Calculating note letter_and_alteration
        letter_and_alteration = cell_y % 12;
        // Assigning note letter and note alteration
        switch (letter_and_alteration) {
            // Note B
            case 0:
                note_letter = 2;
                note_alteration = 0;
                break;
            // Note A#
            case 1:
                note_letter = 0;
                note_alteration = 1;
                break;
            // Note A
            case 2:
                note_letter = 0;
                note_alteration = 0;
                break;
            // Note G#
            case 3:
                note_letter = -2;
                note_alteration = 1;
                break;
            // Note G
            case 4:
                note_letter = -2;
                note_alteration = 0;
                break;
            // Note F#
            case 5:
                note_letter = -4;
                note_alteration = 1;
                break;
            // Note F
            case 6:
                note_letter = -4;
                note_alteration = 0;
                break;
            // Note E
            case 7:
                note_letter = -5;
                note_alteration = 0;
                break;
            // Note D#
            case 8:
                note_letter = -7;
                note_alteration = 1;
                break;
            // Note D
            case 9:
                note_letter = -7;
                note_alteration = 0;
                break;
            // Note C#
            case 10:
                note_letter = -9;
                note_alteration = 1;
                break;
            // Note C
            case 11:
                note_letter = -9;
                note_alteration = 0;
                break;
            // Otherwise
            default :
                return ;
        }

        octave_from_top = Math.floor(cell_y/12);
        
        // console.log("octave from top", octave_from_top);
        
        note_octave = max_octave_grid - octave_from_top;
        
        // console.log("note_letter : "+ note_letter + "    note_alteration : " + note_alteration +  "    note_octave : " + note_octave );
        
        clickBool = true;
    }
    // Operations at second click: duration identification, note creation and note drawing
    else if (clickBool) {
        // Calculating the duration
        duration = 16 / (Math.abs(cell_x - cell_x_0) + 1);
        // Calculating the starting time index
        index = Math.min(cell_x, cell_x_0);

        // console.log("duration : "+ duration + "    index : " + index);

        // Creating the note object
        let new_note = createNote(note_letter, note_octave, note_alteration, duration, index);
        // Calculating the cell index of the note
        let cell_index = fromMusicalAttributesToCellIndex(new_note);
        // Checking if there is an already written note in grid
        for (let i = 0; i < 16 / duration; i++) {
            if (!mirror[cell_index[0]][cell_index[1] + i]) {
                alert("Time slot already taken by this note, please retry!");
                // Resetting the click flag
                clickBool = false;
                return ;
            }
        }
        // Pushing the note inside the sequence
        sequence.push(new_note);
        
        //alert("Note successfully added!");

        // Updating the mirror grid
        updateMirrorGrid(mirror, new_note, 'add');
        // Drawing the sequence into the grid
        drawSequenceInGrid(sequence);
        // Resetting the clicks
        clickBool = false;
    }

    return ;
}

function identifyCell(event) {
    /*
    This function requires the mouse coordinates
    It returns the cell coordinates
    */
    
    // This function identifies the cell in which the mouse is
    //It will be used to dynamically interact with the sequence through the grid

    // Defining the offsets of the canvas
    const offset_x = canvas.getBoundingClientRect().left;
    const offset_y = canvas.getBoundingClientRect().top;
    // Defining the mouse coordinates relatively to the canvas
    var x = event.clientX - offset_x - keyboard_width;
    var y = event.clientY - offset_y;
    // Cell coordinates calculation
    cell_x = Math.floor(x / cell_w);
    cell_y = Math.floor(y / cell_h);
    
    //console.log("cellY : "+ cell_x + "    cellY : " + cell_y);
	
    // Error detection
    if (cell_x < 0 || cell_y < 0 || cell_x > n_columns || cell_y > n_rows){
        cell_x, cell_y = NaN, NaN;
    }
    
    return 1;
}

function buildMirrorGrid(n_rows, n_columns) {
    /*
    This function requires the number of rows and columns
    It generates a matrix with boolean flags to differentiate empty (true) and full (false) cells
    */

    //This function builds a 2D array which contains a boolean 'true' for each cell of the grid
    //Shape of mirror_grid : [n_rows][n_columns]
    //'true' will be later used as an availability indicator for each cell

    // Mirror grid declaration
    var mirror_grid = [];
    // Mirror grid initilisation
    for (let i = 0; i < n_rows; i++) {
        // Sweeping all cells in a row
        mirror_grid[i] = [];
        for (let j = 0; j < n_columns; j++) {
            // Setting all cells as empty (true)
            mirror_grid[i][j] = true;
        }
    }

    // console.log("mirror grid : ", mirror_grid);
    
    return mirror_grid;
}

function fromMusicalAttributesToCellIndex(note){
    /*
    This function requires a note object
    It returns the cell coordinates as [pitch row, starting time column]
    */
    
    //This function converts the musical attributes of a note into the cell coordinates (pitch and starting time)
    //It requires the note object
    //It returns the cell coordinates : the initial x coordinate (starting time) of the note in the grid 
                                    //and the y coordinate of the note in the grid
    // Defining the y coordinate for the note pitch
    var cellY;
    // Defining the y coordinate from the letter and the alteration
    switch (note.letter + note.alteration) {
        // Note C
        case -9:
            cellY = 11;
            break;
        // Note C#
        case -8:
            cellY = 10;
            break;
        // Note D
        case -7:
            cellY = 9;
            break;
        // Note D#
        case -6:
            cellY = 8;
            break;
        // Note E
        case -5:
            cellY = 7;
            break;
        // Note F
        case -4:
            cellY = 6;
            break;
        // Note F#
        case -3:
            cellY = 5;
            break;
        // Note G
        case -2:
            cellY = 4;
            break;
        // Note G#
        case -1:
            cellY = 3;
            break;
        // Note A
        case 0:
            cellY = 2;
            break;
        // Note A#
        case 1:
            cellY = 1;
            break;
        // Note B
        case 2:
            cellY = 0;
            break;
        // Default
        default:
            cellY = -1;
            break;
    }
    // Defining the y coordinate from the octave
    cellY += (6 - note.octave) * 12;    // We consider thar the mirror grid is built with 7 octaves, 6 being the highest
    
    //console.log("cellY : "+ cellY + "    cellY : " + note.start_index);

    // The Y component is immediately given by the start_index of the note
    return [cellY, note.start_index];
}

function updateMirrorGrid(mirror_grid, note, status) {
    /*
    This function requires the mirror grid, a note object and the status operation
    It updates the mirror grid by adding or removing the note
    */

    //Updates the component of the mirror_grid, depending on the required status
    //It requires a single note object, the mirror grid and the status
    //true --> available cell   false --> unavailable cell
    //status either equal 'add' or 'remove'

    // console.log("note letter : ", note.letter);
    
    // Error detection for rests
    if (note.letter == -2500) {
        return ;
    }
    // Identifying the cells corresponding to the note
    let cell = fromMusicalAttributesToCellIndex(note);
    // Sweeping the duration each note of the sequence
    for (let j = 0; j < (16 / note.duration); j++){
        if (status == 'add') {
            // Setting the cells as unavailable
            mirror_grid[cell[0]][cell[1] + j] = false;  // cell[0] is the x coordinate (time slot), cell[1] is the y coordinate (pitch)
        }
        else if (status == 'remove') {
            // Setting the cells as available
            mirror_grid[cell[0]][cell[1] + j] = true;
        }
        else {
            alert("Error in updateMirrorGrid function: status not recognized!");
            return ;
        }
    }
}

/*
**********************************
	FUNCTION CALLINGS
**********************************
*/

// Building the mirror grid with all the 7 octaves and 4 bars by default
let mirror = buildMirrorGrid(n_rows = 7*12, n_columns = 4*16);

canvas.addEventListener("click", identifyCell);
canvas.addEventListener("click", fromCellCOeffToNote);