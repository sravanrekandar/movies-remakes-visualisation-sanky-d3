const $ = require('jquery')
const d3 = require('d3')
const { plotChart } = require('./isomorphic-js/plot')
const { addInteractivity } = require('./interactivity')
function closeModal() {
  $('#movie-details-modal')
    .addClass('fade')
    .hide()
    .find('#mini-chart')
    .html('')
  $('#d3-tip-miniChart').remove()
}
function showModal(d) {
  const modal = $('#movie-details-modal')
  modal.find('.modal-title').text(`${d.title} (${d.year})`)
  modal.removeClass('fade').show()
  $('#movie-details-modal .close').off('click', closeModal).on('click', closeModal)
}

const { getNodesAndLinksForSankey } = require('./isomorphic-js/datagen')
function displayMovieDetails(d, movieNodes) {
  const currentMovieNode = movieNodes.find(n => n.id === d.id)
  const movieOriginalNodes = d.originals.map(movieId => movieNodes.find(n => n.id === movieId))
  const movieRemakes = d.remakes.map(movieId => movieNodes.find(n => n.id === movieId))
  const nodesForMiniChart = [].concat(currentMovieNode, movieOriginalNodes, movieRemakes)

  const nodesAndLinksData = getNodesAndLinksForSankey(nodesForMiniChart)
  const chartContainer = document.querySelector('#mini-chart')

  const margin = { top: 1, right: 1, bottom: 6, left: 1 }
  const width = (nodesAndLinksData.allYears.length * 60) - margin.left - margin.right + 50

  const chartHeight = 500
  chartContainer.style.height = `${chartHeight}px`
  const height = chartHeight - margin.top - margin.bottom

  const moviesSVG = d3.select(chartContainer).append('svg')
    .attr('width', width + margin.left + margin.right + 200)
    .attr('height', height + margin.top + margin.bottom)
    .attr('id', 'moviesSVG')
    .append('g')
    .attr('transform', `translate(${margin.left + 10},${margin.top})`)

  plotChart(moviesSVG, width, height, {
    nodes: nodesAndLinksData.nodes,
    links: nodesAndLinksData.links,
    nodeWidth: 5,
    nodePadding: 1,
  })
  nodesAndLinksData.groupId = 'miniChart'
  addInteractivity(document.querySelector('#mini-chart svg'), nodesAndLinksData)
  showModal(d)
}
module.exports = {
  displayMovieDetails,
}
