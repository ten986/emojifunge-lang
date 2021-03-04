import { unemojify } from 'node-emoji'

import { Interpreter } from '@/interpreter/interpreter'

import { Emoji } from './emoji'

type XY = {
  x: number
  y: number
}

class Board {
  /** ボード */
  board: string[][]

  constructor(file: string) {
    this.board = file.split('\n').map((str) => this.splitEmojiStr(str))
  }

  getEntryPoint(): XY[] {
    const res: XY[] = []
    for (let y = 0; y < this.board.length; ++y) {
      for (let x = 0; x < this.board?.[y].length ?? 0; ++x) {
        if (this.getEmoji(x, y)?.eq('🏁')) {
          res.push({ x, y })
        }
      }
    }
    return res
  }

  /** 絵文字変換用 */
  splitEmojiStr(str: string): string[] {
    return unemojify(str)
      .split(/[::]+/)
      .filter((str) => str)
  }

  /** (x, y) にあるか */
  existEmoji(x: number, y: number): boolean {
    const emoji = this.getEmoji(x, y)
    return emoji !== undefined && !emoji.eq('⬛️')
  }

  isWall(x: number, y: number, ip: Interpreter): boolean {
    const emoji = this.getEmoji(x, y)
    return emoji === undefined || emoji.eq('⬛️') || (ip.rideState === 'bicycle' && emoji.eq('🚳'))
  }

  getEmoji(x: number, y: number): Emoji | undefined {
    const str = this.board?.[y]?.[x]
    if (str === undefined) {
      return undefined
    }
    return new Emoji(':' + this.board?.[y]?.[x] + ':')
  }
}

export { Board }
