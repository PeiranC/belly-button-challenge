const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function init() {
    let selector = d3.select("#selDataset");
  
    d3.json(url).then((data) => {
      let sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      let firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json(url).then((data) => {
      let metadata = data.metadata;
      let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      let result = resultArray[0];
      let PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
  
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  function buildCharts(sample) {
    d3.json(url).then((data) => {
      console.log(data);
      let samplesArray = data.samples;
      let resultArray = samplesArray.filter(sampleObj => sampleObj.id == sample);
  
      let metadataArray = data.metadata;
      let resultMetadata = metadataArray.filter(sampleObj => sampleObj.id == sample);
  
      let firstSample = resultArray[0];
      console.log(firstSample);
  
      let firstMetadata = resultMetadata[0];
      console.log(firstMetadata);
  
      let otuIds = firstSample.otu_ids;
      let otuLabels = firstSample.otu_labels;
      let sampleValues = firstSample.sample_values;
  
      let washFrequency = parseFloat(firstMetadata.wfreq);
  
      let yticks = otuIds.slice(0, 10).map(id => "OTU " + id + " ").reverse();
  
      let barData = [{
        x: sampleValues.slice(0, 10).reverse(),
        y: yticks,
        text: otuLabels.slice(0, 10).reverse(),
        type: "bar",
        orientation:"h",
        marker: {
          color: sampleValues.slice(0, 10).reverse(),
          colorscale: "Electric"
        }
        }];
      let barLayout = {
        title: "TOP 10 Bacteria Cultures Found"
      }
      Plotly.newPlot("bar", barData, barLayout);
    
  
      let bubbleData = [{
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        type: "scatter",
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: "Earth"
        }
      }];
  
      let bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OTU ID"},
        margins: {
          l: 0,
          r: 0,
          b: 0,
          t: 0     
        },
        hovermode: "closest"
      };
  
      Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  
      let gaugeData = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: washFrequency,
        title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {
            range: [0, 10], 
            tickwidth: 4, 
            tickcolor: "black"},
          bar: {color: "black"},
          steps: [
            {range: [0, 2], color: "grey"},
            {range: [2, 4], color: "lightblue"},
            {range: [4, 6], color: "yellow"},
            {range: [6, 8], color: "orange"},
            {range: [8, 10], color: "red"},
          ]}
      }];
      
      let gaugeLayout = { 
        width: 500, 
        height: 450,
        margin: {t: 0, r: 0, l: 0, b: 0}
      };
  
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  
  
    });
  }