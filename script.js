document.addEventListener("DOMContentLoaded", function () {
  fetch("./sector_contributions.json")
    .then((response) => response.json())
    .then((emissionData) => {
      // console.log(emissionData);
      var calculatedFootprintForEachSector = {};

      // Initialize for each sector the footprint equal to the starting value
      for (var sector in emissionData) {
        calculatedFootprintForEachSector[sector] = 0;
      }

      //negative values are for options that increase the footprint, sounds counter intuitive but it is easier to calculate
      //say if the value is -0.31 , in the formula we will use (1 - (-0.31)) * originalValue which is the same as (1 + 0.31) * originalValue
      
      var questions = {
        "Electricity and Water": [
          {
            "description": "When do you normally do your laundry?",
            "options": {
              "6am - 11am": 0.235,
              "12pm - 6pm": -0.31,
              "6pm - 11pm": 0.31
            }
          },
          {
            "description": "How do you dry your clothes?",
            "options": {
              "Tumble dryer": -0.31,
              "Cloth racks": 0.31
            }
          },
          {
            "description": "How hot do you like your shower?",
            "options": {
              "49 degree celsius": 0.235,
              "I don't really know, I use the default (60 C)": -0.31,
              "25 degree celsius": 0.31
            }
          },
          {
            "description": "At what temperature do you wash your clothes?",
            "options": {
              "Cold": 0.31,
              "Warm": -0.31,
            }
          },
          {
            "description": "Do you turn off both your air conditioner and lights whenever you leave your room?",
            "options": {
              "Yes": 0.31,
              "No": -0.31,
              "Sometimes": 0.235
            }
          },
        ],
        "Transport": [
          {
            "description": "How do you usually travel?",
            "options": {
              "by public bus": 0.235,
              "by taxi or personal car": -0.31,
              "by metro": 0.235,
              "by bike": 0.31,
              "I walk": 0.31
            }
          },
          {
            "description": "How often do you travel on public transportation each week?",
            "options": {
              "I don't use public transportation, I have a car": -0.31,
              "At least two times a week": 0.31
            }
          },
          {
            "description": "How many hours do you fly in an airplane each year?",
            "options": {
              "I can't count, I have a private jet": -0.31,
              "40 hours max": 0.0,
              "Not more than 8 hours": 0.235
            }
          },
          {
            "description": "When you travel by car, how often do you carpool?",
            "options": {
              "I don't travel by car": 0.31,
              "Never": -0.31,
              "All the time": 0.235,
              "Sometimes": -0.235
            }
          },
        ],
        "Oil and Gas": [
          {
            "description": "What type of car do you drive?",
            "options": {
              "Electric": 0.235,
              "Gas or Oil": -0.31,
              "None": 0.31
            }
          }
        ],
        "Industrial Processes": [
          {
          "description": "In changing your wardrobe, what kind of clothes do you buy?",
          "options": {
            "One expensive cloth": 0.235,
            "Second hand clothing": 0.31,
            "Fast fashion": -0.31
          }
        },
        {
          "description": "How often do you order from Amazon?",
          "options": {
            "All the time": -0.31,
            "Never ordered anything to be delivered home.": 0.31,
            "Quite a few times every month.": 0.235
          }
        },
        {
          "description": "Do you have an Amazon Prime fast shipping delivery service?",
          "options": {
            "What is Amazon Prime?": 0.0,
            "Yes": -0.31,
            "No": 0.31
          }
        }],
        "Agriculture": [ {
          "description": "How would you describe your diet?",
          "options": {
            "Meat in every meal": -0.31,
            "Meat in some meals": 0.235,
            "Not a meat person": 0.31
          }
        },
        {
          "description": "How often do you buy locally produced food that is not imported into the UAE?",
          "options": {
            "A lot of food I buy is locally sourced": 0.31,
            "Some of the food I buy is locally sourced": 0.235,
            "I don't worry about where my food comes from.": -0.31
          }
        }],
        "Waste": [ 
          {
          "description": "Of the food you buy, how much is wasted and thrown away?",
          "options": {
            "None, not even a drop.": 0.31,
            "0 - 10%": 0.235,
            "More than 10%": -0.31
          }
        },
        {
          "description": "Do you own any reusable cups, plates, utensils, bottles, or containers?",
          "options": {
            "Yes": 0.31,
            "No": -0.31
          }
        },
        {
          "description": "Do you recycle paper, cans, plastic, glass?",
          "options": {
            "Sometimes": 0.235,
            "All the time": 0.31,
            "Never": -0.31
          }
        }],
      };

      var sectors = Object.keys(emissionData); // get the sectors from the emission data

      currentQuestionIndex = 0; // index of the current question
      currentSectorIndex = 0; // index of the current sector
      currentSector = sectors[currentSectorIndex]; // current sector

      showQuestion(question);

      // function to show the question and options
      function showQuestion() {
        document.getElementById("sectorName").textContent = currentSector; // Show the sector name
        document.getElementById("questionsLeftForSector").innerHTML =
          "Q" +
          (currentQuestionIndex + 1) +
          "/" +
          questions[currentSector].length; // Show the question number
        var questionDiv = document.getElementById("question");
        var optionsDiv = document.getElementById("options");

        currentQuestion = questions[currentSector][currentQuestionIndex];
        questionDiv.textContent =
          "Q" + (currentQuestionIndex + 1) + ". " + currentQuestion.description; // Show the question description
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
        var selectedOption = document.querySelector(
          'input[name="options"]:checked'
        );
        if (selectedOption) {
          var selectedValue = selectedOption.value;
          console.log("Selected value:", selectedValue);

          
          // Update the footprint for the current sector
          originalEmmissionValue = emissionData[currentSector]["Value"];
          numberOfQuestions = questions[currentSector].length;
          calculatedFootprintForEachSector[currentSector] +=  ((1 - selectedValue)/ numberOfQuestions) * originalEmmissionValue;

          console.log( "Footprint for sector " + currentSector + ": " + calculatedFootprintForEachSector[currentSector]);

          if (
            questions[currentSector] &&
            currentQuestionIndex < questions[currentSector].length - 1
          ) {


            currentQuestionIndex++;
            currentQuestion = questions[currentSector][currentQuestionIndex];
            showQuestion();
          } else {
            if (currentSectorIndex < sectors.length - 1) {
              currentSectorIndex++;
              currentSector = sectors[currentSectorIndex];
              currentQuestionIndex = 0;

              if (!questions[currentSector]) {
                nextQuestion();
              } else {
                currentQuestion =
                  questions[currentSector][currentQuestionIndex];
                showQuestion();
              }
            } else {
              // Survey completed
              // print the footprint for each sector
              for (var sector in calculatedFootprintForEachSector) {
                console.log(
                  "Footprint for sector " +
                    sector +
                    ": " +
                    calculatedFootprintForEachSector[sector]
                );
              }
              alert("Survey completed!");
            }
          }
        } else {
          alert("Please select an option!");
        }
      }
      document
        .getElementById("prevBtn")
        .addEventListener("click", prevQuestion);
      document
        .getElementById("nextBtn")
        .addEventListener("click", nextQuestion);
    })
    .catch((error) => {
      console.error("Error fetching Sector Contribution JSON:", error);
    });
});
