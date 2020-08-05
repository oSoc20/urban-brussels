/** This module enables the bar charts and the timeline chart on the Dashboard Page */

const Chart = {
  /**
   * Create and display a horizontal bar chart
   * @param {string} container - the name of the class or id that will contain the bar chart
   * @param {Object} labels - an array that will contain the labels (X axis)
   * @param {Object} series - a single or multiple arrays for the values (Y axis)
   */
  createHBarChart: (container, labels, series) => {
    // eslint-disable-next-line
    new Chartist.Bar(
      container,
      {
        labels: labels,
        series: [series]
      },
      {
        reverseData: true,
        horizontalBars: true,
        axisX: {
          onlyInteger: true
        },
        axisY: {
          offset: 200,
          showLabel: true
        },
        chartPadding: {
          top: 15,
          right: 15,
          bottom: 5,
          left: 10
        }
      }
    )
  },

  /**
   * Create and display a horizontal bar chart
   * @param {string} container - the name of the class or id that will contain the bar chart
   * @param {Object} labels - an array that will contain the labels (X axis)
   * @param {Object} series - a single or multiple arrays for the values (Y axis)
   */
  createTimeline: (container, labels, series) => {
    const data = labels.map((year, index) => {
      return { x: parseInt(year), y: series[index] }
    })

    // eslint-disable-next-line
    new Chartist.Line(
      container,
      {
        series: [{
          name: 'timeline',
          data
        }]
      },
      {
        low: 0,
        showArea: true,
        showLine: false,
        showPoint: false,
        axisX: {
          // eslint-disable-next-line
          type: Chartist.FixedScaleAxis,
          ticks: [1350, 1400, 1450, 1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000, 2050]
        }
      }
    )
  }
}

export default Chart
