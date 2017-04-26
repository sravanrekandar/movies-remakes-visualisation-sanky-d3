const a2m = require.resolve('./rawHTMLData/a-m.html')
const n2z = require.resolve('./rawHTMLData/n-z.html')
const path = require('path')
const moviesJSONPath = path.resolve(__dirname, '../docs/assets/movies.json')
const fs = require('fs')
let movieCount = 0
const movies = []
function parseMovie($, movieTd) {
  const title = movieTd.find('a').eq(0).text() || ''
  let titleWikiLink = movieTd.find('a').eq(0).attr('href') || ''
  titleWikiLink = titleWikiLink ? `https://en.wikipedia.org${titleWikiLink}` : ''

  let year = movieTd.html().match(/\((\d+)\)/gm)

  if (Array.isArray(year)) {
    year = year[0].match(/(\d+)/gm)[0] || ''
  } else {
    year = ''
  }

  let director = movieTd.text()
  director = director.substr(director.indexOf('dir.') + 4)

  let direcorWikiLink = movieTd.find('a').eq(1).attr('href') || ''
  direcorWikiLink = direcorWikiLink ? `https://en.wikipedia.org${direcorWikiLink}` : ''
  movieCount += 1
  return {
    id: movieCount,
    title,
    titleWikiLink,
    year,
    directors: director.split('&'),
    direcorWikiLink,
    originals: [],
    remakes: [],
    remarks: [],
  }
}
function parseTable($, table) {
  const rows = $(table).find('tr')
  rows.each((idx, row) => {
    if (idx === 0) {
      return
    }
    const original = $(row).find('td').eq(1)
    let remakes = $(row).find('td').html().split('<br>')
    remakes = remakes.filter(e => !!e)

    const originalMovie = parseMovie($, original)
    const remakeMovies = remakes.map(r => parseMovie($, $(`<section>${r}</section>`)))

    movies.push(originalMovie)
    remakeMovies.forEach((r) => {
      r.originals.push(originalMovie.id)
      originalMovie.remakes.push(r.id)
      if (r.year === '') {
        r.year = r.original + 1
        r.remarks.push('Missing year, set to +1 of original')
      }
      if (r.directors.length === 0) {
        r.remarks.push('Missing info - Director')
      }

      movies.push(r)
    })
  })
}
function parseTables($) {
  const htmlA2M = fs.readFileSync(a2m, 'utf8')
  const htmlN2Z = fs.readFileSync(n2z, 'utf8')
  const html = `<div>${htmlA2M}${htmlN2Z}</div>`
  $(html).find('table').each((idx, table) => {
    console.log(`Parsing Table ${idx + 1}`)
    parseTable($, table)
  })

  fs.writeFileSync(moviesJSONPath, JSON.stringify(movies, null, 2))
  console.log('=====================================')
  console.log(`${movies.length} movies are available`)
}
module.exports = parseTables
