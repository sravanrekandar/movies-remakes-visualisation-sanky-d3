const fs = require('fs')
const path = require('path')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const dom = new JSDOM(`<!DOCTYPE html><div id="dataviz-container"></div>`)
global.wondow = dom.window
global.document = dom.window.document
const { getNodesAndLinksForSankey } = require('../docs/isomorphic-js/datagen')
const moviesNodes = require('../docs/assets/movies.json')
const { prepareContainers } = require('../docs/isomorphic-js/plot')

const chartContainer = dom.window.document.querySelector('#dataviz-container')
const data = getNodesAndLinksForSankey(moviesNodes)
const chartHeight = 700
prepareContainers(data, chartContainer, chartHeight)

const renderedHTMLPath = path.resolve(__dirname, '../docs/assets/renderedChart.html')
fs.writeFileSync(renderedHTMLPath, chartContainer.innerHTML)
console.log(`Successfully written html to ${renderedHTMLPath}`)
