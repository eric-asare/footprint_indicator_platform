document.addEventListener("DOMContentLoaded", function () {
  fetch("./sector_contributions.json")
    .then((response) => response.json())
    .then((emissionData) => {
      console.log(emissionData);
      let electricityAndWaterTotal = emissionData['Electricity and Water']['Value'];



      const numberOfQuestions = 5; // Number of reductions

      const reductionPercentage = 0.31 / numberOfQuestions; // Divide the overall reduction percentage by the number of questions

      if(true){
        electricityAndWaterTotal = electricityAndWaterTotal * (1 - reductionPercentage)
      };
    

      console.log(Math.round(electricityAndWaterTotal)); // Output the final value
    })
    .catch((error) => {
      console.error("Error fetching Sector Contribution JSON:", error);
    });
});


