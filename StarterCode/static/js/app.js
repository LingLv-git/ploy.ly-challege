/* global d3, Plotly, updateGauge */
const url = 'data/samples.json';
let metadata = null;
let samples = null;

// download data
d3.json(url).then((samplesData) => {
  samples = samplesData.samples;
  metadata = samplesData.metadata;
  let maxId = 1;
  samples.forEach((sample) => {
    const newMaxId = Math.max(sample.otu_ids);
    if (newMaxId > maxId) { maxId = newMaxId; }
  });

  const body = d3.select('#selDataset');
  body.selectAll('option')
    .data(samplesData.names)
    .enter()
    .append('option')
    .attr('value', (data) => data)
    .text((data) => data);

  optionChanged();
}).catch((err) => console.error(err));

function optionChanged() {
  const id = d3.select('#selDataset').property('value');
  if (samples) {
    for (const sample of samples) {
      if (id === sample.id) {
        updateBarChart(sample);
        updateBubbleChart(sample);
        break;
      }
    }
  }

  if (metadata) {
    for (const m of metadata) {
      if (id == m.id) {
        updateGauge(m);
        const body = d3.select('#sample-metadata');
        body.text('');

        const text = [
          `id: ${m.id}`,
          `ethnicity: ${m.ethnicity}`,
          `gender: ${m.gender}`,
          `age: ${m.age}`,
          `location: ${m.location}`,
          `bbtype: ${m.bbtype}`,
          `wfreq: ${m.wfreq}`,
        ];
        body.append('body').html(text.join('<br>'));
        break;
      }
    }
  }
}

function updateBarChart(sample) {
  if (sample == null) {
    d3.select('bar').text('');
    return;
  }
  const top10OTUsFound = sample.sample_values.map((d, i) => ({
    otu_ids: sample.otu_ids[i],
    otu_labels: sample.otu_labels[i],
    sample_values: d,
  })).sort((a, b) => b.sample_values - a.sample_values)
    .slice(0, 10)
    .reverse();

  const data = [{
    x: top10OTUsFound.map((object) => object.sample_values),
    y: top10OTUsFound.map((object) => `OTU ${object.otu_ids} `),
    text: top10OTUsFound.map((object) => object.otu_labels.split(';').join('<br>')),
    type: 'bar',
    orientation: 'h',
  }];
  const layout = {
    // title: 'Top 10 OTUs Found',
  };
  Plotly.newPlot('bar', data, layout);
}

function updateBubbleChart(sample) {
  if (sample == null) {
    d3.select('bubble').text('');
    return;
  }
  const data = [{
    x: sample.otu_ids,
    y: sample.sample_values,
    text: sample.otu_labels.map((object) => object.split(';').join('<br>')),
    mode: 'markers',
    marker: {
      color: sample.otu_ids,
      size: sample.sample_values,
    },
  }];
  const layout = {
    // title: `Samples for subject ${sample.id}`,
  };
  Plotly.newPlot('bubble', data, layout);
}
