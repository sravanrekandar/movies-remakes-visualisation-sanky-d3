const d3 = require('d3')
const _ = require('lodash')
d3.sankey = require('d3-sankey').sankey

function plotChart(svg, width, height, data) {
  const formatNumber = d3.format(',.0f')
  const format = d => `${formatNumber(d)} TWh`
  const color = d3.scaleOrdinal(d3.schemeCategory20)
  const sankey = d3.sankey()
    .nodeWidth(data.nodeWidth || 20)
    .nodePadding(data.nodePadding || 15)
    .size([width, height])

  const path = sankey.link(10)
  // We chose to not to polute the actual data
  const nodes = _.cloneDeep(data.nodes)
  const links = _.cloneDeep(data.links)

  sankey
    .nodes(nodes)
    .links(links)
    .layout(32)

  const link = svg.append('g').selectAll('.link')
    .data(links)
    .enter()
    .append('path')
    .attr('class', d => `link ${d.cssClasses.join(' ')}`)
    .attr('d', path)
    // .style('stroke-width', d => (d.type === 'year-link' ? 0 : 1))
    .sort((a, b) => b.dy - a.dy)

  link.append('title')
    .text(d => `${d.source.name}  →  ${d.target.name} ${'\n'} ${format(d.value)}`)

  const node = svg.append('g').selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', d => `node ${d.cssClasses.join(' ')}`)
    .attr('transform', d => `translate(${d.x},${d.y})`)

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

  d3.selectAll('.year-node').remove()
  d3.selectAll('.year-link').remove()
}

function prepareContainers(data, chartContainer, chartHeight) {
  const margin = { top: 1, right: 1, bottom: 6, left: 1 }
  const width = (data.allYears.length * 120) - margin.left - margin.right + 100
  const height = chartHeight - margin.top - margin.bottom


  const moviesSVG = d3.select(chartContainer).append('svg')
    .attr('width', width + margin.left + margin.right + 200)
    .attr('height', height + margin.top + margin.bottom)
    .attr('id', 'moviesSVG')
    .append('g')
    .attr('transform', `translate(${margin.left + 10},${margin.top})`)

  const timelineSVG = d3.select(chartContainer).append('svg')
    .attr('width', width + margin.left + margin.right + 200)
    .attr('height', 50)
    .attr('id', 'timelineSVG')
    .append('g')
    .attr('transform', `translate(${margin.left + 10}, 10)`)

  plotChart(moviesSVG, width, height, {
    nodes: data.nodes,
    links: data.links,
  })
  plotChart(timelineSVG, width, 20, {
    nodes: data.timeLineNodes,
    links: data.timeLineLinks,
  })

  // These returned refernces would be used in the browser to add interactivity to the nodes in the chart
  return {
    moviesSVG,
    timelineSVG,
  }
}
module.exports = {
  plotChart,
  prepareContainers,
}
