/* To do:

GUI menu
- Amplitude / frequency of X+Y waves
- Custom color palette picker?
- Custom width / height size, rather than resize based on broweer window?
- Control the level of randomness (probably should improve the randomness)
- Add button to randomize inputs (r)


Improvements:
- Other styles for the background image? Other gradient type, non-gradient, random image, input image??
- Glitching / visual randomness / noise
- Add other color palettes (check ig / x art inspo, add black & white theme)

Other ideas (probably separate tools?)
- Use this canvas as a mask which is revealed by T-Rex cam or edge detecton, or low luminosity pixels instead?
- Use this canvas to draw text? Text character shapes would be mask over this
- Merge + layer this into real photos or videos (remove background and then add this instead?)

*/

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', {
  willReadFrequently: true,
});

let width, height;
let gradientBackgroundImage;
let colorSets = [];

//Color palette options
//Wes Anderson color palettes -- source: https://github.com/karthik/wesanderson/blob/master/R/colors.R
const colorPalettes = [
  {
    "name": "BottleRocket1",
    "palette": ["#A42820", "#5F5647", "#9B110E", "#3F5151", "#4E2A1E", "#550307", "#0C1707"],
  },
  {
    "name": "BottleRocket2",
    "palette": ["#FAD510", "#CB2314", "#273046", "#354823", "#1E1E1E"],
  },
  {
    "name": "Rushmore1",
    "palette": ["#E1BD6D", "#EABE94", "#0B775E", "#35274A" ,"#F2300F"],
  },
  {
    "name": "Rushmore",
    "palette": ["#E1BD6D", "#EABE94", "#0B775E", "#35274A" ,"#F2300F"],
  },
  {
    "name": "Royal1",
    "palette": ["#899DA4", "#C93312", "#FAEFD1", "#DC863B"],
  },
  {
    "name": "Royal2",
    "palette": ["#9A8822", "#F5CDB4", "#F8AFA8", "#FDDDA0", "#74A089"],
  },
  {
    "name": "Zissou1",
    "palette": ["#3B9AB2", "#78B7C5", "#EBCC2A", "#E1AF00", "#F21A00"],
  },
  {
    "name": "Zissou1Continuous",
    "palette": ["#3A9AB2", "#6FB2C1", "#91BAB6", "#A5C2A3", "#BDC881", "#DCCB4E", "#E3B710", "#E79805", "#EC7A05", "#EF5703", "#F11B00"],
  },
  {
    "name": "Darjeeling1",
    "palette": ["#FF0000", "#00A08A", "#F2AD00", "#F98400", "#5BBCD6"],
  },
  {
    "name": "Darjeeling2",
    "palette": ["#ECCBAE", "#046C9A", "#D69C4E", "#ABDDDE", "#000000"],
  },
  {
    "name": "Chevalier1",
    "palette": ["#446455", "#FDD262", "#D3DDDC", "#C7B19C"],
  },
  {
    "name": "FantasticFox1",
    "palette": ["#DD8D29", "#E2D200", "#46ACC8", "#E58601", "#B40F20"],
  },
  {
    "name": "Moonrise1",
    "palette": ["#F3DF6C", "#CEAB07", "#D5D5D3", "#24281A"],
  },
  {
    "name": "Moonrise2",
    "palette": ["#798E87", "#C27D38", "#CCC591", "#29211F"],
  },
  {
    "name": "Moonrise3",
    "palette": ["#85D4E3", "#F4B5BD", "#9C964A", "#CDC08C", "#FAD77B"],
  },
  {
    "name": "Cavalcanti1",
    "palette": ["#D8B70A", "#02401B", "#A2A475", "#81A88D", "#972D15"],
  },
  {
    "name": "GrandBudapest1",
    "palette": ["#F1BB7B", "#FD6467", "#5B1A18", "#D67236"],
  },
  {
    "name": "GrandBudapest2",
    "palette": ["#E6A0C4", "#C6CDF7", "#D8A499", "#7294D4"],
  },
  {
    "name": "IsleofDogs1",
    "palette": ["#9986A5", "#79402E", "#CCBA72", "#0F0D0E", "#D9D0D3", "#8D8680"],
  },
  {
    "name": "IsleofDogs2",
    "palette": ["#EAD3BF", "#AA9486", "#B6854D", "#39312F", "#1C1718"],
  },
  {
    "name": "FrenchDispatch",
    "palette": ["#90D4CC", "#BD3027", "#B0AFA2", "#7FC0C6", "#9D9C85"],
  },
  {
    "name": "AsteroidCity1",
    "palette": ["#0A9F9D", "#CEB175", "#E54E21", "#6C8645", "#C18748"],
  },
  {
    "name": "AsteroidCity2",
    "palette": ["#C52E19", "#AC9765", "#54D8B1", "#b67c3b", "#175149", "#AF4E24"],
  },
  {
    "name": "AsteroidCity3",
    "palette": ["#FBA72A", "#D3D4D8", "#CB7A5C", "#5785C1"],
  },
  {
    "name": "Beach",
    "palette": ["#151b42", "#2d5272", "#f9c485", "#d6936b", "#aaaaaa"],
  },
  {
    "name": "Viridis",
    "palette": ["#fde725", "#5ec962", "#21918c", "#3b528b", "#440154"],
  },
  {
    "name": "Inferno",
    "palette": ["#fcffa4", "#f98e09", "#bc3754", "#57106e", "#000004"],
  },
]

const paletteNames = [];
for(i=0; i<colorPalettes.length; i++){
  paletteNames.push(colorPalettes[i].name);
}
console.log(paletteNames);

function changePalette(){
  
  for(i=0; i<colorPalettes.length; i++){
    if(colorPalettes[i].name == obj.colorPalette){
      console.log("Change palette: "+colorPalettes[i].name);
      generateColorSetCycle(colorPalettes[i].palette);
      break;
    }
  }

}

var animationRequest;
var playAnimationToggle = false;

//detect user browser
var ua = navigator.userAgent;
var isSafari = false;
var isFirefox = false;
var isIOS = false;
var isAndroid = false;
if(ua.includes("Safari")){
    isSafari = true;
}
if(ua.includes("Firefox")){
    isFirefox = true;
}
if(ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod")){
    isIOS = true;
}
if(ua.includes("Android")){
    isAndroid = true;
}
console.log("isSafari: "+isSafari+", isFirefox: "+isFirefox+", isIOS: "+isIOS+", isAndroid: "+isAndroid);

var mediaRecorder;
var recordedChunks;
var finishedBlob;
var recordingMessageDiv = document.getElementById("videoRecordingMessageDiv");
var recordVideoState = false;
var videoRecordInterval;
var videoEncoder;
var muxer;
var mobileRecorder;
var videofps = 20;

//add gui
var obj = {
    animationSpeed: 5,
    colorPalette: "Rushmore1",
    gradient: "Radial",
};

var gui = new dat.gui.GUI( { autoPlace: false } );
//gui.close();
var guiOpenToggle = true;

gui.add(obj, "animationSpeed").min(1).max(20).step(1).name('Animation Speed')
gui.add(obj, "colorPalette", paletteNames).onFinishChange(changePalette);
gui.add(obj, "gradient", ["Radial","Linear"]);

obj['playAnimation'] = function () {
    pausePlayAnimation();
};
gui.add(obj, 'playAnimation').name("Play/Pause Animation (p)");

obj['refreshCanvas'] = function () {
    refreshCanvas();
};
gui.add(obj, 'refreshCanvas').name("Refresh Canvas (r)");

obj['saveImage'] = function () {
    saveImage();
};
gui.add(obj, 'saveImage').name("Save Image (s)");

obj['saveVideo'] = function () {
    toggleVideoRecord();
};
gui.add(obj, 'saveVideo').name("Video Export (v)");

customContainer = document.getElementById( 'gui' );
customContainer.appendChild(gui.domElement);

//cycle through color array and generate other permutations by shifting the starting colors
// Example for 3 colors: [0,1,2] - [1,2,0] - [2,0,1]
function generateColorSetCycle(colorArray){
  colorSets = [];
  for(i=0; i<colorArray.length; i++){
    colorSets[i] = [];
    for(j=0; j<colorArray.length; j++){
      let index = (j+i) % colorArray.length;
      colorSets[i][j] = colorArray[index];
    }
  }
}

function resizeCanvas() {
    width = canvas.width = Math.floor(window.innerWidth*1);
    height = canvas.height = Math.floor(window.innerHeight*1);
}

function interpolateColors(colorSet1, colorSet2, factor) {
    return colorSet1.map((color1, index) => {
        const color2 = colorSet2[index];
        const r = Math.round(parseInt(color1.slice(1, 3), 16) * (1 - factor) + parseInt(color2.slice(1, 3), 16) * factor);
        const g = Math.round(parseInt(color1.slice(3, 5), 16) * (1 - factor) + parseInt(color2.slice(3, 5), 16) * factor);
        const b = Math.round(parseInt(color1.slice(5, 7), 16) * (1 - factor) + parseInt(color2.slice(5, 7), 16) * factor);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    });
}

function createGradient(time) {
    const cycleLength = 20 * (5/obj.animationSpeed); // Time in seconds for a full color cycle
    const cycle = (time % (cycleLength * 1000)) / (cycleLength * 1000);
    const setIndex = Math.floor(cycle * colorSets.length);
    const nextSetIndex = (setIndex + 1) % colorSets.length;
    const interpolationFactor = (cycle * colorSets.length) % 1;
    let adjustedTime = (time * obj.animationSpeed/5);

    const currentColors = interpolateColors(colorSets[setIndex], colorSets[nextSetIndex], interpolationFactor);
    
    let gradient;
    if(obj.gradient == "Linear"){
      gradient = ctx.createLinearGradient(0, 0, width, height);
    } else {
      let centerX = width/2 + Math.cos(adjustedTime / 5000)*width/4;
      let centerY =  height/2 + Math.sin(adjustedTime / 5000)*width/4;
      gradient = ctx.createRadialGradient(centerX, centerY, width, centerX, centerY, width/16);
    }
    
    currentColors.forEach((color, index) => {
        gradient.addColorStop(index / (currentColors.length - 1), color);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    //Add random noise pixels
    for(i=0; i<100; i++){
      let x = Math.random()*width;
      let y = Math.random()*height;
      let randomColor = colorSets[0][Math.floor(Math.random()*colorSets[0].length)];
      ctx.fillStyle = randomColor;
      ctx.fillRect(x,y,1,1);
    }

    gradientBackgroundImage = ctx.getImageData(0, 0, width, height);
}

function distort(time) {
    const distortedImage = ctx.createImageData(width, height);
    const data = distortedImage.data;
    const originalData = gradientBackgroundImage.data;
    let adjustedTime = (time * obj.animationSpeed/5);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const dx = Math.sin(y * (Math.sin(adjustedTime/100)+1)/10 + adjustedTime * 0.5) * ((Math.sin(adjustedTime/20)+1)/2 * 200 * Math.sin(adjustedTime/5));
            const dy = Math.cos(x * 0.01 + adjustedTime * 0.5) * ((Math.cos(adjustedTime/10)+1)/2 * 1000 * Math.cos(adjustedTime/4));

            let newX = Math.round(x + dx);
            let newY = Math.round(y + dy);

            newX = Math.max(0, Math.min(width - 1, newX));
            newY = Math.max(0, Math.min(height - 1, newY));

            const sourceIndex = (newY * width + newX) * 4;
            const targetIndex = (y * width + x) * 4;

            data[targetIndex] = originalData[sourceIndex];
            data[targetIndex + 1] = originalData[sourceIndex + 1];
            data[targetIndex + 2] = originalData[sourceIndex + 2];
            data[targetIndex + 3] = 255;
        }
    }

    ctx.putImageData(distortedImage, 0, 0);
}

function animate(time) {
    createGradient(time);
    distort(time * 0.001);
    animationRequest = requestAnimationFrame(animate);
}

//MAIN METHOD
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
generateColorSetCycle(colorPalettes[2].palette);
animationRequest = requestAnimationFrame(animate);

//HELPER FUNCTIONS
function refreshCanvas(){

  console.log("refresh");

  if(playAnimationToggle==true){
      playAnimationToggle = false;
      cancelAnimationFrame(animationRequest);
      console.log("cancel animation");
  }//cancel any existing animation loops

  playAnimationToggle = true;
  canvas.width = width;
  canvas.height = height;
  canvas.scrollIntoView({behavior:"smooth"});

  // ctx.fillStyle = obj.backgroundColor;
  // ctx.fillRect(0,0,scaledWidth,scaledHeight);
  // startAnimation();
}

function pausePlayAnimation(){
  console.log("pause/play animation");
  if(playAnimationToggle==true){
      playAnimationToggle = false;
      cancelAnimationFrame(animationRequest);
      console.log("cancel animation");
  } else {
      startAnimation();
  }
}

function saveImage(){
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
  
    const date = new Date();
    const filename = `lavaLamp_${date.toLocaleDateString()}_${date.toLocaleTimeString()}.png`;
    link.download = filename;
    link.click();
}

function toggleGUI(){
    if(guiOpenToggle == false){
        gui.open();
        guiOpenToggle = true;
    } else {
        gui.close();
        guiOpenToggle = false;
    }
}

//shortcut hotkey presses
document.addEventListener('keydown', function(event) {

    if (event.key === 'r') {
        refreshCanvas();
    } else if (event.key === 's') {
        saveImage();
    } else if (event.key === 'v') {
        toggleVideoRecord();
    } else if (event.key === 'o') {
        toggleGUI();
    } else if(event.key === 'p'){
        pausePlayAnimation();
    }

});

function calcWeightedAverage(data,weights){
    var weightedAverage = 0;
    for(var i=0; i<data.length; i++){
        weightedAverage += data[i]*weights[i];
    }
    return weightedAverage;
}

function resizeTable(){
    const table = document.getElementById('imageTable'); 
    // set the width of each column
    table.getElementsByTagName('td')[0].style.width = `${scaledWidth}px`;
    table.getElementsByTagName('td')[1].style.width = `${scaledWidth}px`;
}

function toggleVideoRecord(){
    if(recordVideoState == false){
      recordVideoState = true;
      chooseRecordingFunction();
    } else {
      recordVideoState = false;
      chooseEndRecordingFunction();
    }
}
  
function chooseRecordingFunction(){
    if(isIOS || isAndroid || isFirefox){
        startMobileRecording();
    }else {
        recordVideoMuxer();
    }
}
  
function chooseEndRecordingFunction(){
        
    if(isIOS || isAndroid || isFirefox){
        mobileRecorder.stop();
    }else {
        finalizeVideo();
    }
    
}
  
//record html canvas element and export as mp4 video
//source: https://devtails.xyz/adam/how-to-save-html-canvas-to-mp4-using-web-codecs-api
async function recordVideoMuxer() {
    console.log("start muxer video recording");
    var videoWidth = Math.floor(canvas.width/2)*2;
    var videoHeight = Math.floor(canvas.height/4)*4; //force a number which is divisible by 4
    console.log("Video dimensions: "+videoWidth+", "+videoHeight);
  
    //display user message
    recordingMessageDiv.classList.remove("hidden");
  
    recordVideoState = true;
    const ctx = canvas.getContext("2d", {
      // This forces the use of a software (instead of hardware accelerated) 2D canvas
      // This isn't necessary, but produces quicker results
      willReadFrequently: true,
      // Desynchronizes the canvas paint cycle from the event loop
      // Should be less necessary with OffscreenCanvas, but with a real canvas you will want this
      desynchronized: true,
    });
  
    muxer = new Mp4Muxer.Muxer({
        target: new Mp4Muxer.ArrayBufferTarget(),
        video: {
            // If you change this, make sure to change the VideoEncoder codec as well
            codec: "avc",
            width: videoWidth,
            height: videoHeight,
        },
  
        firstTimestampBehavior: 'offset', 
  
      // mp4-muxer docs claim you should always use this with ArrayBufferTarget
      fastStart: "in-memory",
    });
  
    videoEncoder = new VideoEncoder({
      output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
      error: (e) => console.error(e),
    });
  
    // This codec should work in most browsers
    // See https://dmnsgn.github.io/media-codecs for list of codecs and see if your browser supports
    videoEncoder.configure({
      codec: "avc1.42003e",
      width: videoWidth,
      height: videoHeight,
      bitrate: 6_000_000,
      bitrateMode: "constant",
    });
    //NEW codec: "avc1.42003e",
    //ORIGINAL codec: "avc1.42001f",
  
    refreshCanvas();
    var frameNumber = 0;
    //setTimeout(finalizeVideo,1000*videoDuration+200); //finish and export video after x seconds
  
    //take a snapshot of the canvas every x miliseconds and encode to video
    videoRecordInterval = setInterval(
        function(){
            if(recordVideoState == true){
                renderCanvasToVideoFrameAndEncode({
                    canvas,
                    videoEncoder,
                    frameNumber,
                    videofps
                })
                frameNumber++;
            }else{
            }
        } , 1000/videofps);
  
}
  
//finish and export video
async function finalizeVideo(){
    console.log("finalize muxer video");
    clearInterval(videoRecordInterval);
    //playAnimationToggle = false;
    recordVideoState = false;
    
    // Forces all pending encodes to complete
    await videoEncoder.flush();
    muxer.finalize();
    let buffer = muxer.target.buffer;
    finishedBlob = new Blob([buffer]); 
    downloadBlob(new Blob([buffer]));
  
    //hide user message
    recordingMessageDiv.classList.add("hidden");
    
}
  
async function renderCanvasToVideoFrameAndEncode({
    canvas,
    videoEncoder,
    frameNumber,
    videofps,
  }) {
    let frame = new VideoFrame(canvas, {
        // Equally spaces frames out depending on frames per second
        timestamp: (frameNumber * 1e6) / videofps,
    });
  
    // The encode() method of the VideoEncoder interface asynchronously encodes a VideoFrame
    videoEncoder.encode(frame);
  
    // The close() method of the VideoFrame interface clears all states and releases the reference to the media resource.
    frame.close();
}
  
function downloadBlob() {
    console.log("download video");
    let url = window.URL.createObjectURL(finishedBlob);
    let a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    const date = new Date();
    const filename = `lavaLamp_${date.toLocaleDateString()}_${date.toLocaleTimeString()}.mp4`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}
  
//record and download videos on mobile devices
function startMobileRecording(){
    var stream = canvas.captureStream(videofps);
    mobileRecorder = new MediaRecorder(stream, { 'type': 'video/mp4' });
    mobileRecorder.addEventListener('dataavailable', finalizeMobileVideo);
  
    console.log("start simple video recording");
    console.log("Video dimensions: "+canvas.width+", "+canvas.height);
  
    //display user message
    //recordingMessageCountdown(videoDuration);
    recordingMessageDiv.classList.remove("hidden");
    
    recordVideoState = true;
    mobileRecorder.start(); //start mobile video recording
  
    /*
    setTimeout(function() {
        recorder.stop();
    }, 1000*videoDuration+200);
    */
}
  
function finalizeMobileVideo(e) {
    setTimeout(function(){
        console.log("finish simple video recording");
        recordVideoState = false;
        /*
        mobileRecorder.stop();*/
        var videoData = [ e.data ];
        finishedBlob = new Blob(videoData, { 'type': 'video/mp4' });
        downloadBlob(finishedBlob);
        
        //hide user message
        recordingMessageDiv.classList.add("hidden");
  
    },500);
  
}