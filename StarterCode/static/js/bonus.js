/* global Plotly, d3 */
const WIDTH = 500;
const HEIGHT = 500;

const gaugeColors = [
  '#F6F2EC',
  '#F2F0E5',
  '#E8E6CB',
  '#DBE1AE',
  '#D7E49D',
  '#BACC91',
  '#92BE85',
  '#8DB58D',
  '#89B088',
];

function getGuageSteps() {
  const steps = [];
  for (let i = 0; i < 9; i++) {
    steps.push({
      range: [i, i + 1],
      color: gaugeColors[i],
    });
  }
  return steps;
}

function archIndexToRadians(index) {
  let angle = index * (180 / 9);
  if (index > 0) { angle -= 0.5 * (180 / 9); }
  angle = -angle - 90;
  return Math.PI * (angle / 180);
}

function updateGauge(metadata) {
  //  gauge data
  const data = [
    {
      title: {
        text: 'Scrubs per Week',
      },
      type: 'indicator',
      mode: 'gauge',
      value: 0,
      gauge: {
        visible: false,
        axis: {
          visible: false,
          range: [0, 9],
          tickwidth: 0,
        },
        borderwidth: 0,
        steps: getGuageSteps(),
        threshold: {
          line: {
            color: 'rgb(131,3,8)',
            width: 10,
          },
          thickness: 1,
          value: 9,
        },
      },
      domain: {
        row: 0,
        column: 0,
      },

    },
  ];
  // gauge layout
  const layout = {
    title: {
      text: '<b>Belly Button Washing Frequency</b>',
    },
    width: WIDTH,
    height: HEIGHT,
    margin: {
      t: -200, r: 0, l: 0, b: 200,
    },
  };
  Plotly.newPlot('gauge', data, layout);

  d3.select('.angular')
    .selectAll('.bg-arc')
    .append('text')
    .attr('x', (d, i) => 175 * Math.sin(archIndexToRadians(i)))
    .attr('y', (d, i) => 175 * Math.cos(archIndexToRadians(i)))
    .attr('text-anchor', 'middle')
    .text((d, i) => `${i - 1}-${i}`);

  const radians = archIndexToRadians(+metadata.wfreq);
  const M = `M${160 * Math.sin(radians)},${160 * Math.cos(radians)}`;
  const A = `A${150},${0} ${0} ${0},${0} ${0},${0}`;
  const L = `L${0},${0}`;
  // add arrow
  d3.select('.threshold-arc').select('path').attr('d', `${M}${A}${L}${A}Z`);
}
