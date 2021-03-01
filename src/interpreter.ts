import { Board } from '@/board'
import { Stack } from '@/stack'

// this is 最悪な sleep
function sleep(ms: number): void {
  const time = new Date().getTime()
  // eslint-disable-next-line no-empty
  while (new Date().getTime() < time + ms) {}
}

type EndState = 'normal' | 'end'
type CommentState = 'normal' | 'commented'

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
  }

  /** 終わった？ */
  isEnd(): boolean {
    return this.endState == 'end'
  }

  /** 出力 */
  output(str: string): void {
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
      ;[this.dirX, this.dirY] = [-this.dirY, this.dirX]
      retryCount++
    }

    // 移動できずに終了
    this.endState = 'end'
  }

  /** 足元のやつを実行 */
  exec(): void {
    // 現在位置のemoji
    const emoji = this.board.getEmojiStr(this.x, this.y)

    // emoji がない
    if (emoji === undefined) {
      this.error('emoji not found')
      this.endState = 'end'
      return
    }

    if (this.commentState == 'commented') {
      if (emoji.eq('🍚')) {
        this.commentState = 'normal'
      }
      return
    }

    // コメント ---
    if (emoji.eq('🍚')) {
      this.commentState = 'commented'
      return
    }

    // 入出力 -------
    // 数値入力
    if (emoji.eq('ℹ️')) {
      this.stack.push(+(this.input.match(/-?\d+/) || [0])[0] || 0)
      this.input = this.input.replace(/^[^]*?\d+/, '')
      return
    }
    // 文字入力
    if (emoji.eq('🔤')) {
      this.stack.push(this.input ? this.input.charCodeAt(0) : -1)
      this.input = this.input.slice(1)
      return
    }
    // 数値出力
    if (emoji.eq('🔢')) {
      this.output(this.stack.pop().toString())
      return
    }
    // 文字出力
    if (emoji.eq('🔡')) {
      this.output(String.fromCharCode(this.stack.pop()))
      return
    }
    // cat
    if (emoji.eq('🐱')) {
      this.output(this.firstInput)
      return
    }
    // dog
    if (emoji.eq('🐶')) {
      this.output(this.firstInput.split('').reverse().join(''))
      return
    }

    // 制御 ------

    // 終了
    if (emoji.eq('🔚')) {
      this.endState = 'end'
      return
    }
    // 通過
    if (emoji.eq('⬜️')) {
      return
    }
    // 壁の中にいる
    if (emoji.eq('⬛️')) {
      // pointer in wall
      this.error('pointer in wall')
      this.endState = 'end'
      return
    }

    // 定数 ------
    if (emoji.eq('0️⃣')) {
      this.stack.push(0)
      return
    }
    if (emoji.eq('1️⃣')) {
      this.stack.push(1)
      return
    }
    if (emoji.eq('2️⃣')) {
      this.stack.push(2)
      return
    }
    if (emoji.eq('3️⃣')) {
      this.stack.push(3)
      return
    }
    if (emoji.eq('4️⃣')) {
      this.stack.push(4)
      return
    }
    if (emoji.eq('5️⃣')) {
      this.stack.push(5)
      return
    }
    if (emoji.eq('6️⃣')) {
      this.stack.push(6)
      return
    }
    if (emoji.eq('7️⃣')) {
      this.stack.push(7)
      return
    }
    if (emoji.eq('8️⃣')) {
      this.stack.push(8)
      return
    }
    if (emoji.eq('9️⃣')) {
      this.stack.push(9)
      return
    }
    if (emoji.eq('🔟')) {
      this.stack.push(10)
      return
    }
    if (emoji.eq('🅰️')) {
      this.stack.push(65)
      return
    }
    if (emoji.eq('🅱️')) {
      this.stack.push(66)
      return
    }
    if (emoji.eq('©️')) {
      this.stack.push(67)
      return
    }
    if (emoji.eq('🅾️')) {
      this.stack.push(77)
      return
    }
    if (emoji.eq('Ⓜ️')) {
      this.stack.push(79)
      return
    }
    if (emoji.eq('🅿️')) {
      this.stack.push(80)
      return
    }
    if (emoji.eq('®️')) {
      this.stack.push(82)
      return
    }
    if (emoji.eq('💯')) {
      this.stack.push(100)
      return
    }

    // 乱数 ---

    if (emoji.eq('🎲')) {
      this.stack.push(Math.floor(Math.random() * 6) + 1)
      return
    }
    if (emoji.eq('🤞')) {
      this.stack.push(Math.floor(Math.random() * 2))
      return
    }

    // 計算 ----
    if (emoji.eq('➕')) {
      const a = this.stack.pop()
      const b = this.stack.pop()
      this.stack.push(a + b)
      return
    }
    if (emoji.eq('➖')) {
      const a = this.stack.pop()
      const b = this.stack.pop()
      this.stack.push(a - b)
      return
    }
    if (emoji.eq('✖️')) {
      const a = this.stack.pop()
      const b = this.stack.pop()
      this.stack.push(a * b)
      return
    }
    if (emoji.eq('➗')) {
      const a = this.stack.pop()
      const b = this.stack.pop()
      this.stack.push(Math.floor(a / b))
      return
    }
    if (emoji.eq('🈹')) {
      const a = this.stack.pop()
      const b = this.stack.pop()
      this.stack.push(a % b)
      return
    }
    if (emoji.eq('🈹')) {
      const a = this.stack.pop()
      const b = this.stack.pop()
      this.stack.push(a % b)
      return
    }
    if (emoji.eq('❗️')) {
      const a = this.stack.pop()
      let res = 1
      for (let i = 1; i <= a; ++i) {
        res *= i
      }
      this.stack.push(res)
      return
    }

    // スタック操作 -----
    if (emoji.eq('🚮')) {
      this.stack.pop()
      return
    }
    if (emoji.eq('💕')) {
      const a = this.stack.pop()
      this.stack.push(a)
      this.stack.push(a)
      return
    }
    if (emoji.eq('💞')) {
      const a = this.stack.pop()
      const b = this.stack.pop()
      this.stack.push(a)
      this.stack.push(b)
      return
    }
    if (emoji.eq('♻️')) {
      const a = this.stack.pop()
      const b = this.stack.pop()
      const c = this.stack.pop()
      this.stack.push(b)
      this.stack.push(a)
      this.stack.push(c)
      return
    }
    if (emoji.eq('🙃')) {
      this.stack.reverse()
      return
    }
    if (emoji.eq('🎆')) {
      this.stack.clear()
      return
    }
    if (emoji.eq('🔞')) {
      this.stack.r18()
      return
    }

    // 移動 -----

    if (emoji.eq('➡️')) {
      this.dirX = 1
      this.dirY = 0
      return
    }
    if (emoji.eq('⬅️')) {
      this.dirX = -1
      this.dirY = 0
      return
    }
    if (emoji.eq('⬆️')) {
      this.dirX = 0
      this.dirY = -1
      return
    }
    if (emoji.eq('⬇️')) {
      this.dirX = 0
      this.dirY = 1
      return
    }
    if (emoji.eq('↗️')) {
      this.dirX = 1
      this.dirY = -1
      return
    }
    if (emoji.eq('↘️')) {
      this.dirX = 1
      this.dirY = 1
      return
    }
    if (emoji.eq('↖️')) {
      this.dirX = -1
      this.dirY = -1
      return
    }
    if (emoji.eq('↙️')) {
      this.dirX = -1
      this.dirY = 1
      return
    }
    if (emoji.eq('⏩')) {
      this.dirX++
      return
    }
    if (emoji.eq('⏪')) {
      this.dirX--
      return
    }
    if (emoji.eq('⏫')) {
      this.dirY--
      return
    }
    if (emoji.eq('⏬')) {
      this.dirY++
      return
    }
    if (emoji.eq('🔃')) {
      // 右回転
      ;[this.dirX, this.dirY] = [-this.dirY, this.dirX]
      return
    }
    if (emoji.eq('🔄')) {
      // 左回転
      ;[this.dirX, this.dirY] = [this.dirY, -this.dirX]
      return
    }

    // 条件分岐 -----

    if (emoji.eq('↪️')) {
      const a = this.stack.pop()
      if (a > 0) {
        this.dirX = 1
        this.dirY = 0
      }
      return
    }
    if (emoji.eq('↩️')) {
      const a = this.stack.pop()
      if (a > 0) {
        this.dirX = -1
        this.dirY = 0
      }
      return
    }
    if (emoji.eq('⤵️')) {
      const a = this.stack.pop()
      if (a > 0) {
        this.dirX = 0
        this.dirY = -1
      }
      return
    }
    if (emoji.eq('⤴️')) {
      const a = this.stack.pop()
      if (a > 0) {
        this.dirX = 0
        this.dirY = 1
      }
      return
    }
    if (emoji.eq('📏')) {
      const a = this.stack.pop()
      const b = this.stack.pop()
      this.stack.push(a > b ? 1 : 0)
      return
    }
    if (emoji.eq('📈')) {
      const a = this.stack.pop()
      const b = this.stack.pop()
      this.stack.push(a > b ? 1 : 0)
      return
    }
    if (emoji.eq('📉')) {
      const a = this.stack.pop()
      const b = this.stack.pop()
      this.stack.push(a < b ? 1 : 0)
      return
    }
    if (emoji.eq('❕')) {
      const a = this.stack.pop()
      this.stack.push(a > 0 ? 0 : 1)
      return
    }
    if (emoji.eq('🉑')) {
      const a = this.stack.pop()
      this.stack.push(60 <= a && a < 80 ? 1 : 0)
      return
    }
    if (emoji.eq('🈴')) {
      const a = this.stack.pop()
      this.stack.push(60 <= a ? 1 : 0)
      return
    }

    // 回数操作 ---
    if (emoji.eq('🏃‍♀️')) {
      this.operationNum.push(2)
      return
    }
    if (emoji.eq('🎰')) {
      const a = this.stack.pop()
      const b = this.stack.pop()
      const c = this.stack.pop()
      if (a == b && b == c) {
        this.operationNum.push(7)
        this.operationNum.push(7)
        this.operationNum.push(7)
      }
      return
    }
    if (emoji.eq('💤')) {
      this.operationNum.push(0)
      this.operationNum.push(0)
      this.operationNum.push(0)
      return
    }

    // 記憶領域操作
    if (emoji.eq('📥')) {
      const a = this.stack.pop()
      this.mailBox.push(a)
      return
    }
    if (emoji.eq('📤')) {
      const a = this.mailBox.pop()
      this.stack.push(a)
      return
    }

    // misc------
    // ranks
    if (emoji.eq('🥇')) {
      this.stack.push(this.stack.sortRank(0))
      return
    }
    if (emoji.eq('🥈')) {
      this.stack.push(this.stack.sortRank(1))
      return
    }
    if (emoji.eq('🥉')) {
      this.stack.push(this.stack.sortRank(2))
      return
    }
    // median
    if (emoji.eq('🀄')) {
      this.stack.push(this.stack.median())
      return
    }
    // カレンダー
    if (emoji.eq('📅')) {
      const time = new Date()
      this.stack.push(time.getSeconds())
      this.stack.push(time.getMinutes())
      this.stack.push(time.getHours())
      this.stack.push(time.getDate())
      this.stack.push(time.getMonth() + 1)
      this.stack.push(time.getFullYear())
      return
    }
    // お姉さん
    if (emoji.eq('🤖')) {
      const a = this.stack.pop()
      if (a <= 0) {
        this.stack.push(1)
      }
      if (a == 1) {
        this.stack.push(2)
      }
      if (a == 2) {
        this.stack.push(12)
      }
      if (a == 3) {
        this.stack.push(184)
      }
      if (a == 4) {
        this.stack.push(8512)
      }
      if (a == 5) {
        this.stack.push(1262816)
      }
      if (a == 6) {
        this.stack.push(575780564)
      }
      if (a == 7) {
        // 2秒
        sleep(2 * 1000)
        this.stack.push(789360053252)
      }
      if (a == 8) {
        // 4時間
        sleep(4 * 60 * 60 * 1000)
        this.stack.push(3266598486981642)
      }
      if (a >= 9) {
        // eslint-disable-next-line no-empty
        for (;;) {}
      }
      return
    }

    // unexpected token
    this.error('unexpected emoji')
    this.endState = 'end'
    return
  }
}

export { Interpreter }
