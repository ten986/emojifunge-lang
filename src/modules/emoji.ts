import { unemojify } from 'node-emoji'

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
}

/** 0️⃣ -> :zero: を表すEmojiクラス */
function emojiToClass(emoji: string): Emoji {
  return new Emoji(unemojify(emoji))
}

export { Emoji, emojiToClass }
