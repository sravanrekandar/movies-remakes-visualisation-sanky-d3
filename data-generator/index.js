const jsdom = require('jsdom')
const { JSDOM } = jsdom
const dom = new JSDOM(`<!DOCTYPE html><div id="dataviz-container"></div>`)
global.wondow = dom.window
global.document = dom.window.document
const $ = require('jquery')(dom.window)
require('./parseTables')($)
