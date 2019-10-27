// Quick hack for duration parsing, heavily modified from
// https://github.com/jkroso/parse-duration/blob/master/index.js

const duration = /(-?\d*\.?\d+(?:e[-+]?\d+)?)\s*([a-z?]*)/gi

parse.minute = parse.min = parse.m = 1000 * 60
parse.hour = parse.hr = parse.h = parse.min * 60

/**
 * parse string to duration, and return string without duration
 *
 * @param {String} text
 * @return {{ duration: Number, text: String }}
 */
function parse (text) {
  var result = 0
  // ignore commas
  const str = text.replace(/(\d),(\d)/g, '$1$2')

  let parsedMin = null
  let parsedHr = null

  str.replace(duration, function (match, n, units, offset) {
    const unitValue =
      parse[units] || parse[units.toLowerCase().replace(/s$/, '')]
    if (unitValue) {
      if (unitValue === parse.min) {
        // we only allow parsing of a unit once
        if (parsedMin) {
          return
        }

        parsedMin = { match, offset }
      }
      if (unitValue === parse.hr) {
        if (parsedHr) {
          return
        }

        parsedHr = { match, offset }
      }
      result += parseFloat(n, 10) * unitValue
    }
  })

  if (result !== 0) {
    // remove substring of parsed hr/min
    text = text.split('').map((l, i) => {
      const insideHr =
        parsedHr &&
        (parsedHr.offset <= i && i <= parsedHr.offset + parsedHr.match.length)
      const insideMin =
        parsedMin &&
        (parsedMin.offset <= i &&
          i <= parsedMin.offset + parsedMin.match.length)

      return insideHr || insideMin ? '' : l
    })
    text = text.join('')
  } else {
    const hhmm = /(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]/g
    // parse using hh:mm format
    const match = hhmm.exec(text)
    if (match) {
      const h = match[0].split(':')[0]
      const m = match[0].split(':')[1]
      result += h * parse.hr
      result += m * parse.min

      text = removeSubstring(text, match.index, match[0].length)
    }
  }

  return {
    duration: result,
    text: text.trim()
  }
}

// human readable format was parsed, trim substring
function removeSubstring (str, offset, length) {
  return str.substr(0, offset) + str.substr(offset + length)
}

export default parse

/*
The MIT License

Copyright (c) 2013 Jake Rosoman <jkroso@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
