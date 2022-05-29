import * as fs from 'fs'
// import { argv } from 'process'

// // プログラム
// const path = argv[2]
// const board = fs.readFileSync(path).toString()

// 入力
const input = fs.readFileSync(0).toString().trim()

const emojinum = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']

let str = ''

let cnt = 0

for (let i = 0; i < input.length; ++i) {
  str += '0️⃣'
  cnt++
  let num = input[i].charCodeAt(0)
  console.log(num)
  const nums: number[] = []
  while (num > 0) {
    nums.push(num % 10)
    num = Math.floor(num / 10)
  }

  for (let j = nums.length - 1; j >= 0; --j) {
    str += emojinum[nums[j]] + '➕'
    cnt += 2
    if (j != 0) {
      str += '🔟✖️'
      cnt += 2
    }
  }
}

str += emojinum[input.length]
cnt += 1

str += '💌🔣'
cnt += 2

console.log(str)
console.log(cnt)

let whitestr = ''

for (let i = 0; i < cnt; ++i) {
  whitestr += '⬜️'
}
console.log(whitestr)

// const codeUnit = (emoji: string): number[] => {
//   const res: number[] = []
//   // const emoji = emojify(unemojify(str), () => {
//   //   throw Error('failure to get codeUnit')
//   // })
//   for (let i = 0; i < emoji.length; ++i) {
//     res.push(emoji[i].charCodeAt(0))
//   }
//   return res
// }

// console.log(codeUnit(input))
