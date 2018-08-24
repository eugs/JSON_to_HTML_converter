const fs = require('fs');
const FAILED = '✖';
const SKIPPED = '▬';
const PASSED = '✓ '

let reportName = process.argv[2];
let file = fs.readFileSync(reportName);

const fileJSON = JSON.parse(file);
let rows = [];
let outputHTML = '<html><body>';
let outputFeatures = []; 

fileJSON.map((feature) => {
  let outputFeature = {};
  outputFeature.name = feature.name;
  outputFeature.uri = feature.uri;
  outputFeature.scenarios = [];
  // console.log('feature', feature.name);
  // outputRow += `\nFeature: ${feature.name}`;
  // console.log('scenarios:',feature.elements.length);

    feature.elements.map((scenario) => {
      let outputScenario = {};
      outputScenario.name = scenario.name;
      outputFeature.scenarios.push(outputScenario);
    // console.log(`\t${scenario.keyword}: ${scenario.name}`);
      outputScenario.status = PASSED;
      // mark scenario status
      for(let i = 0; i<scenario.steps.length; ++i) {
        let step = scenario.steps[i];
        // console.log('\tstep result:', step.result.status);
        if(step.result.status==='skipped') {
          outputScenario.status = SKIPPED;
        }

        if(step.result.status==='failed') {
          outputScenario.status = FAILED;
          break;
        }
      }

  })

  // console.log(outputFeature);
  outputFeatures.push(outputFeature);
})

console.log('output features', outputFeatures);


// build HTML

outputHTML += '<div style="overflow-x:auto;"> <table>';
outputHTML += '<tr> <th> Feature</th> <th> Status </th> <th> Scenario </th> </tr>';

outputFeatures.map ((feature)=> {
  outputHTML += '<tr>';
  outputHTML += `<td><b>Feature: ${feature.name} </b></td>`;
  outputHTML += `<td>&nbsp; </td>`;
  outputHTML += `<td>&nbsp; </td>`;
  outputHTML += `<td>file: ${feature.uri} </td>`;

  feature.scenarios.map((scenario)=> {
    outputHTML += '<tr>';
    outputHTML += `<td>&nbsp; </td>`;

    if(scenario.status === FAILED) {
      outputHTML += `<td bgcolor="ffc7ce">${scenario.status}</td>`;
      outputHTML += `<td bgcolor="ffc7ce">Scenario: ${scenario.name}</td>`;
    }
    if(scenario.status === PASSED) {
      outputHTML += `<td bgcolor="c6efce">${scenario.status}</td>`;
      outputHTML += `<td>Scenario: ${scenario.name}</td>`;
    }
    outputHTML += '</tr>';
  });

});

// outputHTML += '</tr>'

outputHTML += '</table> </body> </html>'

console.log(outputHTML);

fs.writeFileSync(`${reportName}.html`, outputHTML);
console.log('file saved');
