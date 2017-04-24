/*
global d3, window
*/

const formatNumber = d3.format(',.0f')
const format = d => `${formatNumber(d)} TWh`
const color = d3.scale.category20()

function plot(svg, width, height, data) {
  const sankey = d3.sankey()
    .nodeWidth(20)
    .nodePadding(10)
    .size([width, height])

  const path = sankey.link(10)

  sankey
    .nodes(data.nodes)
    .links(data.links)
    .layout(32)

  const link = svg.append('g').selectAll('.link')
    .data(data.links)
    .enter()
    .append('path')
    .attr('class', d => `link ${d.cssClasses.join(' ')}`)
    .attr('d', path)
    // .style('stroke-width', d => (d.type === 'year-link' ? 0 : 1))
    .sort((a, b) => b.dy - a.dy)

  link.append('title')
    .text(d => `${d.source.name}  →  ${d.target.name} ${'\n'} ${format(d.value)}`)

  const node = svg.append('g').selectAll('.node')
    .data(data.nodes)
    .enter()
    .append('g')
    .attr('class', d => `node ${d.cssClasses.join(' ')}`)
    .attr('transform', d => `translate(${d.x},${d.y})`)


  /*
      node.call(d3.behavior.drag()
        .origin(function (d) { return d; })
        .on('dragstart', function () { this.parentNode.appendChild(this); })
        .on('drag', dragmove));
  */
  node.append('rect')
    .attr('height', d => (d.dy < 10 ? 10 : d.dy))
    .attr('width', sankey.nodeWidth())
    .attr('class', 'node-rect')
    .style('fill', (d) => {
      d.color = (d.type === 'timeline-node') ? '#c7c7c7' : color(d.name.replace(/ .*/, ''))
      return d.color
    })
    .style('stroke', d => d3.rgb(d.color).darker(2))
    .append('title')
    .text(d => `${d.titleWikiLink}`)

  // Open a new window on click
  node.on('click', (d) => {
    window.open(d.titleWikiLink, '_newtab')
  })

  // text
  const nodeText = node.append('text')
    .attr('x', -6)
    .attr('y', d => d.dy / 2)
    .attr('dy', '.35em')
    .attr('text-anchor', 'end')
    .attr('transform', null)
    .text(d => ((d.type === 'timeline-node') ? '' : `${d.title}`))
    // .filter(d => d.x < width / 2)
    .attr('x', 6 + sankey.nodeWidth())
    .attr('text-anchor', 'start')
    .attr('class', d => `node-id-${d.id}`)

  nodeText.append('tspan')
    .attr('x', (d => ((d.type === 'timeline-node') ? -5 : 25)))
    .attr('dy', (d => ((d.type === 'timeline-node') ? 22 : 15)))
    .text(d => ((d.type === 'timeline-node') ? d.year : `(${d.year})`))

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

  // remove year nodes and links
  d3.selectAll('.year-node').remove()
  d3.selectAll('.year-link').remove()
}
window.getData((data) => {
  console.log(data)
  const margin = { top: 1, right: 1, bottom: 6, left: 1 }
  const width = (data.allYears.length * 120) - margin.left - margin.right + 100
  const height = 400 - margin.top - margin.bottom


  const moviesSVG = d3.select('#chart').append('svg')
    .attr('width', width + margin.left + margin.right + 200)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left + 10},${margin.top})`)

  const timelineSVG = d3.select('#chart').append('svg')
    .attr('width', width + margin.left + margin.right + 200)
    .attr('height', 50)
    .append('g')
    .attr('transform', `translate(${margin.left + 10}, 10)`)

  plot(moviesSVG, width, height, {
    nodes: data.nodes,
    links: data.links,
  })
  plot(timelineSVG, width, 20, {
    nodes: data.timeLineNodes,
    links: data.timeLineLinks,
  })
})
