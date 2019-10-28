export default (str: string) => {
  return str.replace(/(\r\n|\n|\r)/gm, '')
}
