import { calcActions } from './actions/calc'
import { commentActions } from './actions/comment'
import { conditionalActions } from './actions/conditional'
import { emojiPickActions } from './actions/emojiPick'
import { inoutActions } from './actions/inout'
import { mailboxActions } from './actions/mailbox'
import { makeStackActions } from './actions/makeStack'
import { miscActions } from './actions/misc'
import { moveActions } from './actions/move'
import { nestedStackActions } from './actions/nestedStack'
import { operationNumActions } from './actions/operationNum'
import { programControlActions } from './actions/programControl'
import { pushNumberActions } from './actions/pushNumber'
import { randomActions } from './actions/random'
import { recodingActions } from './actions/recoding'
import { stackActions } from './actions/stackOperation'
import { stepToStopActions } from './actions/stepToStop'
import { EmojiAction, EmojistrToActionMap } from './actionTypes'

/** 実行するアクション一覧 */
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
  emojiPickActions,
  nestedStackActions,
  makeStackActions,
  stepToStopActions,
  recodingActions,
]

/** emoji action の対応を生成取得 */
const convertToEmojiActions = (emojiActionsArray: EmojiAction[][]) => {
  let emojiActions: EmojiAction[] = []
  for (const emojiActionsElm of emojiActionsArray) {
    emojiActions = emojiActions.concat(emojiActionsElm)
  }
  return emojiActions
}

const convertToMap = (emojiActions: EmojiAction[]) => {
  const emojistrToAction: EmojistrToActionMap = new Map()
  emojiActions.forEach(({ emoji, action }) => {
    emojistrToAction.set(emoji.emojiStr, action)
  })
  return emojistrToAction
}

const emojiActions = convertToEmojiActions(emojiActionsArray)
const emojistrToAction = convertToMap(emojiActions)

export { emojistrToAction }
