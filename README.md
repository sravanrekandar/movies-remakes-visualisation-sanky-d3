# Movie Remakes Visualisation Sanky D3
## [ViewDemo](https://github.com/sravanrekandar/movies-remakes-visualisation-sanky-d3)
Image

## Introduction
This application is a proof of concept to visualise a big set of objects in a timeline order and their relations to other objects in the past.

This chart displays multiple nodes(Movies) in a timeline order. Each movie node connect's to it's original movie in the past and the remakes in the future.

Interactivity is the primary feture of the chart. Hovering, clicking and searching (work under progress) functionalities gives users a smooth experience to navigate through the data.
<img src="docs/favicomatic/movie visualisation drawing.jpg" width="80%" />

## Insights into the work
* Raw Data: I found this wiki page [List_of_film_remakes](https://en.wikipedia.org/wiki/List_of_film_remakes_(A%E2%80%93M)) while searching for a generic suitable sample data.
* JSON Data: Taking the HTML from the wiki pages, I wrote a [nodejs](https://nodejs.org/en/) script to create json object
* Charting Libraries: I leveraged the awesome libraries [D3JS](https://d3js.org/) and [Sankey Diagrams](https://bost.ocks.org/mike/sankey/) to Plot Nodes and Links on the graph.
* First Approach: I created a simple web page which would acquire the data through an ajax call and then calculates the positions of Nodes and Links using d3 and sankey libraries
* Problem: The First approach was working fine till I tried to render about 50 nodes. After that, the browser (chrome) is crashing. the problem was with the computing of the positions.
* Second approach: In order to avoid the computation on the browser side, I used [nodejs]() and [jsdom]() to render the chart offline and store the html to a file
* Isomorphic Javascript: And I wanted to keep both the static rendering and dynamic rendering pages. For this, I adopted commonJS approach which helped me to write isomorphic javascript which can be executed on nodejs as well as on browser
* Bundling: To use the isomorphic javascript on browser, I used [Browserify](http://browserify.org/)
* Work Force: To make the workflow faster and easier, I used [Gulp](http://gulpjs.com/) and [BrowserSync]()https://www.browsersync.io/

Image

## Development
### Install gulp globally
```
$ npm install --global gulp
```

### Cloning the repo and installing dependencies
```
$ git clone https://github.com/sravanrekandar/movies-remakes-visualisation-sanky-d3.git
$ cd movies-remakes-visualisation-sanky-d3
$ npm install
```

### Data
For the data, I am using the wiki raw html to generate json data. The json data is checked in and is already available. You can skip this step if you want to use the same data.
If you want to make any changes, you can hack into data-generator/index.js. Then run the below command
```
$ gulp generate-json-from-wiki-html
```
Or if you are planning to create your own choice of data set, place the data under docs/assets/<movies.json>

```
$ gulp dev
```
This opens up a new browser tab. If not browse through http://localhost:3000

### File structure
```
Docs/
----assets/
    `----movies.json // the actual data file
    `---renderedChart.html // The prerendered d3 chart
----bundles
    `----* // Browserify generated artifacts
    `----* // We insert these files in html pages using <script> tags
----isomorphic-js
    `----* // Files to be used on nodejs or browser
    `----* // To generate the chart
----* // HTML, CSS and other web app files
--------prerenderChart
    `----* // These files use the isomorphic-js/*.js files
    `----* // And create assets/renderedChart.html

```

# Deploying
```
$ gulp build
```
Then start a static file server on docs/ 

# About me
I am Sravan Kumar Rekandar, a UI developer (and a JavaScript full stack developer). I fancy beautiful, intutive user interfaces and visualisations. Along with the love for beautiful UIs, I love to build some!

# Miscellaneous
Miscellaneous things to look back after years and feel good about. [Mike Bostok's blog](https://bost.ocks.org/mike/), [Visual Studio code](https://code.visualstudio.com/), [ESLint](http://eslint.org/)
