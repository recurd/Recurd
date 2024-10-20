import External from '../dist/src/index.js'

let service = await External.findService('spotify', '33bd22c5-0bb1-4a4e-8183-5e10fc0da45e')

console.log(await service.getCurrentlyListening())
console.log(await service.getRecentListens())