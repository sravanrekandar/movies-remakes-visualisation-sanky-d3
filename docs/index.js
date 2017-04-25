const { addInteractivity } = require('./interactivity')
function init() {
  const fetchMoviesJSON = new Promise((resolve) => {
    fetch('assets/movies.json')
      .then(r => r.json())
      .then(res => resolve(res))
  })

  const fetchRenderedHTML = new Promise((resolve) => {
    fetch('assets/renderedChart.html')
      .then(res => res.text())
      .then(res => resolve(res))
  })

  Promise.all([fetchMoviesJSON, fetchRenderedHTML]).then((values) => {
    const chartContainer = document.querySelector('#chart')
    const chartHeight = 700 + 50 // 50 for time line
    chartContainer.style.height = `${chartHeight}px`
    chartContainer.innerHTML = values[1]

    addInteractivity(document.querySelector('#moviesSVG'), values[0])
  })
}
init()
