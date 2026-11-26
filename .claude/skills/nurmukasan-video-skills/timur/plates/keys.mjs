import fs from 'fs'
const s = fs.readFileSync('plates.jsx', 'utf8'); const m = s.slice(s.indexOf('export const PLATES = {'), s.indexOf('export const ORDER'))
console.log([...m.matchAll(/(\w+): (?=[a-zA-Z]+\(|\[)/g)].map((x) => x[1]).join(' '))
