import parse from './parser'

const p = (duration, text) => ({
  duration,
  text
})

describe('parse', () => {
  it('parses hh:mm format', () => {
    expect(parse('13:00')).toEqual(p(13 * 60 * 60 * 1000, ''))
    expect(parse('0:05')).toEqual(p(5 * 60 * 1000, ''))
    expect(parse('My task is awesome 5:00')).toEqual(
      p(5 * 60 * 60 * 1000, 'My task is awesome')
    )
    expect(parse('5:22 My task is awesome')).toEqual(
      p(5 * 60 * 60 * 1000 + 22 * 60 * 1000, 'My task is awesome')
    )
  })
  it('parses human readable format', () => {
    expect(parse('13hrs')).toEqual(p(13 * 60 * 60 * 1000, ''))
    expect(parse('5m')).toEqual(p(5 * 60 * 1000, ''))
    expect(parse('My task is awesome 5m')).toEqual(
      p(5 * 60 * 1000, 'My task is awesome')
    )
    expect(parse('5hr 22m My task is awesome')).toEqual(
      p(5 * 60 * 60 * 1000 + 22 * 60 * 1000, 'My task is awesome')
    )
  })
  it('only parses values once', () => {
    expect(parse('13hrs 4hrs')).toEqual(p(13 * 60 * 60 * 1000, '4hrs'))
    expect(parse('5m 6min')).toEqual(p(5 * 60 * 1000, '6min'))
  })
})
