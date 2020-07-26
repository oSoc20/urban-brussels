const Chart = {

  // Create a horizontal bar chart
  /**
     * Create a horizontal bar chart
     * container: the container for the chart
     * options: the options of the chart
     */
  createHBarChart: (container, labels, series) => {
    new Chartist.Bar(container, {
      labels: labels,
      series: [
        series
      ]
    }, {
      reverseData: true,
      horizontalBars: true,
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
    })
  },

  // Create a timeline chart
  createTimeline: (container, labels, series) => {
    new Chartist.Line(container, {
      labels: labels,
      series: [
        series
      ]
    }, {
      low: 0,
      showArea: true,
      showLine: false,
      showPoint: false,
      axisX: {
        labelInterpolationFnc: function (value, index) {
          return index % 12 === 0 ? +value : null
        }
      }
    })
  }

  // Update function

}

export default Chart
