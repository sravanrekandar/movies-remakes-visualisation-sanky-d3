const d3 = require('d3')
d3.tip = require('d3-tip')
const _ = require('lodash')
const { addInteractivity } = require('../interactivity')
const { getNodesAndLinksForSankey } = require('../isomorphic-js/datagen')
const { prepareContainers } = require('../isomorphic-js/plot')

function init() {
  // Fetch data
  fetch('../assets/movies.json')
    .then(r => r.json())
    .then((res) => {
      const data = getNodesAndLinksForSankey(res, 30)
      const chartContainer = document.querySelector('#chart')
      const chartHeight = 400 + 50 // 50 for timeline
      chartContainer.style.height = `${chartHeight}px`
      const svgContainers = prepareContainers(_.cloneDeep(data), chartContainer, chartHeight)

      addInteractivity(document.querySelector('#moviesSVG'), data.nodes)
    })
}
init()
