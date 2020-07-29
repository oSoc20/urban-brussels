/** This module enables the pulsing dot component on all maps in the application */

const pulsingDot = {
  init: (map) => {
    const size = 200
    const pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      onAdd: function () {
        const canvas = document.createElement('canvas')
        canvas.width = this.width
        canvas.height = this.height
        this.context = canvas.getContext('2d')
      },

      render: function () {
        const duration = 2000
        const t = (performance.now() % duration) / duration

        const radius = (size / 2) * 0.3
        const outerRadius = (size / 2) * 0.7 * t + radius
        const context = this.context

        context.clearRect(0, 0, this.width, this.height)
        context.beginPath()
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        )
        context.fillStyle = 'rgba(33, 33, 68,' + (1 - t) + ')'
        context.fill()

        context.beginPath()
        context.arc(
          this.width / 2,
          this.height / 2,
          radius,
          0,
          Math.PI * 2
        )
        context.fillStyle = 'rgba(33, 33, 68, 1)'
        context.strokeStyle = 'white'
        context.lineWidth = 2 + 4 * (1 - t)
        context.fill()
        context.stroke()

        this.data = context.getImageData(
          0,
          0,
          this.width,
          this.height
        ).data

        map.triggerRepaint()
        return true
      }
    }
    map.on('load', function () {
      map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 })
    })
  }
}

export default pulsingDot
