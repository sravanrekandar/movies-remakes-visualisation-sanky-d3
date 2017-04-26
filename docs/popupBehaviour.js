const d3 = require('d3')
const { displayMovieDetails } = require('./miniChart')
function addModalPopup(svg, data, movieNodes) {
  svg = d3.select(svg)
  const node = d3.selectAll('.node-type-movie')
  // Connecting data to nodes
  node.data(data.nodes)

  // Open a modal popup on click
  node.on('click', (d) => {
    displayMovieDetails(d, movieNodes)
  })
}
module.exports = {
  addModalPopup,
}
