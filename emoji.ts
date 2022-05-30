import * as fs from 'fs'
import { emojify, unemojify } from 'node-emoji'
import { argv } from 'process'

// プログラム
const path = argv[2]
const board = fs.readFileSync(path).toString()

const splitEmojiStr = (str: string): string[] => {
  return unemojify(str)
    .split(/[::]+/)
    .filter((str) => str)
}

const emojinum = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']

const emojiBoard: string[][] = board.split('\n').map((str) => splitEmojiStr(str))

// console.log(emojiBoard[0][0])

let res = ''

for (let i = 0; ; i++) {
  const emojiStr = emojiBoard?.[i]?.[0]
  if (emojiStr === undefined) {
    break
  }
  for (let j = 0; ; j++) {
    const emojiStr = emojiBoard?.[i]?.[j]
    if (emojiStr === undefined) {
      break
    }
    const emoji = emojify(':' + emojiStr + ':', () => {
      throw Error('failure to get codeUnit')
    })

    let str = ''

    let cnt = 0

    for (let i = 0; i < emoji.length; ++i) {
      str += '0️⃣'
      cnt++
      let num = emoji[i].charCodeAt(0)

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

    str += emojinum[emoji.length]
    cnt += 1

    str += '💌'
    cnt += 1

    res += str
  }
  res += '📧'
}

console.log(res)
// console.log(cnt)

// let whitestr = ''

// for (let i = 0; i < cnt; ++i) {
//   whitestr += '⬜️'
// }
// console.log(whitestr)

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
