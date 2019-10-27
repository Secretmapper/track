// Quick hack for duration parsing, heavily modified from
// https://github.com/jkroso/parse-duration/blob/master/index.js

const duration = /(-?\d*\.?\d+(?:e[-+]?\d+)?)\s*([a-z?]*)/gi

parse.minute = parse.min = parse.m = 1000 * 60
parse.hour = parse.hr = parse.min * 60

const hhmm = /(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]/g

/**
 * parse string to duration
 *
 * @param {String} text
 * @return {Number}
 */
function parse (text) {
  var result = 0
  // ignore commas
  const str = text.replace(/(\d),(\d)/g, '$1$2')

  let parsedMin = false
  let parsedHr = false

  str.replace(duration, function (_, n, units) {
    const unitValue =
      parse[units] || parse[units.toLowerCase().replace(/s$/, '')]
    if (unitValue) {
      if (unitValue === parse.min) {
        // we only allow parsing of a unit once
        if (parsedMin) {
          return
        }

        parsedMin = true
      }
      if (unitValue === parse.hr) {
        if (parsedHr) {
          return
        }

        parsedHr = true
      }
      result += parseFloat(n, 10) * unitValue
    }
  })

  if (result === 0) {
    const arr = text.match(hhmm)
    if (arr) {
      const h = arr[0].split(':')[0]
      const m = arr[0].split(':')[1]
      result += h * parse.hr
      result += m * parse.min
    }
  }

  return result
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
