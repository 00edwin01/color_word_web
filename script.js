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

function preloadImage(url)
{
    var img=new Image();
    img.src=url;
}


document.addEventListener("DOMContentLoaded", function() {
    // preload all the images
    images.forEach(image => {
      preloadImage(image);
    });

    let points = 0;
    let history = [];

    const imageElement = document.getElementById("slideshow-image");
    const startButton = document.getElementById("start-btn");
    const pauseButton = document.getElementById("pause-btn");
    const applySizeButton = document.getElementById("apply-size-btn");
    const optionButtons = document.getElementsByClassName("option-btn");
    const userPoints = document.getElementById("user-points");
    const pointsContainer = document.getElementById("points-container");
    const body = document.body;
    const historyButton = document.getElementById("history-btn");

    let currentImageIndex = getRandomNumber(0);
    imageElement.setAttribute("src", images[currentImageIndex]); // load default image
    let imageWidth = 320; // Default width
    let imageHeight = 320; // Default height
    
    // Function to start the slideshow
    function startSlideshow() {
      startButton.disabled = true;
      pauseButton.disabled = false;
      applySizeButton.disabled = true;

      // display first slide
      currentImageIndex = getRandomNumber(currentImageIndex);
      imageElement.setAttribute("src", images[currentImageIndex]);
    }
  
    // Function to pause the slideshow
    function pauseSlideshow() {
      const confirmation = confirm("Are you sure you want to stop? All the points will be reset");
      if (confirmation) {
        startButton.disabled = false;
        pauseButton.disabled = true;
        applySizeButton.disabled = false;

        // reset user points
        points = 0;
        userPoints.textContent = points;
        history = [];
      }
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

    // Event listener for the Show History button
    historyButton.addEventListener("click", showHistory);

    // Event listner for option button
    for (let optionButton of optionButtons) {
      optionButton.addEventListener("click", function() {
        // only process if start button is disabled
        if (!startButton.disabled) {
          return;
        }
        
        // add point if answer is correct
        let answer = images[currentImageIndex].split("_")[2].split(".")[0];
        if (answer == optionButton.getAttribute("id")) {
          points++;
          userPoints.textContent = points;

          // do correct animation
          pointsContainer.classList.add("correct-answer");
          body.classList.add("correct-answer");
          setTimeout(() => {
            pointsContainer.classList.remove("correct-answer");
            body.classList.remove("correct-answer");
          }, 500);

        } else {
          // do wrong animation
          body.classList.add("wrong-answer");
          setTimeout(() => {
            body.classList.remove("wrong-answer");
          }, 500);
        }

        // store into history
        history.push({"image": images[currentImageIndex], "answer": answer, "selected": optionButton.getAttribute("id")});

        // next slide
        currentImageIndex = getRandomNumber(currentImageIndex);
        imageElement.setAttribute("src", images[currentImageIndex]);
      });
    }


    // Function to show history
    function showHistory() {
      const modal = document.createElement("div");
      modal.classList.add("modal");

      const modalContent = document.createElement("div");
      modalContent.classList.add("modal-content");

      const closeButton = document.createElement("span");
      closeButton.classList.add("close");
      closeButton.textContent = "×";

      const historyTable = document.createElement("table");
      historyTable.id = "history-table";

      // Add table header
      const headerRow = historyTable.insertRow();
      const headers = ["#", "Image", "Answer", "Selected"];
      headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
      });

      // Populate table with history data
      history.forEach((item, index) => {
        const row = historyTable.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        
        cell1.textContent = index + 1;
        
        // Set the image column
        const image = document.createElement("img");
        image.src = item["image"];
        image.alt = item["image"];
        image.width = 50; // Adjust the width as needed
        image.height = 50; // Adjust the height as needed
        cell2.appendChild(image);
        
        cell3.textContent = item["answer"];
        cell4.textContent = item["selected"];

        // Check if answer matches selected
        if (item["answer"] === item["selected"]) {
          // Set background color to green
          row.style.backgroundColor = "lightgreen";
        } else {
            // Set background color to red
            row.style.backgroundColor = "lightcoral";
        }
      });

      modalContent.appendChild(closeButton);
      modalContent.appendChild(historyTable);
      modal.appendChild(modalContent);

      // Close modal when close button is clicked
      closeButton.addEventListener("click", function() {
        modal.remove();
      });

      // Close modal when clicking outside of it
      window.addEventListener("click", function(event) {
        if (event.target === modal) {
          modal.remove();
        }
      });

      // Append modal to the body
      document.body.appendChild(modal);
    }
});

