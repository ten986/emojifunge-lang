import { emojiToClass } from '@/emoji'

import { Action, EmojiAction } from '../action'
import { Interpreter } from '../interpreter'

const comment: Action = (ip: Interpreter) => {
  ip.commentState = 'commented'
}

/**
 * コメント関連のアクション
 */
const commentActions: EmojiAction[] = [
  {
    emoji: emojiToClass('🍚'),
    action: comment,
  },
]

export { commentActions }
