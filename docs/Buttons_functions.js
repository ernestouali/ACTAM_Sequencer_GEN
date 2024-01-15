/*

    Script for animations, visual representations and drawings

    Copyright © of Di Lorenzo Giuliano, Mugnaini Nicola, Ouali Ernest

    1. ID declarations
    2. Main buttons functions
    3. Pitch buttons functions
    4. Octave buttons functions
    5. Alteration buttons functions
    6. Duration buttons functions
    7. Waveform buttons functions
    8. Note buttons functions
    9. File buttons functions
    10. Audio effects functions
    11. Grid buttons functions
    12. Lock buttons functions

*/

/*
**********************************
    ID DECLARATIONS
**********************************
*/

let play = document.getElementById("play");
let play_loop = document.getElementById("play_loop");
let pause = document.getElementById("pause");
let resume = document.getElementById("resume");
let quit = document.getElementById("quit");
let buttonsList = [play, play_loop, pause, resume, quit];

let ledA = document.getElementById("led1");
let ledB = document.getElementById("led2");
let ledC = document.getElementById("led3");
let ledD = document.getElementById("led4");
let ledE = document.getElementById("led5");
let ledF = document.getElementById("led6");
let ledG = document.getElementById("led7");
let led0 = document.getElementById("led8");
let ledLetters = [ledA, ledB, ledC, ledD, ledE, ledF, ledG, led0];


let ledOct0 = document.getElementById("led9");
let ledOct1 = document.getElementById("led10");
let ledOct2 = document.getElementById("led11");
let ledOct3 = document.getElementById("led12");
let ledOct4 = document.getElementById("led13");
let ledOct5 = document.getElementById("led14");
let ledOct6 = document.getElementById("led15");
let ledOctaves = [ledOct0, ledOct1, ledOct2, ledOct3, ledOct4, ledOct5, ledOct6];

let ledWhole = document.getElementById("led16");
let ledHalf = document.getElementById("led17");
let ledQuarter = document.getElementById("led18");
let ledEighth = document.getElementById("led19");
let ledSixt = document.getElementById("led20");
let ledDurations = [ledWhole, ledHalf, ledQuarter, ledEighth, ledSixt];

let ledSin = document.getElementById("led21");
let ledSqu = document.getElementById("led22");
let ledTri = document.getElementById("led23");
let ledSaw = document.getElementById("led24");
let ledWaves = [ledSin, ledSqu, ledTri, ledSaw];

let ledSharp = document.getElementById("led25");
let ledFlat = document.getElementById("led26");
let ledNat = document.getElementById("led27");
let ledAlterations = [ledSharp, ledFlat, ledNat];

let clean = document.getElementById("clean");

/*
**********************************
    MAIN BUTTONS FUNCTIONS
**********************************
*/

// Play sequence button definition
play.onclick = function() {
    // Loop flag initialisation
    loop = false;
    // Pause index reference update
    pause_index = 0;    
    // Playing the sequence
    playSequence(sortData(translateSequenceIntoData(sequence)), 0);
    // Animating buttons
    animatePlayButtons(play, [play, play_loop]);
    // Restoring buttons after total_time
    defineTotalTime(sequence);
    setTimeout(restoreButtons, total_time, play, [play, play_loop, resume, pause]);
};

// Play in loop button definition
play_loop.onclick = function() {
    // Loop flag initialisation
    loop = true;
    // Pause index reference update
    pause_index = 0;
    // Playing the sequence in loop
    playSequenceInLoop(sortData(translateSequenceIntoData(sequence)), 0);
    //Animating buttons
    animatePlayButtons(play_loop, [play, play_loop]);
};

// Pause the playing button function
pause.onclick = function() {
    // Suspending the Audio Context
    c.suspend();

    //console.log("pause_index: ", pause_index);

    // Clearing timeOut for next note
    clearTimeout(timeOut);
    // Animating buttons
    animatePauseResume(pause, resume);
};

// Resuming the playing button function
resume.onclick = function() {
    // Suspending the Audio Context
    c.resume();
    // Checking loop flag
    if (loop) {
        // Playing the sequence
        playSequenceInLoop(sortData(translateSequenceIntoData(sequence)), pause_index);
    }
    else {
        // Playing the sequence in loop
        playSequence(sortData(translateSequenceIntoData(sequence)), pause_index);
    }
    // Animating the buttons
    animatePauseResume(resume, pause);
};

// Quit playing button function
quit.onclick = function() {
    // Cleargin timeut for next note
    clearTimeout(timeOut);
    // Puase index reference update
    pause_index = 0;
    // Restoring the buttons
    restoreButtons(quit, buttonsList);
};

/*
**********************************
    PITCH BUTTONS FUNCTIONS
**********************************
*/

// Pitch A assignment
document.getElementById("pitch_A").onclick = function() {
    // Note letter assignment
    note_letter = 0;
    // Defining test note's attributes
    let octave;
    if (isNaN(note_octave)) {
        octave = 4;
    }
    else {
        octave = note_octave;
    }
    // Defining test note's data
    tuning_frequency = parseInt(document.getElementById("tune").value);
    let f = defineNoteFrequency(note_letter, octave, note_alteration, tuning_frequency);
    let data = {
        frequency: f,
        duration_ms: 1000,
        time: 0
    }
    // Playing test note
    playNote(data);
    // Led animations
    ledOn(ledA, "letters");
};

// Pitch B assignment
document.getElementById("pitch_B").onclick = function() {
    // Note letter assignment
    note_letter = 2;
    // Defining test note's attributes
    let octave;
    if (isNaN(note_octave)) {
        octave = 4;
    }
    else {
        octave = note_octave;
    }
    // Defining test note's data
    tuning_frequency = parseInt(document.getElementById("tune").value);
    let f = defineNoteFrequency(note_letter, octave, note_alteration, tuning_frequency);
    let data = {
        frequency: f,
        duration_ms: 1000,
        time: 0
    }
    // Playing test note
    playNote(data);
    // Led animations
    ledOn(ledB, "letters");
};

// Pitch C assignment
document.getElementById("pitch_C").onclick = function() {
    // note_letter = 3;
    // Note letter assignment
    note_letter = -9;
    // Defining test note's attributes
    let octave;
    if (isNaN(note_octave)) {
        octave = 4;
    }
    else {
        octave = note_octave;
    }
    // Defining test note's data
    tuning_frequency = parseInt(document.getElementById("tune").value);
    let f = defineNoteFrequency(note_letter, octave, note_alteration, tuning_frequency);
    let data = {
        frequency: f,
        duration_ms: 1000,
        time: 0
    }
    // Playing test note
    playNote(data);
    // Led animations
    ledOn(ledC, "letters");
};

// Pitch D assignment
document.getElementById("pitch_D").onclick = function() {
    // note_letter = 5;
    // Note letter assignment
    note_letter = -7;
    // Defining test note's attributes
    let octave;
    if (isNaN(note_octave)) {
        octave = 4;
    }
    else {
        octave = note_octave;
    }
    // Defining test note's data
    tuning_frequency = parseInt(document.getElementById("tune").value);
    let f = defineNoteFrequency(note_letter, octave, note_alteration, tuning_frequency);
    let data = {
        frequency: f,
        duration_ms: 1000,
        time: 0
    }
    // Playing test note
    playNote(data);
    // Led animations
    ledOn(ledD, "letters");
};

// Pitch E assignment
document.getElementById("pitch_E").onclick = function() {
    // note_letter = 7;
    // Note letter assignment
    note_letter = -5;
    // Defining test note's attributes
    let octave;
    if (isNaN(note_octave)) {
        octave = 4;
    }
    else {
        octave = note_octave;
    }
    // Defining test note's data
    tuning_frequency = parseInt(document.getElementById("tune").value);
    let f = defineNoteFrequency(note_letter, octave, note_alteration, tuning_frequency);
    let data = {
        frequency: f,
        duration_ms: 1000,
        time: 0
    }
    // Playing test note
    playNote(data);
    // Led animations
    ledOn(ledE, "letters");
};

// Pitch F assignment
document.getElementById("pitch_F").onclick = function() {
    // note_letter = 8;
    // Note letter assignment
    note_letter = -4;
    // Defining test note's attributes
    let octave;
    if (isNaN(note_octave)) {
        octave = 4;
    }
    else {
        octave = note_octave;
    }
    // Defining test note's data
    tuning_frequency = parseInt(document.getElementById("tune").value);
    let f = defineNoteFrequency(note_letter, octave, note_alteration, tuning_frequency);
    let data = {
        frequency: f,
        duration_ms: 1000,
        time: 0
    }
    // Playing test note
    playNote(data);
    // Led animations
    ledOn(ledF, "letters");
};

// Pitch G assignment
document.getElementById("pitch_G").onclick = function() {
    // note_letter = 10;
    // Note letter assignment
    note_letter = -2;
    // Defining test note's attributes
    let octave;
    if (isNaN(note_octave)) {
        octave = 4;
    }
    else {
        octave = note_octave;
    }
    // Defining test note's data
    tuning_frequency = parseInt(document.getElementById("tune").value);
    let f = defineNoteFrequency(note_letter, octave, note_alteration, tuning_frequency);
    let data = {
        frequency: f,
        duration_ms: 1000,
        time: 0
    }
    // Playing test note
    playNote(data);
    // Led animations
    ledOn(ledG, "letters");
};

// Pitch 0 assignment
document.getElementById("pitch_0").onclick = function() {
    // Note letter assignment
    note_letter = -2500;
    // Led animations
    ledOn(led0, "letters");
};

/*
**********************************
    OCTAVE BUTTONS FUNCTIONS
**********************************
*/

// Octave 0 assignment
document.getElementById("octave_0").onclick = function(){
    // Note octave assignment
    note_octave = 0;
    // Checking test note letter
    if (!isNaN(note_letter)) {
        // Defining test note's data 
        let f = defineNoteFrequency(note_letter, note_octave, note_alteration, tuning_frequency);
        let data = {
            frequency: f,
            duration_ms: 1000,
            time: 0
        }
        // Playing test note
        playNote(data);
    }
    // Led animations
    ledOn(ledOct0, "octaves");    
};

// Octave 1 assignment
document.getElementById("octave_1").onclick = function(){
    // Note octave assignment
    note_octave = 1;
    // Checking test note letter
    if (!isNaN(note_letter)) {
        // Defining test note's data 
        let f = defineNoteFrequency(note_letter, note_octave, note_alteration, tuning_frequency);
        let data = {
            frequency: f,
            duration_ms: 1000,
            time: 0
        }
        // Playing test note
        playNote(data);
        }
    // Led animations
    ledOn(ledOct1, "octaves");  
};

// Octave 2 assignment
document.getElementById("octave_2").onclick = function(){
    // Note octave assignment
    note_octave = 2;
    // Checking test note letter
    if (!isNaN(note_letter)) {
        // Defining test note's data 
        let f = defineNoteFrequency(note_letter, note_octave, note_alteration, tuning_frequency);
        let data = {
            frequency: f,
            duration_ms: 1000,
            time: 0
        }
        // Playing test note
        playNote(data);
    }
    // Led animations
    ledOn(ledOct2, "octaves");  
};

// Octave 3 assignment
document.getElementById("octave_3").onclick = function(){
    // Note octave assignment
    note_octave = 3;
    // Checking test note letter
    if (!isNaN(note_letter)) {
        // Defining test note's data 
        let f = defineNoteFrequency(note_letter, note_octave, note_alteration, tuning_frequency);
        let data = {
            frequency: f,
            duration_ms: 1000,
            time: 0
        }
        // Playing test note
        playNote(data);
    }
    // Led animations
    ledOn(ledOct3, "octaves");  
};

// Octave 4 assignment
document.getElementById("octave_4").onclick = function(){
    // Note octave assignment
    note_octave = 4;
    // Checking test note letter
    if (!isNaN(note_letter)) {
        // Defining test note's data 
        let f = defineNoteFrequency(note_letter, note_octave, note_alteration, tuning_frequency);
        let data = {
            frequency: f,
            duration_ms: 1000,
            time: 0
        }
        // Playing test note
        playNote(data);
    }
    // Led animations
    ledOn(ledOct4, "octaves");  
};

// Octave 5 assignment
document.getElementById("octave_5").onclick = function(){
    // Note octave assignment
    note_octave = 5;
    // Checking test note letter
    if (!isNaN(note_letter)) {
        // Defining test note's data 
        let f = defineNoteFrequency(note_letter, note_octave, note_alteration, tuning_frequency);
        let data = {
            frequency: f,
            duration_ms: 1000,
            time: 0
        }
        // Playing test note
        playNote(data);
    }
    // Led animations
    ledOn(ledOct5, "octaves");  
};

// Octave 6 assignment
document.getElementById("octave_6").onclick = function(){
    // Note octave assignment
    note_octave = 6;
    // Checking test note letter
    if (!isNaN(note_letter)) {
        // Defining test note's data 
        let f = defineNoteFrequency(note_letter, note_octave, note_alteration, tuning_frequency);
        let data = {
            frequency: f,
            duration_ms: 1000,
            time: 0
        }
        // Playing test note
        playNote(data);
    }
    // Led animations
    ledOn(ledOct6, "octaves");  
};

/*
**********************************
    ALTERATION BUTTONS FUNCTIONS
**********************************
*/

// Alteration sharp assignment
document.getElementById("sharp").onclick = function(){
    // Note alteration assignment
    note_alteration = 1;
    // Checking test note letter
    if (!isNaN(note_letter)) {
        // Defining test note's attributes
        let octave;
        if (isNaN(note_octave)) {
            octave = 4;
        }
        else {
            octave = note_octave;
        }
        // Defining test note's data
        let f = defineNoteFrequency(note_letter, note_octave, note_alteration, tuning_frequency);
        let data = {
            frequency: f,
            duration_ms: 1000,
            time: 0
        }
        // Playing test note
        playNote(data);
    }
    // Led animations
    ledOn(ledSharp, "alterations");  
};

// Alteration flat assignment
document.getElementById("flat").onclick = function(){
    // Note alteration assignment
    note_alteration = -1;
    // Checking test note letter
    if (!isNaN(note_letter)) {
        // Defining test note's attributes
        let octave;
        if (isNaN(note_octave)) {
            octave = 4;
        }
        else {
            octave = note_octave;
        }
        // Defining test note's data
        let f = defineNoteFrequency(note_letter, note_octave, note_alteration, tuning_frequency);
        let data = {
            frequency: f,
            duration_ms: 1000,
            time: 0
        }
        // Playing test note
        playNote(data);
    }
    // Led animations
    ledOn(ledFlat, "alterations"); 
};

// Alteration nat assignment
document.getElementById("nat").onclick = function(){
    // Note alteration assignment
    note_alteration = 0;
    // Checking test note letter
    if (!isNaN(note_letter)) {
        // Defining test note's attributes
        let octave;
        if (isNaN(note_octave)) {
            octave = 4;
        }
        else {
            octave = note_octave;
        }
        // Defining test note's data
        let f = defineNoteFrequency(note_letter, note_octave, note_alteration, tuning_frequency);
        let data = {
            frequency: f,
            duration_ms: 1000,
            time: 0
        }
        // Playing test note
        playNote(data);
    }
    // Led animations
    ledOn(ledNat, "alterations");
};

/*
**********************************
    DURATION BUTTONS FUNCTIONS
**********************************
*/

// Duration whole assignment
document.getElementById("duration_whole").onclick = function(){
    // Note duration assignment
    note_duration = 1;
    // Led animations
    ledOn(ledWhole, "durations"); 
};

// Duration half assignment
document.getElementById("duration_half").onclick = function(){
    // Note duration assignment
    note_duration = 2;
    // Led animations
    ledOn(ledHalf, "durations");
};

// Duration quarter assignment
document.getElementById("duration_quarter").onclick = function(){
    // Note duration assignment
    note_duration = 4;
    // Led animations
    ledOn(ledQuarter, "durations");
};

// Duration eighth assignment
document.getElementById("duration_eighth").onclick = function(){
    // Note duration assignment
    note_duration = 8;
    // Led animations
    ledOn(ledEighth, "durations");
};

// Duration sixteenth assignment
document.getElementById("duration_sixteenth").onclick = function(){
    // Note duration assignment
    note_duration = 16;
    // Led animations
    ledOn(ledSixt, "durations");
};

/*
**********************************
    WAVEFORM BUTTONS FUNCTIONS
**********************************
*/

// Wave type sine assignment
document.getElementById("wave_sine").onclick = function(){
    // Waveform assignment
    wave_type = "sine";
    // Checking test note attributes
    if (!isNaN(note_letter) && (!isNaN(note_octave))) {
        // Defining note's data
        let f = defineNoteFrequency(note_letter, note_octave, note_alteration, tuning_frequency);
        let data = {
            frequency: f,
            duration_ms: 1000,
            time: 0
        }
        // Playing test note
        playNote(data);
    }
    // Led animations
    ledOn(ledSin, "waves");
};

// Wave type square assignment
document.getElementById("wave_square").onclick = function(){
    // Waveform assignment
    wave_type = "square";
    // Checking test note attributes
    if (!isNaN(note_letter) && (!isNaN(note_octave))) {
        // Defining note's data
        let f = defineNoteFrequency(note_letter, note_octave, note_alteration, tuning_frequency);
        let data = {
            frequency: f,
            duration_ms: 1000,
            time: 0
        }
        // Playing test note
        playNote(data);
    }
    // Led animations
    ledOn(ledSqu, "waves");
};

// Wave type triangle assignment
document.getElementById("wave_triangle").onclick = function(){
    // Waveform assignment
    wave_type = "triangle";
    // Checking test note attributes
    if (!isNaN(note_letter) && (!isNaN(note_octave))) {
        // Defining note's data
        let f = defineNoteFrequency(note_letter, note_octave, note_alteration, tuning_frequency);
        let data = {
            frequency: f,
            duration_ms: 1000,
            time: 0
        }
        // Playing test note
        playNote(data);
    }
    // Led animations
    ledOn(ledTri, "waves");
};

// Wave type sawtooth assignment
document.getElementById("wave_sawtooth").onclick = function(){
    // Waveform assignment
    wave_type = "sawtooth";
    // Checking test note attributes
    if (!isNaN(note_letter) && (!isNaN(note_octave))) {
        // Defining note's data
        let f = defineNoteFrequency(note_letter, note_octave, note_alteration, tuning_frequency);
        let data = {
            frequency: f,
            duration_ms: 1000,
            time: 0
        }
        // Playing test note
        playNote(data);
    }
    // Led animations
    ledOn(ledSaw, "waves");
};

/*
**********************************
    NOTE BUTTONS FUNCTIONS
**********************************
*/

// Add note button function
document.getElementById("add_note_button").onclick = function() {
    // Adding note into the sequence
    addNote();
};

// Clean note button function
document.getElementById("clean_note_button").onclick = function() {
    // Removing last note from the sequence
    cleanNote();
};

// Clean the sequence button function
clean.onclick = function() {
    // Sequence array initialisation
    sequence = [];

    //clearInterval(timeInterval);
    //clearTimeout(timeOut);
    
    // Clearing and re-drawing the canvas
    clearAndDrawCanvas();
    // Resetting the mirror grid
    mirror = buildMirrorGrid(n_rows = 7 * 12, n_columns = 4 * 16);

    // Updating time index reference to the beginning
    start_index = 0;
};

/*
**********************************
    FILE BUTTONS FUNCTIONS
**********************************
*/

// Load melody button function
document.getElementById("load_melody").onclick = function() {
    // Loading the file and updating the sequence
    loadFileAndSequence();
};

// Save melody button function
document.getElementById("save_melody").onclick = function() {
    // Saving the sequence in a text file
    saveFile(sequence);
};

/*
**********************************
    AUDIO EFFECTS FUNCTIONS
**********************************
*/

// Reverb checkbox function
document.getElementById("reverb_checkbox").onclick = function() {
    // Reverb flag update
    reverb_bool = document.getElementById("reverb_checkbox").checked;
    console.log("reverb_bool: ", reverb_bool);
};

// Delay checkbox function
document.getElementById("delay_checkbox").onclick = function() {
    // Delay flag update
    delay_bool = document.getElementById("delay_checkbox").checked;
    console.log("delay_bool: ", delay_bool);
};

/*
**********************************
    GRID BUTTONS FUNCTIONS
**********************************
*/

// Lowest octave in grid button function
document.getElementById("min_octave_grid").onchange = function() {
    // Calculating the lowest octave represented
    min_octave_grid = parseInt(document.getElementById("min_octave_grid").value);
    // Error detection
    if (min_octave_grid > max_octave_grid) {
        alert("Initial octave > End octave");
        error_audio();
        return ;
    }
    // Calculating the number of visible octaves
    n_octaves_visible = max_octave_grid - min_octave_grid + 1;
    // Grid height update
    canvas.height = px_height * n_octaves_visible;
    //console.log(canvas.height);
    // Clearing and re-drawing the canvas
    clearAndDrawCanvas();
    // Drawing the sequence into the grid
    drawSequenceInGrid(sequence);
};

// Highest octave in grid button function
document.getElementById("max_octave_grid").onchange = function() {
    // Calculating the highest octave represented
    max_octave_grid = parseInt(document.getElementById("max_octave_grid").value);
    // Error detection
    if (max_octave_grid < min_octave_grid) {
        alert("End octave < Initial octave");
        error_audio();
        return ;
    }
    // Calculating the number of visible octaves
    n_octaves_visible = max_octave_grid - min_octave_grid + 1;
    // Grid height update
    canvas.height = px_height * n_octaves_visible;
    //console.log(canvas.height);
    // Clearing and re-drawing the canvas
    clearAndDrawCanvas();
    // Drawing the sequence into the grid
    drawSequenceInGrid(sequence);
};

// Note's position assignment
document.getElementById("starting_point_note").onchange = function() {
    // Note starting position update
    start_index = parseInt(document.getElementById("starting_point_note").value);
};

// Bar's number button function
document.getElementById("n_bars").onchange = function() {
    // Number of bars update
    n_bars = parseInt(document.getElementById("n_bars").value);
    // Grid width update
    canvas.width = px_width * n_bars;
    // Clearing and re-drawing the canvas
    clearAndDrawCanvas();
    // Drawing the sequence into the grid
    drawSequenceInGrid(sequence);
};

/*
**********************************
    LOCK BUTTONS FUNCTIONS
**********************************
*/

function lockApp() {
    // Display update
    document.getElementById('overlay').style.display = 'block';
}
  
function unlockApp() {
    // Display update
    document.getElementById('overlay').style.display ='none';
}