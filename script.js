BASE_PATH = "image_generator\\output\\word\\";

function getFilePath(filename) {
    return BASE_PATH + filename + ".png"; 
}

const colors = ["red", "green", "blue", "yellow"]

const images = [];
colors.forEach(function(color) {
    colors.forEach(function(color2){
        images.push(getFilePath(color + "_" + color2));
    });
});


function getRandomNumber(lastRandomVal) {
    const max = images.length-1;
    const min = 0;
    let randomVal = Math.floor(Math.random() * (max - min + 1)) + min;
    if (lastRandomVal == randomVal) {
        return (randomVal + 1) % images.length;
    }
    return randomVal;
}


document.addEventListener("DOMContentLoaded", function() {
    const imageElement = document.getElementById("slideshow-image");
    const intervalInput = document.getElementById("interval-input");
    const startButton = document.getElementById("start-btn");
    const pauseButton = document.getElementById("pause-btn");
    const applySizeButton = document.getElementById("apply-size-btn");
    const circularCountdownContainer = document.getElementById("countdown-element"); 
  
    let currentImageIndex = getRandomNumber(0);
    let intervalId;
    let intervalInSeconds = parseInt(intervalInput.value); // Initial interval value
    let imageWidth = 320; // Default width
    let imageHeight = 320; // Default height
    
    // Function to start the slideshow
    function startSlideshow() {
      circularCountdownContainer.style.display = "block";
      // Start interval for slideshow
      intervalId = setInterval(function() {
        imageElement.src = images[currentImageIndex];
        currentImageIndex = getRandomNumber(currentImageIndex);
        triggerCountdownContainer(circularCountdownContainer);
      }, intervalInSeconds * 1000);
      startButton.disabled = true;
      pauseButton.disabled = false;
    }
  
    // Function to pause the slideshow
    function pauseSlideshow() {
      clearInterval(intervalId);
      startButton.disabled = false;
      pauseButton.disabled = true;
      circularCountdownContainer.style.display = "none";
    }
  
    // Event listener for the Start button
    startButton.addEventListener("click", startSlideshow);
  
    // Event listener for the Pause button
    pauseButton.addEventListener("click", pauseSlideshow);
  
    // Event listener for the Apply Size button
    applySizeButton.addEventListener("click", function() {
      imageWidth = parseInt(document.getElementById("width-input").value);
      imageHeight = parseInt(document.getElementById("height-input").value);
      imageElement.style.width = imageWidth + "px";
      imageElement.style.height = imageHeight + "px";
    });
  
    // Event listener for the Interval input
    intervalInput.addEventListener("change", function() {
      intervalInSeconds = parseInt(this.value);
      circularCountdownContainer.setAttribute("data-duration", this.value);
    });
  });
  
function triggerCountdownContainer(countdownContainer){
    countdownContainer.innerHTML = `
        <svg id="progress-wrapper" width="500" height="500" viewBox="0 0 500 500">
          <circle cx="250" cy="250" r="200" stroke="#c39fe0" stroke-width="25" fill="transparent" id="progress" />
        </svg>
        <span class="seconds" id="seconds"></span>
    `;
    countdownContainer.style.position = "relative";
    
    const span = document.querySelector(".seconds");
    
    span.style.position = "absolute";
    span.style.color = "#f79797";
    span.style.fontWeight = "900";
    span.style.top = "50%";
    span.style.left = "50%";
    span.style.transform = "translate(-50%, -50%)";
    
    const progressWrapper = document.getElementById("progress-wrapper"),
      progress = document.getElementById("progress"),
      timeSpan = document.getElementById("seconds");
    
    //  Countdown functions
    
    const options = {
      duration: +countdownContainer.dataset.duration,
      transition: countdownContainer.dataset.transition,
      color: countdownContainer.dataset.color,
      size: +countdownContainer.dataset.size,
      initialPosition: countdownContainer.dataset.position,
    };
    
    const circularCountdown = ({
      duration,
      transition,
      color,
      size,
      initialPosition,
    }) => {
      // Rendering countdown on HTML
      renderSeconds(duration);
      // Adjusting timer font-size depending of countdown size
      adjustFontSize(size);
      // Adjusting circular countdown size
      adjustCircleSize(size);
      // Setting initial position of countdown
      setInitialPosition(initialPosition);
      // Starting animation (setting transition, color and duration)
      animationStart(color, transition, duration);
    };
    
    const renderSeconds = (duration) => {
      timeSpan.innerHTML = duration;
      const secondsCountdown = setInterval(() => {
        duration--;
        timeSpan.innerHTML = duration;
        if (duration === 0) {
          clearInterval(secondsCountdown);
          timeSpan.innerHTML = `<i class="fa-solid fa-check"></i>`;
        }
      }, 1000);
    };
    
    const adjustFontSize = (size) => {
      timeSpan.style.fontSize = `${size / 5}px`;
    };
    
    const adjustCircleSize = (size) => {
      progressWrapper.style.width = size;
      progressWrapper.style.height = size;
    };
    
    const setInitialPosition = (initialPosition) => {
      if (initialPosition === "up") {
        progressWrapper.style.transform = "rotate(270deg)";
      } else if (initialPosition === "left") {
        progressWrapper.style.transform = "rotate(180deg)";
      } else if (initialPosition === "down") {
        progressWrapper.style.transform = "rotate(90deg)";
      }
    };
    
    const animationStart = (color, transition, duration) => {
      let length = progress.getTotalLength();
      progress.style.stroke = color;
      progressWrapper.style.strokeDasharray = length;
      progressWrapper.style.animation = `progress ${transition} ${duration}s forwards`;
    };
    
    const init = () => {
      circularCountdown(options);
    };
    
    init();
}
