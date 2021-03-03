import { emojify, hasEmoji, unemojify } from 'node-emoji'

import { spreadStack } from './operation'
import { Stack, StackElm } from './stack'

// stack を開いて codeUnit として見て emoji にする
const codeUnitToEmoji = (elm: StackElm): Emoji => {
  // stack を開く
  let tmp: number[] = []
  if (typeof elm === 'number') {
    tmp.push(elm)
  }
  if (elm instanceof Stack) {
    tmp = spreadStack(elm.innerStack)
  }

  let str = ''
  for (const num of tmp) {
    str += '%u' + num.toString(16).padStart(4, '0')
  }
  // 🤦🏿‍♀
  const emoji = unescape(str)
  const emojiStr = unemojify(emoji)

  // valid かどうか
  if (!hasEmoji(emoji)) {
    throw Error('failure to codeUnitToEmoji')
  }

  return new Emoji(emojiStr)
}

/** 0️⃣ -> :zero: を表すEmojiクラス */
function emojiToClass(emoji: string): Emoji {
  return new Emoji(unemojify(emoji))
}

class Emoji {
  // :hoge:
  emojiStr: string

  constructor(emojiStr: string) {
    this.emojiStr = emojiStr
  }

  // 👍 を受け取って等しいか
  eq(emoji: string): boolean {
    return this.emojiStr == unemojify(emoji)
  }

  // 🤦🏿‍♀ -> [55358, 56614, 55356, 57343, 8205, 9792, 65039]
  get codeUnit(): number[] {
    const res = []
    const emoji = emojify(this.emojiStr, () => {
      throw Error('failure to get codeUnit')
    })
    for (let i = 0; i < emoji.length; ++i) {
      res.push(emoji[i].charCodeAt(0))
    }
    return res
  }
}

export { Emoji, emojiToClass, codeUnitToEmoji }
