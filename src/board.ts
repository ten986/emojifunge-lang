import { unemojify } from 'node-emoji'

import { Emoji } from './emoji'

class Board {
  /** ボード */
  board: string[][]

  constructor(file: string) {
    this.board = file.split('\n').map((str) => this.splitEmojiStr(str))
  }

  /** 絵文字変換用 */
  splitEmojiStr(str: string): string[] {
    return unemojify(str)
      .split(/[::]+/)
      .filter((str) => str)
  }

  /** (x, y) にあるか */
  existEmoji(x: number, y: number): boolean {
    return this.getEmojiStr(x, y) !== undefined
  }

  getEmojiStr(x: number, y: number): Emoji | undefined {
    const str = this.board?.[y]?.[x]
    if (str === undefined) {
      return undefined
    }
    return new Emoji(':' + this.board?.[y]?.[x] + ':')
  }
}

export { Board }
