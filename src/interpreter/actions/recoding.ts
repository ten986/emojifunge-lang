import { codeUnitToEmoji, emojiToClass } from '@/modules/emoji'
import { deepCopy } from '@/modules/operation'

import { EmojiAction } from '../actionTypes'
import { Interpreter } from '../interpreter'

const changeRecodingState = (ip: Interpreter): void => {
  if (ip.recordingState === 'off') {
    ip.recordingState = 'recoding'
    ip.recordingStack.clear()
  } else if (ip.recordingState === 'recoding') {
    // 最後に 🎥 を push してしまうため。
    ip.recordingStack.pop()
    // 実行順にする
    ip.recordingStack.reverse()
    ip.recordingState = 'off'
  }
}

const playRecord = (ip: Interpreter): void => {
  const stack = deepCopy(ip.recordingStack)

  while (!stack.isEmpty) {
    ip.execEmoji(codeUnitToEmoji(stack.pop()))
  }
}

const exec = (ip: Interpreter): void => {
  const emoji = codeUnitToEmoji(ip.stack.pop())

  ip.execEmoji(emoji)
}

/**
 * 録画関連のアクション
 */
const recodingActions: EmojiAction[] = [
  {
    emoji: emojiToClass('🎥'),
    action: changeRecodingState,
  },
  {
    emoji: emojiToClass('📽️'),
    action: playRecord,
  },
  {
    emoji: emojiToClass('💻'),
    action: exec,
  },
]

export { recodingActions }
