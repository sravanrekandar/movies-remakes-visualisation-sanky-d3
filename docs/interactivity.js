const d3 = require('d3')
d3.tip = require('d3-tip')
function addInteractivity(svg, nodes) {
  const node = d3.selectAll('.node-movie')

  // Connecting data to nodes
  node.data(nodes)

  // Open a new window on click
  node.on('click', (d) => {
    window.open(d.titleWikiLink, '_newtab')
  })
/*
  // Tooltips
  const tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(d => `Directed by ${d.directors.join(', ')}`)
  d3.select(svg).call(tip)
  node.filter(d => (d.type !== 'timeline-node'))
    .on('mouseenter', tip.show).on('mouseleave', tip.hide)
*/
  // Gather relative links and store references for hover - highlighting effects
  node.each((d) => {
    d.associatedLinks = d3.selectAll(`.link-node-id-${d.id}`)
    d.associatedNodes = d3.selectAll(`.node-node-id-${d.id}`)
  })

  // highlight / de highlight relative links
  node.filter(d => (d.type !== 'timeline-node'))
    .on('mouseenter', (d) => {
      if (d.type !== 'year-node') {
        d.associatedLinks.classed('active-link', true)
        d.associatedNodes.classed('active-node', true)
      }
    }).on('mouseleave', (d) => {
      if (d.type !== 'year-node') {
        d.associatedLinks.classed('active-link', false)
        d.associatedNodes.classed('active-node', false)
      }
    })
}

module.exports = {
  addInteractivity,
}
