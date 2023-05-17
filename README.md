# footprint_indicator_platform
Imagining Possibilities towards Net Zero

Live link : https://footprint-indicator.glitch.me/

Imagining Possibilities towards Net Zero

I call it an indicator because I believe a calculator evokes a sense of accuracy that may not be achievable. An indicator, on the other hand, shows where you currently stand in a more holistic manner and gently prompts you to make changes in your lifestyle.

Everything has been built from scratch, including the computation.

## Emission Data
The emission data is stored in a JSON format, which makes it convenient to update the values using another script. This approach follows a modular design, which is a key principle in software development. It allows for easy maintenance and flexibility, making it simpler to manage and update the data as needed.

# Computation
Each option under each question has a weight,  negative values are for options that increase the footprint, sounds counter intuitive but it is easier to calculate
say if the value is -0.31 , in the formula we will use (1 - (-0.31)) * originalValue which is the same as (1 + 0.31) * originalValue

The footprint is shared among the questions for each sector so that at the end, the sector emission footprint 
is reduced by the UAE 2050 target which is 31%. This only happens when user selects options that reduces footprint by 31% throughout.

The `formula` is below:

```javascript
    // Update the footprint for the current sector
    originalEmmissionValue = emissionData[currentSector]["Value"];
    numberOfQuestions = questions[currentSector].length;
    calculatedFootprintForEachSector[currentSector] +=  ((1 - selectedValue)/ numberOfQuestions) * originalEmmissionValue;

    console.log( "Footprint for sector " + currentSector + ": " + calculatedFootprintForEachSector[currentSector]);
```

This is how the questions weighting look like

```javascript
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
          }
        ]
```
## Reasons behinds colour choices

## Resources USED
### Tech
* Chartjs -  https://www.chartjs.org/
* Database to store reviews - https://www.npmjs.com/package/nedb
* Hosting - https://glitch.com/
* html2canvas -https://www.npmjs.com/package/html2canvas
* jsPDF - https://www.npmjs.com/package/jspdf
* Tech Stack - Nodejs, Express, NeDB
* Footprint Image : https://www.pngegg.com/en/png-bcaeh
* Unsplash - nature images used on the pledges page - https://unsplash.com/

### Emission Data
* Emissions Ranking Worldometer - https://www.worldometers.info/co2-emissions/

* Our World in Data , Co2 emissions - https://ourworldindata.org/co2-emissions

* Co2 emissions ( metric tons per capita ) - https://data.worldbank.org/indicator/EN.ATM.CO2E.PC
