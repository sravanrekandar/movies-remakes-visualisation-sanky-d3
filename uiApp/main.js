/*
global d3, window
*/

window.getData((data) => {
  const margin = { top: 1, right: 1, bottom: 6, left: 1 }
  const width = (data.allYears.length * 100) - margin.left - margin.right
  const height = 400 - margin.top - margin.bottom

  const formatNumber = d3.format(',.0f')
  const format = d => `${formatNumber(d)} TWh`
  const color = d3.scale.category20()

  const svg = d3.select('#chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const sankey = d3.sankey()
    .nodeWidth(20)
    .nodePadding(10)
    .size([width, height])

  const path = sankey.link()

  sankey
    .nodes(data.nodes)
    .links(data.links)
    .layout(32)

  const link = svg.append('g').selectAll('.link')
    .data(data.links)
    .enter()
    .append('path')
    .attr('class', d => `link ${d.type === 'year-link' ? 'year-link' : ''}`)
    .attr('d', path)
    .style('stroke-width', d => (d.type === 'year-link' ? 0 : 1))
    .sort((a, b) => b.dy - a.dy)

  link.append('title')
    .text(d => `${d.source.name}  →  ${d.target.name} ${'\n'} ${format(d.value)}`)

  const node = svg.append('g').selectAll('.node')
    .data(data.nodes)
    .enter()
    .append('g')
    .attr('class', d => `node node-id-${d.id} ${d.type === 'year-node' ? 'year-node' : ''}`)
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
    .style('fill', (d) => {
      d.color = (d.type === 'year-node') ? 'transparent' : color(d.name.replace(/ .*/, ''))
      return d.color
    })
    .style('stroke', d => d3.rgb(d.color).darker(2))
    .append('title')
    .text(d => `${d.titleWikiLink}`)

  // Open a new window on click
  node.on('click', (d) => {
    window.open(d.titleWikiLink, '_newtab')
  })

  node.append('text')
    .attr('x', -6)
    .attr('y', d => d.dy / 2)
    .attr('dy', '.35em')
    .attr('text-anchor', 'end')
    .attr('transform', null)
    .text(d => `${d.name} (${d.year})`)
    .filter(d => d.x < width / 2)
    .attr('x', 6 + sankey.nodeWidth())
    .attr('text-anchor', 'start')
    .attr('class', d => `node-id-${d.id}`)
})
