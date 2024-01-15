# Sequencer GEN

## A Graphic Interface To Create Melodies On The Go

If you want to put on music some ideas in a very simple and fast way, you're at the right place. 
May you be a musician and you want to share your melody, or may you be a music lover and you want to experiment with notes and rhythms, this website is designed for you.

This project is the result of a team work for the course _Advanced Coding Tools and Methodologies_ of the M.S. Degree _Music and Acoustic Engineering_ at Politecnico di Milano.

## How Can I Use It?

The graphic interface allows you to insert notes inside a sequence that will be displayed and played at will.
Here is a quick video tutorial:

<video src="./Video_demo.mp4" controls title="Title"></video

Don't worry, anything shown in the video will be explained below in this page.

### How Can I Write A Melody?

To start writing a melody you should, firstly, follow these steps:

* Select the desired note by clicking on the buttons related to its musical properties `(letter, octave, alteration, duration)`. For example, to play a C#4 that lasts for one quarter, you want to select `(C, 4, sharp, quarter)`. The order of selection is not relevant in this step and each button will play a note to help you decide what fits better.
* Select the type of the sound you'd like to hear by clicking on the desired waveform.
* Add the selected note by clicking on `Add Note`. It will immediately appear on screen, inside the grid. Don't worry if you forget to set some musical attributes, the program will tell you which you are missing.

In this way, you can add the very first note of the melody at the beginning of the grid.

The next note will be added right next to the previous one, to make it faster to compose a single-line melody.\
If you've just added a note by accident and you want to change it, you can click on `Clean Note` to remove it.\
In this case, the last note added to the sequence will be deleted and the new note you select will be added starting from where was the removed one.

You can add a pause by selecting `0` as note letter and the desired duration.
Consider that the pause won't be drawn in the grid.

If you want to add a note in a different position rather than next to the last one, you can choose it by selecting the column number corresponding to where the note should be added (each column represents a 16th) right next to `Note position` and click on the button.

### How Can I Play The Melody?

The first row of buttons offers you different functions (which are, in order):

* play the melody once
* play it in loop
* pause reproducing
* resume playing
* clean the melody

In order to actually hear sounds, it's necessary to have a BPM and a tuning frequency.
Their default values are 120 and 440.
You can change their values at will, so that you can hear the same melody with these different parameters.

### How Can I See The Melody?

All notes added will be drawn inside the grid with the keyboard.
At first, all 7 octaves available can be seen, but you can choose how many octaves you want to display.
By choosing the first and last octaves, you can see the part of your melody that belongs to that range.\
For example, if you want to display from octave `3` to octave `5`, you should select 3 and 5 for first and last octave (respectively) and the grid will update automatically.

In addition to that, you can change the number of bars displayed with the same logic.
At first, only one bar is displayed, but more bars can be shown by typing the desired number of bars next to `Number of bars`.

### Can I Add Notes Through The Grid?

In order to make the user experience better, we implemented a method to add the notes immediately on the grid.\
Each cell of this grid represents a pitch and a time slot, whose time unit is the 16th.
The keyboard on the left of the grid helps you visualize the pitches.\
When your cursor is on the grid, you can see that the cell you are on is highlighted in blue.
This helps you identifying which cell you are on.
To add a new note on the grid, these steps are required:

* Click on the cell corresponding to the desired pitch at the desired time: this will define the pitch of the new note.
* To select the desired duration, just click a second time on the grid at the temporal edge of the note.

If you click on the same cell, the note will last for a 16th.
If you click on any other cell, your note will last for as many 16th as there are cells between the first and second click (included).
Your note will start at the time-instant indicated by the left cell (i.e. you can add a note from starting to ending point and vice-versa).\
Be careful, the sequencer is designed such as when a time-slot is already taken by a certain pitch, no overlap is possible: you can't play the same note twice at the same moment.

For example, if you want to add a C which lasts for a quarter, then you have to:

* Identify the cell corresponding to the C on the grid (help yourself with the keyboard).
* Click on the cell related to the desired time-instant.
* Click a second time 3 cells further (to the left or to the right).

And that's it!
You're done!
The C will start to the time-instant of the left edge and last for a quarter.

### How Can I Save The Melody?

Yes, you can save your melody, by clicking on `Save Melody`.
Now you can share it with other people, who can load that very same file and rapidly hear (and judge) your ideas on the spot.\
Be sure to save your progress before loading any file not to lose your melody.

### What About Chords?

You can add chords and, generally, as many notes as you like in whatever position you prefer.
Remember to choose the starting position of the new notes with `Note position`.

### Is There Anything Else It Can Do?

> It ain't much, but it's honest work.

## How Does It Work?

This project is composed of one HTML file, one CSS file and four JavaScript files:

* `Animations.js`: collects all the functionalities related to visual representations such as leds activation, grid design (through an HTML5 canvas) and melody display.
* `Buttons_functions.js`: decribes all instructions that occur when any button is clicked.
* `Code.js`: implements all main elaborations such as melody description, music-to-audio translation, sound synthesis and file management.
* `Variables_declaration.js`: defines every global variable and its default value.

All the functionalities offered by the code have been written by scratch, without using any particular library.

### Music Description 

Basically, when the user adds a note in the sequence to be played, a `note` object is created as:

``` JavaScript
note = {
    letter: letter,
    octave: octave,
    alteration: alteration,
    duration: duration,
    start_index: start_index
}
```

And it is pushed into the `sequence` array of notes.
Consider that each note has a tatum-wise reference `start_index` for the grid which indicates when the note will be played, so the order of the notes inside the sequence is irrelevant.

In order to play the sequence, each note is translated in a `data` object as:

``` JavaScript
data = {
    frequency: f,
    duration_ms: ms,
    time: start
}
```

This is when BPM and tuning frequency are used: both `frequency` and `duration_ms` are the result of two functions that compute physical data from musical information.
Also `time_ms` is the milliseconds value of the `start_index` (which is in terms of 16th).

### Sound Chain and Audio Synthesis

Each of notes of `data` array will be passed to the `playNote` function to be played accordingly.\
The generic sound chain implemented inside this function is:

``` mermaid
graph LR
    subgraph ADSR
        A[Oscillator] --> B[ADSR]
    end

    subgraph Delay
        B --> X[If delay_bool = true]
        X --> D[Delay 1]
        D --> E[Gain Delay 1]
        X --> F[Delay 2]
        F --> G[Gain Delay 2]
    end

    subgraph Reverb
        B --> Y[If reverb_bool = true]
        Y --> W[Lowpass filter]
        W --> V[Pre-delay]
        V --> T[Reverb]
        T --> U[Gain Reverb]
        U --> T
    end

    B --> C[Compressor]
    E --> C
    G --> C
    U --> C
    C --> Q[Audio Context Destination]
```

The properties of the note (`frequency` and `duration_ms`) are used as it follow:

``` JavaScript
function playNote(note) {
    /*
    This function requires a note object
    It plays a single note
    */

    // Definition of note's oscillator
    let o = c.createOscillator();
    o.frequency.value = note.frequency;     // <---
    o.type = wave_type;
    
    // ...
    
    // Envelope shaping
    g_adsr.gain.setValueAtTime(0, c.currentTime);
    g_adsr.gain.linearRampToValueAtTime(1, c.currentTime + attack);
    g_adsr.gain.linearRampToValueAtTime(1, c.currentTime + note.duration_ms / 1000 - release);      // <---
    g_adsr.gain.linearRampToValueAtTime(0, c.currentTime + note.duration_ms / 1000);        // <---
    
    // ...

    // Playing the oscillator
    o.start();
    // Scheduling the oscillator stop
    setTimeout(() => o.stop(), c.currentTime + note.duration_ms);       // <---

    // ...
}
```

When the selected waveform is `"sine"`, a slightly different version is employed:


``` mermaid
graph LR
    subgraph ADSR and Additive Synthesis
        A[Oscillator] --> H[Gain 1 = 1]
        I[Oscillator 2] --> J[Gain 2]
        K[Oscillator 3] --> L[Gain 3]
        M[Oscillator 4] --> N[Gain 4]
        O[Oscillator 5] --> P[Gain 5]
        H --> X[Sine Compressor]
        J --> X
        L --> X
        N --> X
        P --> X
        X --> B[ADSR]
    end

    subgraph Delay
        B --> Y[If delay_bool = true]
        Y --> D[Delay 1]
        D --> E[Gain Delay 1]
        Y --> F[Delay 2]
        F --> G[Gain Delay 2]
    end

    subgraph Reverb
        B --> Z[If reverb_bool = true]
        Z --> W[Lowpass filter]
        W --> V[Pre-delay]
        V --> T[Reverb]
        T --> U[Gain Reverb]
        U --> T
    end

    B --> C[Compressor]
    E --> C
    G --> C
    U --> C
    C --> Q[Audio Context Destination]
```

The difference is that now an additive-synthesis technique has been developed, in order to make the sound of the single oscillator more interesting and appealing.\
Additive synthesis is a technique that uses the superposition of different sine waves.
In this case, the four added oscillators have frequencies of the first partials of the note: it means that each oscillator plays a multiple of the note's frequency. So, oscillator `2` plays `2 * note.frequency`, oscilator `3` plays `3 * note.frequency` and so on.
Only exception is oscillator `5` that plays `0.5 * note.frequency`, which is not an harmonic but a sub-harmonic.

### Layout Design

In the course of this project development, various layout models were implemented.
The final version depicts the most intuitive layout, with the greatest visual impact.\
The layout is the result of two files written in HTML and CSS (respectively `GUI.html` and `Style.css`).\
Using HTML, it is possible to describe the layouts from an structural point of view, in terms of visual representation: the graphic parts, such as buttons and LEDs, were placed within `div` elements that could emphasise their own space within the interface.\
In addition, each button was identified by a precise `id` (useful for positioning them within the webpage and for linking them to specific `onclick` functions present in the JavaScript file `Buttons_functions.js`), and by a `class`, where the latter differentiates the different categories of buttons (e.g. whether they are durations or alterations).\
As regards of the grid and the keyboard, a `canvas` object has been used: the reason for this choice is dictated by its incredible flexibility and adaptability, which is specifically relevant for modifying the sequence directly from the grid and with the simple use of the mouse.\
Furthermore, it can be seen how the use of colours makes the whole webpage more interesting, and with a marked harmonisation between `div` and `button` elements.\
CSS provided the opportunity to work from a purely graphical point of view, with the choice of dimensions, contours, actual positioning and colours of the various elements.
The focus was to have the most compact graphics possible, as well as a clear and intuitive interface, to be easily used during the composition of the sequence.\
It is important to emphasise, for the reasons mentioned above, how some `label` elements were inserted precisely to make it easier to use and free of misunderstandings.

### Grid Representation

At the beginning, both the grid and the keyboard are drawn by `drawGrid` and `drawKeyboard` functions, called together by `clearAndDrawCanvas` function, which clears and draws again the canvas.\
After that, whenever a `note` objects is defined and added in the `sequence`, it is drawn in the grid by `drawNoteInGrid` function, which uses the note's musical information to do so (without BPM and tuning frequency).

When the user loads a sequence from a text file, the `drawSequenceInGrid` function reads the sequence and calls `drawNoteInGrid` for each element of the array.

### Notes Implementation Through The Grid

In order to allow the user to add notes through the grid, several considerations were taken into account.\
Each cell (along the y axis) is related to a pitch, depending on the chosen octave range.
Each cell (along the x axis) is related to the tatum (in this case 16th).\
When clicking on a cell, the code will check if the note is still available. If the note is already present in that moment, an alert will pop up and the user will have to click elsewhere.
Checking the notes availability is easily done by creating a mirror grid (`2d-array`) filled with boolean values: `True` means that the cell is available, `False` means the opposite.\
When loading the sequence for the first time, the `mirror_grid` is initialised with `True` everywhere (because the grid is empty).\
When a note is effectively added to the sequence (with a double click), the `mirror_grid` will be updated: the elements corresponding to the note attributes (pitch, duration and starting time instant) will be changed to `False`.\
When loading a sequence (through the `Load Melody` button), the `mirror_grid` is updated in the same way.\
When clearing the sequence, the code initialises the `mirror_grid` again.\
The mirror grid update also happens when we add notes using the buttons.

### Files Management

In order to save the written sequences into the user's computer, we used a method where we create a temporary link into the webpage.\
A window prompt asks to enter the file's name.
Once it's done, a link is created into the webpage and filled with a `Blob` object containing the sequence (passed as a `string`).\
Then, the code automatically downloads this file with a `.txt` format into the user's computer.
Finally, the link is immediately removed.

In order to load a written sequence, we used the `FileReader` object from the File System API of JavaScript.\
When we click on the `load file` button, a `file selector` window immediately appears on the screen, allowing only `.txt` files.\
Once the file is selected, its content is loaded as text into an `output` element of the webpage.\
The sequence is updated accordingly to the content of this `output` element, after converting it into an `object`.
In the end, the `mirror_grid` is updated to match the new sequence and the code draws it into the grid.

## Challenges Encountered

### Di Lorenzo

The main difficulty I had during the development of this project was to find the best melody and note architecture in order to implement the features we had in mind.\
At first, the code allowed to play only singular-note melodies, then we added chords (but only with the same duration for all notes).\
So, in order to allow the user to add notes of any duration in any time position, I implemented a midi-like representation with the use of a starting time instant (both in tatum-wise terms and in milliseconds).\
Finally, to make the sequence computation time lower, the code I wrote creates a `sorted_data` array and use the recursive calling logic to schedule the next note to be played.
In `sorted_data` all the notes of the melody are sorted by starting time reference (from first to last notes) and all simultaneous notes are clustered together (notes that start at the same time constitutes a multiple-elements array inside `sorted_data`).

Regarding the resulting sounds, the sound quality was another challenge I wanted to deal with.\
The use of low-level functionalities and elements allowed us to write faster code, but didn't lead to very pleasant sounds.
So I tried to develop a more intricate sound processing chain, including compressors, delay and reverb, and tried to resemble a professional-like sound synthesis by using an additive synthesis technique instead of using a single oscillators.

### Mugnaini

From the point of view of the layout, I believe that the most significant challenge found was to represent and position all the elements in a coherent way with the idea proposed initially.
It was not easy above all to stack the different elements (buttons, leds...); this has brought various changes during the development but we can consider ourselves satisfied with the final version obtained.

### Ouali

My personal challenges dealt with JavaScript functionalities that weren't seen during lectures or just briefly discussed.\
The functionalities I struggled with were: `Blob` object, `FileReader` object and asynchronous functions.\
I managed to overcome the challenges related to `Blob` and `FileReader` objects with a lot of "die-and-retry" logic, YoutTube tutorials and with the help of code snippets delivered by ChatGPT. \
I must thank OpenAI for developing ChatGPT as it was a great tool to quickly obtain code snippets, showing basic uses and writing rules for those functionalities.\
They allowed me to quickly grasp an idea of how to handle and declare such tools, which eventually saved me a lot of time.
I was also able to save a lot of time thanks to the AI Copilot that we were shown during the lectures.
It helped me remember variables, specifities of our program...
It is a great tool that I'll keep using throughout my life.\
However, I must say that extra carefulness is required when using such tools as errors are frequent. 
Using them should never undermine the developer's mind and our thirst of "Do It Yourself".
Instead, they should be considered as sidekicks, helping us facing logic issues or tough challenges.

## Credits

### Di Lorenzo

I found this project development as an opportunity to put myself on the line (it was my very first serious coding project) and to start learning important soft skills, imposing myself to create a work-like professional workflow.
This process was easily simplified by working with my colleagues Nicola and Ernest, because we all managed to create a balanced, organized and enthusiastic work environment, hopefully leading to other chances of working together.

### Mugnaini

At the conclusion of this project, I would like to thank my colleagues Giuliano and Ernest for the professionalism, dedication and commitment they showed and for conveying a part of themselves within each hour spent at work.\
It is not easy to find people who are so close to one's ideas and for this reason I consider myself very lucky.\
Moreover, this work has given us the opportunity to establish a friendship beyond the working relationship, for which I am extremely grateful.

### Ouali

My biggest pride, even if I had no particuliarly tough challenge implementing it, was developing the grid interaction for our sequence.
Coding it felt like a game, such as debugging.
I really had a great time turning my ideas into working code.\
Moreover, I deeply appreciated working with Giuliano and Nicola.
Thanks to this project, I was able to know them better and a great friendship was born from this project.
I highly consider their seriousness and rigor.
We had a lot of meeting for this project, starting mid-October until the end of December.
We were extremely well organised as Giuliano's milestone checklist really helped us prioritizing features implementation.\
All of us were proactive on our group chat for checking the evolution of our project, showing that each one of us was extremely motivated for the project development.
In my academic experience, it is the first time that I got the chance to work with such reliable people.

---

Project developed by:
* Di Lorenzo Giuliano
* Mugnaini Nicola
* Ouali Ernest