import parse from './parser'

describe('parse', () => {
  it('parses hh:mm format', () => {
    expect(parse('13:00')).toBe(13 * 60 * 60 * 1000)
    expect(parse('0:05')).toBe(5 * 60 * 1000)
    expect(parse('My task is awesome 5:00')).toBe(5 * 60 * 60 * 1000)
    expect(parse('5:22 My task is awesome')).toBe(
      5 * 60 * 60 * 1000 + 22 * 60 * 1000
    )
  })
  it('parses human readable format', () => {
    expect(parse('13hrs')).toBe(13 * 60 * 60 * 1000)
    expect(parse('5m')).toBe(5 * 60 * 1000)
    expect(parse('My task is awesome 5m')).toBe(5 * 60 * 1000)
    expect(parse('5hr 22m My task is awesome')).toBe(
      5 * 60 * 60 * 1000 + 22 * 60 * 1000
    )
  })
  it('only parses values once', () => {
    expect(parse('13hrs 4hrs')).toBe(13 * 60 * 60 * 1000)
    expect(parse('5m 6min')).toBe(5 * 60 * 1000)
  })
})
