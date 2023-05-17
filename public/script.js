
document.addEventListener("DOMContentLoaded", function () {


  // Hide Pledge List
  document.getElementById("pledgeSection").style.display = "none";
  document.getElementById("learnMoreSection").style.display = "none";
  document.getElementById("resultsPage").style.display = "none";
  document.getElementById("aboutSection").style.display = "none";

  // listen for nav bar click
  document.getElementById('hamburger').addEventListener('click', () => {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  })

  // Download Results =======================================================
  window.jsPDF = window.jspdf.jsPDF;
  document.querySelector('#downloadResultsBtn').addEventListener('click', function () {
    var element = document.querySelector('#resultsPage');
    var docPDF = new jsPDF();
    // Capture the content of the element as an image
    docPDF.html(element, {
      callback: function (docPDF) {
        docPDF.save('myFootprint.pdf');
      },
      x: 15,
      y: 15,
      width: 170,
      windowWidth: 650
    });

  });


  // Handle form submission =========================================
  const form = document.getElementById('myForm');
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const pledgeSubmitted = document.getElementById('comment').value;

    const formData = {
      name,
      pledgeSubmitted,
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }

    fetch('/api', options).then(response => {
      console.log(response.body)
    })

    getData();


  });


  // Computation of the footprint =========================================

  var emissionData = {
    "Electricity and Water": {
      "Percentage": 0.346,
      "Value": 6.7,
      "Unit": "ton"
    },
    "Transport": {
      "Percentage": 0.096,
      "Value": 1.86,
      "Unit": "ton"
    },
    "Waste": {
      "Percentage": 0.053,
      "Value": 1.03,
      "Unit": "ton"
    },
    "Oil & Gas": {
      "Percentage": 0.188,
      "Value": 3.64,
      "Unit": "ton"
    },
    "Industrial processes": {
      "Percentage": 0.167,
      "Value": 3.24,
      "Unit": "ton"
    },
    "Agriculture": {
      "Percentage": 0.021,
      "Value": 0.4,
      "Unit": "ton"
    }
  };


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
          "I don't really know, maybe 60 degree celcius": -0.31,
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
          "By public bus": 0.235,
          "By taxi or personal car": -0.31,
          "By metro": 0.235,
          "By bike": 0.31,
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
    "Agriculture": [{
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
  numberOfQuestions = questions[currentSector].length; // number of questions in the current sector

  showQuestion(question);

  // restart if button is clicked. 
  document.getElementById('restartBtn').addEventListener('click', () => {
    restart();
  })

  
  document.getElementById('home').addEventListener('click', () => {
    restart();
  })



  function restart(){
    var distributionChartCanvas = document.getElementById('distributionChart');
    var horizontalBarChartCanvas = document.getElementById('horizontalBarChartCanvas')
    var distributionChartExist = Chart.getChart(distributionChartCanvas);
    var horizontalBarChartExist = Chart.getChart(horizontalBarChartCanvas);
    if (distributionChartExist) {
      distributionChartExist.destroy();
    }

    if (horizontalBarChartExist) {
      horizontalBarChartExist.destroy();
    }

    window.location.href = "index.html";
  }

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
      // console.log("Selected value:", selectedValue);


      // Update the footprint for the current sector
      originalEmmissionValue = emissionData[currentSector]["Value"];
      calculatedFootprintForEachSector[currentSector] += ((1 - selectedValue) / numberOfQuestions) * originalEmmissionValue;

      // console.log( "Footprint for sector " + currentSector + ": " + calculatedFootprintForEachSector[currentSector]);

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

          // Hide Quiz Container
          document.getElementById('questionContainer').style.display = 'None';
          // print the footprint for each sector
          totalFootprint = 0;

          labels = [];
          data = [];

          for (var sector in calculatedFootprintForEachSector) {
            labels.push(sector);
            data.push(calculatedFootprintForEachSector[sector]);
            console.log(
              "Footprint for sector " +
              sector +
              ": " +
              calculatedFootprintForEachSector[sector]
            );
            totalFootprint += calculatedFootprintForEachSector[sector];
          }

          // Results Chartjs =========================================
          //show total footprint
          document.getElementById("resultsPage").style.display = "block";
          document.getElementById("totalFootprint").innerHTML = 'Your footprint is: '+ '<b>' + totalFootprint.toFixed(2) + '</b>'+" ton CO2e";

          // distribution chart
          var ctx = document.getElementById("distributionChart").getContext('2d');

          var distributionChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: labels, // Add data labels
              datasets: [{
                data: data, // Specify the data values array

                borderColor: ['#2196f38c', '#f443368c', '#3f51b570', '#00968896', '#228B22',], // Add custom color border 
                backgroundColor: ['#2196f38c', '#f443368c', '#3f51b570', '#00968896', '#228B22'], // Add custom color background (Points and Fill)
                borderWidth: 1 // Specify bar border width
              }]
            },
            options: {
              responsive: true, // Instruct chart js to respond nicely.
              maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
            }
          });



          // country comparison chart ==============================
          let countryEmissionData = [0.03, 23.75, 35.6];
          countryEmissionData.splice(1, 0, totalFootprint); // insert individual footprint
          var horizontalBarChart = new Chart(horizontalBarChartCanvas, {
            type: 'bar',
            data: {
              labels: ["Greenland", "You", "UAE", "Qatar"],
              datasets: [{
                data: countryEmissionData,
                backgroundColor: ["#8B0000", "#8B0000", "#8B0000", "#8B0000"],
              }]
            },
            type: 'bar',
            options: {
              indexAxis: 'y',
              elements: {
                bar: {
                  borderWidth: 2,
                }
              },
              responsive: true,
              plugins: {
                legend: {
                  display: false
                },
                title: {
                  display: true,
                  text: 'tons of Co2 emitted per person'
                }
              }
            },
          });

          // alert("Survey completed!");
        }
      }
    } else {
      alert("Please select an option!");
    }
  }

  // showPledges
  document.getElementById('pledgeBtn').addEventListener('click', () => {
    showPledges();
  })

  document.getElementById('pledgeBtnNav').addEventListener('click', () => {
    showPledges();
  })

  // show Learn More resources
  document.getElementById('learnMoreBtn').addEventListener('click', () => {
    showLearnMore();
  })

  // show about section
  document.getElementById('aboutBtn').addEventListener('click', () => {
    showAboutSection();
  })


  function showPledges() {
    document.getElementById("resultsPage").style.display = "none";
    document.getElementById("learnMoreSection").style.display = "none";
    document.getElementById("questionContainer").style.display = "none";
    document.getElementById("aboutSection").style.display = "none";
    document.getElementById("pledgeSection").style.display = "block";
    getData();
  }

  function showAboutSection(){
    document.getElementById("pledgeSection").style.display = "none";
    document.getElementById("questionContainer").style.display = "none";
    document.getElementById("learnMoreSection").style.display = "none";
    document.getElementById("resultsPage").style.display = "none";
    document.getElementById("aboutSection").style.display = "block";
  }

  function showLearnMore() {
    document.getElementById("resultsPage").style.display = "none";
    document.getElementById("questionContainer").style.display = "none";
    document.getElementById("pledgeSection").style.display = "none";
    document.getElementById("aboutSection").style.display = "none";
    document.getElementById("learnMoreSection").style.display = "block";

    document.getElementById("resources").innerHTML = "";
    images = ["https://iili.io/HULQoYb.md.png", "https://i.postimg.cc/y823TgsD/cop28.png",
              "https://i.postimg.cc/pdZZcJT0/nyu.png", "https://i.postimg.cc/jSRvH1qW/washing.png",
              "https://i.postimg.cc/YqdLPDfL/meat.png","https://i.postimg.cc/KvCx4nms/nytimefoot.png",
              "https://i.postimg.cc/7YSwG5bH/fashion.png","https://i.postimg.cc/T1CjCd3p/carpooling.png",
              "https://i.postimg.cc/Fswkmd8h/fastshipping.png"



            ]
    links = ["https://www.constellation.com/energy-101/energy-innovation/how-to-reduce-your-carbon-footprint.html", "https://www.cop28.com/en/",
            "https://livableplanet.nyuad.nyu.edu/category/cop28/",
          "https://gulfnews.com/uae/environment/why-you-shouldnt-iron-or-wash-your-clothes-from-12pm-to-6pm-1.2050368",
        "https://www.thenationalnews.com/uae/environment/calls-to-rethink-uae-diet-as-un-study-shows-environmental-damage-of-eating-meat-1.687778",
        "https://www.nytimes.com/guides/year-of-living-better/how-to-reduce-your-carbon-footprint",
        "https://www.worldbank.org/en/news/feature/2019/09/23/costo-moda-medio-ambiente",
        "https://www.arabianbusiness.com/gcc/uae/430277-abu-dhabi-launches-carpooling-system-to-help-reduce-car-numbers",
        "https://depts.washington.edu/sctlctr/news-events/in-the-news/fast-shipping-isn%E2%80%99t-great-environment-%E2%80%94-7-ways-cut-carbon-footprint-your"


      ]

    for (let i = 0; i < images.length; i++) {
      let image = images[i];
      let link = links[i];
      const root = document.createElement('div');
      const content =
        `<div class="card">
      <div class="inner-card">
        <div class="img-wrapper">
          <img src= ${image} alt="">
        </div>
        <div class="content">
          <a href=${link} target="_blank">View</a>
        </div>
      </div>
    </div>`;

      root.innerHTML = content
      document.getElementById("resources").append(root);
    }

  }

  async function getData() {
    const response = await fetch('/api');
    const data = await response.json();

    // show the on the html pages
    document.getElementById("pledges").style.display = "block";
    document.getElementById("pledges").innerHTML = "";

    for (let i = data.length - 1; i >= 0; i--) {
      const item = data[i];
      let image = "https://source.unsplash.com/640x960/?nature,plant"
      const root = document.createElement('div');
      const content =
        `<div class="card">
      <div class="inner-card">
        <div class="img-wrapper">
          <img src= ${image} alt="">
        </div>
        <div class="content">
          <h1> 👑 ${item.name}</h1>
          <p> 🤞 ${item.pledgeSubmitted}</p>
          <p> ⏰ ${item.timestamp}</p>
        </div>
      </div>
    </div>`;

      root.innerHTML = content
      document.getElementById("pledges").append(root);
    }

    console.log(data);

  }

  document
    .getElementById("prevBtn")
    .addEventListener("click", prevQuestion);
  document
    .getElementById("nextBtn")
    .addEventListener("click", nextQuestion);



});
