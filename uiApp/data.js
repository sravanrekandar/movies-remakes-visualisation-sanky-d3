/* global window, d3, _
*/

window.getData = (cb) => {
  d3.json('movies.json', (error, json) => {
    let nodes = json
    nodes.length = 20 // Limiting the set for a quick demo
    nodes = nodes.filter(e => e.year > 0)
    const links = []
    let allYears = _.uniq(nodes.map(e => Number(e.year)))
    allYears = allYears.filter(e => isFinite(e))
    allYears = allYears.sort((a, b) => (a - b))
    const leastYear = Math.min.apply(null, allYears)
    const maxYear = Math.max.apply(null, allYears)

    /*
    // Add ten more years to keep the padding
    for (let i = 1; i <= 10; i += 1) {
      allYears.push(maxYear + i)
    }
    */
    // Creating Year nodes
    const yearNodes = allYears.map((e) => {
      const yearNode = {
        id: `year-${e}`,
        title: e.toString(),
        name: e.toString(),
        year: e,
        titleWikiLink: '',
        directors: [
        ],
        direcorWikiLink: '',
        originals: [],
        remarks: [],
        type: 'year-node',
      }
      return yearNode
    })
    yearNodes.forEach((e, idx) => {
      if (idx !== 0) {
        const lastYearNode = yearNodes[idx - 1]
        e.originals.push(lastYearNode.id)
      }
    })

    nodes = [].concat(nodes, yearNodes)
    nodes.forEach((node, nodeIdx) => {
      node.name = node.title

      node.originals.forEach((originalNodeId, idx) => {
        links.push({
          source: nodes.findIndex(e => e.id === originalNodeId),
          target: nodeIdx,
          linkId: `link-${nodeIdx}-${idx}`,
          value: 1, // A dummy value
        })
      })

      if (node.type !== 'year-node') {
        // Map with previous year node


        const yearIndex = allYears.indexOf(Number(node.year))
        if (yearIndex > 0 && yearIndex !== allYears.length - 1) {
          const prevAvailableYear = allYears[yearIndex - 1]
          const yearNodeIndex = nodes.findIndex(e => e.id === `year-${prevAvailableYear}`)
          // Mapping to the prev year
          links.push({
            source: yearNodeIndex,
            target: nodeIdx,
            linkId: `prev-link-${nodeIdx}-year-${node.year}`,
            type: 'year-link',
            value: 1, // A dummy value
          })
        }

        if (yearIndex < allYears.length - 1 && yearIndex !== -1) {
          // Mapping to next available year
          // Mapping to the prev year
          const nextAvailableYear = allYears[yearIndex + 1]
          const yearNodeIndex = nodes.findIndex(e => e.id === `year-${nextAvailableYear}`)
          links.push({
            source: nodeIdx,
            target: yearNodeIndex,
            linkId: `next-link-year-${node.year}-${nodeIdx}`,
            type: 'year-link',
            value: 1, // A dummy value
          })
        }
      }
    })

    cb({
      nodes,
      links,
      leastYear,
      maxYear,
      allYears,
    })
  })
}

