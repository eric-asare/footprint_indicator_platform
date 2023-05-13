document.addEventListener("DOMContentLoaded", function () {
  fetch("./sector_contributions.json")
    .then((response) => response.json())
    .then((emissionData) => {
      // console.log(emissionData);
      var calculatedFootprintForEachSector = {};

      // Initialize for each sector the footprint equal to the starting value
      for (var sector in emissionData) {
        calculatedFootprintForEachSector[sector] =
          emissionData[sector]["Value"];
      }

      var questions = {
        "Electricity and Water": [
          {
            description: "Do you use electricity?",
            options: { Yes: 0.1, No: 0.0 },
          },
          {
            description: "Do you use water?",
            options: { Yes: 0.1, No: 0.0 },
          },
          {
            description: "Do you use gas?",
            options: { Yes: 0.1, No: 0.0 },
          },
        ],
        "Transport": [
          {
            description: "Do you use a car?",
            options: { Yes: 0.1, No: 0.0 },
          },
          {
            description: "Do you use a bus?",
            options: { Yes: 0.1, No: 0.0 },
          },
          {
            description: "Do you use a train?",
            options: { Yes: 0.1, No: 0.0 },
          },
        ],
      };

      var sectors = Object.keys(emissionData); // get the sectors from the emission data
     
      currentQuestionIndex = 0; // index of the current question
      currentSectorIndex = 0; // index of the current sector
      currentSector = sectors[currentSectorIndex]; // current sector

      showQuestion(question);
      
      // function to show the question and options
      function showQuestion() {
        document.getElementById("sectorName").textContent = currentSector; // Show the sector name
        document.getElementById("questionsLeftForSector").innerHTML = 'Q' + (currentQuestionIndex + 1) + '/' + questions[currentSector].length; // Show the question number
        var questionDiv = document.getElementById("question");
        var optionsDiv = document.getElementById("options");
        
        currentQuestion = questions[currentSector][currentQuestionIndex];
        questionDiv.textContent = 'Q' + (currentQuestionIndex + 1) + ". " + currentQuestion.description; // Show the question description
        optionsDiv.innerHTML = "";

        // Update the options on the page
        for (var option in currentQuestion.options) {
          var optionLabel = document.createElement("label");
          var optionInput = document.createElement("input");
          optionInput.type = "radio";
          optionInput.name = "options";
          optionInput.value = currentQuestion.options[option];

          optionLabel.appendChild(optionInput);
          optionLabel.appendChild(document.createTextNode(option));

          optionsDiv.appendChild(optionLabel);
        }
      }

      // function to show the previous question
      function prevQuestion() {
        if (currentQuestionIndex > 0) {
          currentQuestionIndex--;
          currentQuestion = questions[currentSector][currentQuestionIndex];
          showQuestion();
        }
      }

      // function to show the next question
      function nextQuestion() {
        if (questions[currentSector] && currentQuestionIndex < questions[currentSector].length - 1) {
          currentQuestionIndex++;
          currentQuestion = questions[currentSector][currentQuestionIndex];
          showQuestion();
        } else {
          if (currentSectorIndex < sectors.length - 1) {
            currentSectorIndex++;
            currentSector = sectors[currentSectorIndex];
            currentQuestionIndex = 0;
        
            if(!questions[currentSector]) {
              nextQuestion();
            }

            else{
              currentQuestion = questions[currentSector][currentQuestionIndex];
              showQuestion();
            }
           
          } else {
            // Survey completed
            alert("Survey completed!");
          }
        }
      }

      document.getElementById("prevBtn").addEventListener("click", prevQuestion);
      document.getElementById("nextBtn").addEventListener("click", nextQuestion);
    })
    .catch((error) => {
      console.error("Error fetching Sector Contribution JSON:", error);
    });
});
