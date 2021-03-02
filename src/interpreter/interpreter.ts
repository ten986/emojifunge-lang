import { Board } from '@/board'
import { Stack } from '@/stack'

import { Action, EmojiAction } from './action'
import { calcActions } from './methods/calc'
import { commentActions } from './methods/comment'
import { conditionalActions } from './methods/conditional'
import { inoutActions } from './methods/inout'
import { mailboxActions } from './methods/mailbox'
import { miscActions } from './methods/misc'
import { moveActions, rotateClockwise } from './methods/move'
import { operationNumActions } from './methods/operationNum'
import { programControlActions } from './methods/programControl'
import { pushNumberActions } from './methods/pushNumber'
import { randomActions } from './methods/random'
import { stackActions } from './methods/stack'

type EndState = 'normal' | 'end'
type CommentState = 'normal' | 'commented'

const emojiActionsArray: EmojiAction[][] = [
  inoutActions,
  programControlActions,
  pushNumberActions,
  randomActions,
  calcActions,
  moveActions,
  stackActions,
  conditionalActions,
  operationNumActions,
  mailboxActions,
  miscActions,
  commentActions,
]

class Interpreter {
  /** ファイルを受け取るボード */
  board: Board

  /** 入力 */
  input: string

  /** 入力（最初） */
  firstInput: string

  /** 場所 */
  x: number
  y: number

  /** 移動 */
  dirX: number
  dirY: number

  /** 状態 */
  endState: EndState
  commentState: CommentState

  /** 回数操作 */
  operationNum: Stack

  /** mailbox */
  mailBox: Stack

  /** スタック */
  stack: Stack

  /** アウトプット全体 */
  allOutput: string

  /** :hoge: -> Action */
  emojistrToAction: Map<string, Action>

  constructor(file: string, input: string) {
    this.x = 0
    this.y = 0
    this.dirX = 1
    this.dirY = 0
    this.endState = 'normal'
    this.commentState = 'normal'

    this.input = input
    this.firstInput = input

    this.board = new Board(file)
    this.stack = new Stack()

    this.mailBox = new Stack()
    this.operationNum = new Stack()

    this.allOutput = ''

    this.emojistrToAction = new Map<string, Action>()
    this.registerAction()
  }

  /** emoji action の対応を生成取得 */
  getEmojiActions(): EmojiAction[] {
    let emojiActions: EmojiAction[] = []
    for (const emojiActionsElm of emojiActionsArray) {
      emojiActions = emojiActions.concat(emojiActionsElm)
    }
    return emojiActions
  }

  /** 実行できる action の登録 */
  registerAction(): void {
    const emojiActions = this.getEmojiActions()
    emojiActions.forEach(({ emoji, action }) => {
      this.emojistrToAction.set(emoji.emojiStr, action)
    })
  }

  /** 終わった？ */
  isEnd(): boolean {
    return this.endState == 'end'
  }

  /** 出力 */
  output(str: string): void {
    this.allOutput += str
    process.stdout.write(str)
  }

  /** 出力 */
  error(str: string): void {
    console.error(str)
  }

  /** 1ステップ */
  step(): void {
    // 命令実行回数
    let op = 1
    if (this.operationNum.length > 0) {
      op = this.operationNum.pop() ?? 1
    }
    for (let i = 0; i < op; ++i) {
      this.exec()
      if (this.isEnd()) {
        return
      }
    }

    this.move()
    if (this.isEnd()) {
      return
    }
    // console.log('x:' + this.x + ', y:' + this.y)
    // console.log('dx:' + this.dirX + ', dy:' + this.dirY)
    // console.log(this.stack)
  }

  /** 最後まで */
  stepAll(): void {
    for (;;) {
      this.step()
      if (this.isEnd()) {
        break
      }
    }
  }

  /** dir の方向に進む */
  move(): void {
    // リトライ回数
    let retryCount = 0
    const retryMax = 4

    while (retryCount < retryMax) {
      // 進む場所
      const dx = this.x + this.dirX
      const dy = this.y + this.dirY

      // dir の方向に進む
      if (this.board.existEmoji(dx, dy)) {
        this.x = dx
        this.y = dy
        return
      }

      // 右回転
      rotateClockwise(this)
      retryCount++
    }

    // 移動できずに終了
    this.endState = 'end'
  }

  /** 足元のやつを実行 */
  exec(): void {
    // 現在位置のemoji
    const emoji = this.board.getEmoji(this.x, this.y)

    // emoji がない
    if (emoji === undefined) {
      this.error('emoji not found')
      this.endState = 'end'
      return
    }

    // コメント
    if (this.commentState == 'commented') {
      if (emoji.eq('🍚')) {
        this.commentState = 'normal'
      }
      return
    }

    // action を取得
    const action = this.emojistrToAction.get(emoji.emojiStr)
    if (action !== undefined) {
      action(this)
      return
    }

    // unexpected token
    this.error('unexpected emoji')
    this.endState = 'end'
    return
  }
}

export { Interpreter }
