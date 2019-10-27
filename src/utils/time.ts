export const msToMinutes = (dur: number) => {
  return Math.floor((dur / (1000 * 60)) % 60)
}
export const msToHours = (dur: number) => {
  return Math.floor(dur / (1000 * 60 * 60))
}
export const minutesToMs = (dur: number) => {
  return dur * 60 * 1000
}
export const hoursToMs = (dur: number) => {
  return dur * 60 * 60 * 1000
}
export const ISODate = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}
