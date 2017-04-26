const d3 = require('d3')
d3.tip = require('d3-tip')
const { addInteractivity } = require('./interactivity')
const { addModalPopup } = require('./popupBehaviour')
const { getNodesAndLinksForSankey } = require('./isomorphic-js/datagen')
const { prepareContainers } = require('./isomorphic-js/plot')

function init() {
  // Fetch data
  fetch('assets/movies.json')
    .then(r => r.json())
    .then((res) => {
      const movieNodes = res
      const nodesAndLinksData = getNodesAndLinksForSankey(movieNodes, { limitNodesCount: 30 })
      const chartContainer = document.querySelector('#chart')
      const chartHeight = 400 + 50 // 50 for timeline
      chartContainer.style.height = `${chartHeight}px`
      prepareContainers(nodesAndLinksData, chartContainer, chartHeight)

      const chartSVGContainer = document.querySelector('#moviesSVG')
      nodesAndLinksData.groupId = 'dynamicRender'
      addInteractivity(chartSVGContainer, nodesAndLinksData, movieNodes)
      addModalPopup(chartSVGContainer, nodesAndLinksData, movieNodes)
    })
}
init()
