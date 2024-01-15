/*

    Script for global variables definition

    Copyright © of Di Lorenzo Giuliano, Mugnaini Nicola, Ouali Ernest

*/

// Notes attributes initialisation
var note_letter = NaN;
var note_octave = NaN;
var note_alteration = 0;
var note_duration = NaN;
var tuning_frequency = 440;
var bpm = 80;
var start_index = 0;
var wave_type = 'sine';

// Initialising the notes sequence and its total time
var sequence = [];
var total_time = 0;

// Defining the Audio Context and the ending compressor
const c = new AudioContext();
const comp = c.createDynamicsCompressor();
comp.connect(c.destination);

// Audio effects flags initialisation
var delay_bool = false;
var reverb_bool = false;

// Defining the variables for interrupting the sequence
var timeOut = 0;
var pause_index = 0;

// Defining the loop flag
var loop = false;

// Defining number of octaves and number of represented bars
const n_octaves = 7;
var n_bars = 2;

// Defining lowest and highest represented octaves
var min_octave_grid = 3;
var max_octave_grid = 4;

// Defining the number of visible octaves
var n_octaves_visible = max_octave_grid - min_octave_grid + 1;

// Defining the canvas width (per bar) and height (per octave) in px
const px_width = 600;
const px_height = 100;

// Defining the keyboard width
const keyboard_width = 100;

// Initialising the varaibles for the cell identification
var cell_x = NaN;
var cell_y = NaN;
var cell_x_0 = NaN;

// Click flag initialisation
var clickBool = false;