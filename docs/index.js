const { addInteractivity } = require('./interactivity')
const { addModalPopup } = require('./popupBehaviour')
const { getNodesAndLinksForSankey } = require('./isomorphic-js/datagen')
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

    const movieNodes = values[0]
    const nodesAndLinksData = getNodesAndLinksForSankey(movieNodes)
    const chartSVGContainer = document.querySelector('#moviesSVG')
    nodesAndLinksData.groupId = 'staticRender'
    addInteractivity(chartSVGContainer, nodesAndLinksData)
    addModalPopup(chartSVGContainer, nodesAndLinksData, movieNodes)
  })
}
init()
