const $ = require('jquery')
const d3 = require('d3')
d3.tip = require('d3-tip')

function getTooltipHTML(d, nodes) {
  const allStrings = []
  allStrings.push(d.title)
  allStrings.push(d.directors.join(', '))
  const getMovienodeRow = (label, n) => {
    allStrings.push(n.title)
    return (
      `
        <div class="d3-tip-row">
          ${label}<span class="class="d3-tip-highlight">${n.title} (${n.year})</span>
        </div>
      `
    )
  }
  let sourceMovie = ''
  if (d.originals.length > 0) {
    const originalMovie = nodes.find(e => e.id === d.originals[0])
    sourceMovie = getMovienodeRow('Original: ', originalMovie)
  }

  let remakes = ''
  if (d.remakes.length > 0) {
    remakes = (
      `
        <div class="d3-tip-row">
          <strong>Remakes (${d.remakes.length})</strong>
        </div>
        ${d.remakes.map(r => getMovienodeRow('', nodes.find(e => e.id === r))).join('')}
      `
    )
  }

  const maxLengthString = Math.max.call(null, allStrings.map(e => e.length))
  const containerWidth = maxLengthString + 8
  return (
    `
    <div style="width=${containerWidth}px">
      <div class="d3-tip-row">
        <strong>
          <a class="d3-tip-highlight" href="${d.titleWikiLink}" target="_newtab">
            ${d.title} (${d.year})
          </a>
        </strong>
      </div>
      <div class="d3-tip-row">
        Directed by <a class="d3-tip-highlight" href="${d.direcorWikiLink}" target="_newtab">${d.directors.join(', ')}</a>
      </div>
      ${sourceMovie}
      ${remakes}
    </div>
    `
  )
}
function addInteractivity(svgContainer, data) {
  const svg = d3.select(svgContainer)
  const node = svg.selectAll('.node-type-movie')
  // Connecting data to nodes
  node.data(data.nodes)

  // Tooltips
  const tip = d3.tip()
    .attr('id', `d3-tip-${data.groupId}`)
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(d => getTooltipHTML(d, data.nodes))

  svg.call(tip)

  node.on('mouseover', tip.show).on('mouseleave', tip.hide)
  svg.on('click', tip.hide)
  $(svgContainer).parents().on('click', tip.hide)
  // Gather relative links and store references for hover - highlighting effects
  node.each((d) => {
    d.associatedLinks = svg.selectAll(`.link-node-id-${d.id}`)
    d.associatedNodes = svg.selectAll(`.node-node-id-${d.id}`)
  })

  // highlight / de highlight relative links
  node.filter(d => (d.type !== 'timeline-node'))
    .on('mouseenter', (d) => {
      if (d.type !== 'year-node') {
        svg.classed('a-node-activated-in-svg', true)
        d.associatedLinks.classed('active-link', true)
        d.associatedNodes.classed('active-node', true)
      }
    }).on('mouseleave', (d) => {
      if (d.type !== 'year-node') {
        d.associatedLinks.classed('active-link', false)
        d.associatedNodes.classed('active-node', false)
        svg.classed('a-node-activated-in-svg', false)
      }
    })
}

module.exports = {
  addInteractivity,
}
