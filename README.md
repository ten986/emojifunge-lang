# emojifunge

## これは何

befunge + emoji

ありそうでなかったので作った

## 動かしたい

``` bash
npm i
npm run dev:test
```

`\code` 以下の、`code` をコード、`input` を入力として動く

## 基本

emojiを二次元上に配置する言語。
コードは、emoji と 改行 のみ有効（それ以外の文字は未定義動作）。

`(x, y) = (0, 0)` を指すポインタがある。ポインタがコード上を動き、ポインタの箇所のemojiを実行する。
`(x, y)` と書いた時はポインタの座標を表すこととし、x列y行目を指している。

スタックベースの言語。
空のスタックは `(top)[](bottom)` のように表現され、topからpop、pushをする。
要素として「数値」「スタック」の2種類を取る。数値は整数値である。
`2`、`[1, 3]`の順に空のスタックにpushした場合、`[[1, 3], 2]`となる。

空の stack から pop するとき、 -1 を返す。

最初、空のスタックが1つ用意されている。これを「操作中のスタック」という。
特に注意書きがない場合、操作中のスタックからのpop、pushを指す。操作中のスタックを指すスタックは、命令によって変更されることもある。

また、このスタックを「ルートスタック」という。操作中のスタックの親をたどり、親のないスタックがあればルートスタックである。ルートスタックを指すスタックは、命令によって変更されることもある。

初期状態では、「回転方向」は時計回りである。
ポインタが壁にぶつかった際、どちら向きに回転するかは、「回転方向」によって定まる。

## ステップ

- 命令実行回数スタックから 数値として popする。

- 命令実行回数だけ、
  - ポインタの座標にある emoji を実行。emoji がない場合、異常終了する。
  - 正常終了状態なら正常終了する。

- 正常終了するまでの時間 <= 0 なら、正常終了する。

- 正常終了するまでの時間をデクリメントする。

- 移動ルールにそってポインタを移動する。

## 命令実行回数のスタック

「命令実行回数のスタック」がある。
最初、空のスタックである。
「命令実行回数のスタック」が空ではない時、「命令実行回数のスタック」から数値として pop して、その回数次の命令を行う。

## 移動に関する仕様

ポインタは、最初は `(x, y) = (0, 0)` に位置し、
移動方向は`(dx, dy) = (1, 0)` とする。

移動は、ふつう `(x, y) = (x + dx, y + dy)`とする操作を指す。
移動先に emoji がある場合、移動する。
emoji が壁の場合は、emoji がない場合とみなす。

emojiがなければ、回転方向に応じて、
時計回りでは (dx, dy) = (-dy, dx) として、
反時計回りでは (dx, dy) = (dy, -dx) とし試す。

4回試してemojiがなければ、正常終了する。
この正常終了は、正常終了無視状態であっても終了する。

## popモード

「popモード」がある。
最初「通常モード」である。
「通常モード」と「スタックモード」がある。

モードが変わると、操作中のスタックから pop する仕様が変わる。

通常モードは、stack を開いてから pop する。
これを「数値として pop」と表現する。
`(top)[[a, b, c], [], [d, e], f, [g, h]]` のようなスタックがあったとき、
1度目の pop では、`[a, b, c]` が top にあるので、
開いて
`(top)[a, b, c, [], [d, e], f, [g, h]]`となる。
改めて、`a, b, c, ...` と pop する。

スタックモードは、stack でも 数値 でも 構わず pop する。
これを「スタックとして pop」と表現する。
`(top)[[a, b, c], [], [d, e], f, [g, h]]` のようなスタックがあったとき、
`[a, b, c], [], [d, e], [f], ...` のように pop していく。

## 演算について

n個の要素の演算を行うとき、

すべての要素が 数値 である場合は、
指定された演算を行い、結果を返す、

それ以外の場合は、数値を要素数1のスタックとみなし、
すべてのスタックの 0番目、1番目、2番目、...、min(スタックの要素数) - 1 番目 に対してそれぞれ再帰的に処理をし、0番目の結果、 1番目の結果、... を保持した スタックを返す。
min(スタックの要素数) - 1 番目 より 後の要素は破棄される。

すなわち、 `(top)[[7, 4, 6], 3, 6]` の stack に対し、➕　を適用すると、`[7, 4, 6]` と `[3]` の演算となり、0番目の要素同士で計算したのち、1番目以降を破棄して `[10]` を得るので、`(top)[[10], 6]` という stack が得られる。

## emoji と stack

emoji は codeUnit による スタック として表現される。

例えば、0️⃣ の codeUnit は `[48, 65039, 8419]` であり、
プログラム上では、 `[8419, 65039, 48]` という逆順のstackで表現される。

<https://jsprimer.net/basic/string-unicode/>

## コマンド一覧

`mode: o` となっている場合、「pop」として表現される箇所は、popモードによって取り出し方が変更される。

### 入出力

| emoji | name | mode | action | example |
|---|---|---|---|---|
|ℹ️ | input-number | x | 入力を数値として受け取り、 pushする。空白などの直前まで受け取る。 | stack `[53, 2] -> [32, 53, 2]` input: `32 54 AA` -> ` 54 AA`|
|🔤 | input-ascii | x | 入力を ASCII CODE として受け取り、 pushする。|stack `[53, 2] -> [41, 53, 2]` input: `ABC` -> `BC`|
|🔢 | output-number | o | `a` を pop し、数値として出力する。| stack `[32, 53, 2] -> [53, 2]` output: `32`|
|🔡 | output-ascii | o | `a` を pop し、ASCII CODEとして出力する。| stack `[41, 53, 2] -> [53, 2]` output: `A`|
|🔣 | output-emoji | x | `a` を スタックとして pop し、stackのtopを emoji として出力する。| stack `[[8419, 65039, 48], 53, 2] -> [53, 2]` output: `0️⃣`|
|🎦 | rewind-input | x | 入力を、最初の状態に戻す。|||
|🐱 | cat | x | 最初の入力をそのままoutputする。 |input:`ABC` output:`ABC`|
|🐶 | dog | x | 最初の入力を反転してoutputする。 |input:`ABC` output:`CBA`|
|📜 | quine | x | プログラムをそのままoutputする。 ||
|🤐 | silent | x | 以降の出力命令を無視する。 ||
|🤮 | vomit | x | 出力命令を無視をやめる。 ||

### 盤面のemoji

| emoji | name | mode | action | example |
|---|---|---|---|---|
|👀 | pick-emoji | x | `(x + dx, y + dy)` の emoji を push する。命令実行回数 stack に 0 を push する。||
|🤳 | pick-back-emoji | x | `(x - dx, y - dy)` の emoji を push する。||

### 制御

| emoji | name | mode | action | example |
|---|---|---|---|---|
|🏁 | entry-point | x | この地点をポインタの初期地点とする。複数ある場合、ランダムで選ばれる。通常時は何もしない。 ||
|⬜️ | empty | x | 何もしない。 ||
|⬛️ | wall | x | 壁。emoji がない場合とみなす。 ||
|🔚 | end | x | プログラムを正常終了する。 ||
|🚥 | signal | x | 正常終了するまでの時間 = 3 とする（すなわち、ふつう 3命令後に正常終了する）。 ||
|⏲️ | timer | x | `a` を 数値として pop し、正常終了するまでの時間 = `a` とする。 ||
|🏪 | change-ignore-end | x | 正常終了無視状態を切り替える。正常終了無視状態のとき、正常終了する時、それを無視する。 ||
|🍚 | comment | x | 次の comment まで、壁以外の命令を無視する。 ||
|💥 | crash | x | プログラムをクラッシュする。 ||
|🚲 | bicycle | x | 自転車に乗っていないとき: 自転車に乗る。他の乗り物からは降りる。 乗ってるとき: 降りる。 ||
|🚳 | bicycle-stop | x | 自転車に乗っているとき、壁とみなされる。それ以外の場合、何もしない。 ||

### 定数

| emoji | name | mode | action | example |
|---|---|---|---|---|
|0️⃣ | 0 | x | 0 を push する。|stack `[53, 2] -> [0, 53, 2]`|
|1️⃣ | 1 | x | 1 を push する。||
|2️⃣ | 2 | x | 2 を push する。||
|3️⃣ | 3 | x | 3 を push する。||
|4️⃣ | 4 | x | 4 を push する。||
|5️⃣ | 5 | x | 5 を push する。||
|6️⃣ | 6 | x | 6 を push する。||
|7️⃣ | 7 | x | 7 を push する。||
|8️⃣ | 8 | x | 8 を push する。||
|9️⃣ | 9 | x | 9 を push する。||
|🔟 | 10 | x | 10 を push する。||
|🅰️ | A  | x | 65 を push する。||
|🅱️ | B  | x | 66 を push する。||
|©️ | C  | x | 67 を push する。||
|🅾️ | O  | x | 77 を push する。||
|Ⓜ️ | M  | x | 79 を push する。||
|🅿️ | P  | x | 80 を push する。||
|®️ | R  | x | 82 を push する。||
|💯 | 100 | x | 100 を push する。||
|➰ | infinity | x | Infinity を push する。||

備考: infinity に対応する emoji は、変更となる可能性がある。（codegolf中のみなさまへ: 期間中は変更しません）

### 乱数

`x ~ y` は、`x` 以上 `y` 以下を指す。

| emoji | name | mode | action | example |
|---|---|---|---|---|
|🎲 | dice | x | 1 ~ 6 のランダムな値をpushする。||
|🤞 | judgement | x | 0 ~ 1 のランダムな値をpushする。||

### 計算

| emoji | name | mode | action | example |
|---|---|---|---|---|
|➕ | plus | o | (top)`a`, `b` を pop し、`a+b` を push する。|stack `[7, 4, 6] -> [11, 6]`|
|➖ | minus | o | (top)`a`, `b` を pop し、`a-b` を push する。|stack `[7, 4, 6] -> [3, 6]`|
|✖️ | mul | o | (top)`a`, `b` を pop し、`a*b` を push する。|stack `[7, 4, 6] -> [28, 6]`|
|➗ | div | o | (top)`a`, `b` を pop し、`a/b` を push する。|stack `[7, 4, 6] -> [1, 6]`|
|🈹 | mod | o | (top)`a`, `b` を pop し、`a%b` を push する。|stack `[7, 4, 6] -> [3, 6]`|
|🛸 | spaceship-operator | o | (top)`a`, `b` を pop し、`sign(a-b)` を push する。|stack `[7, 4, 6] -> [1, 6]`|
|❗️ | fact | o | `a` を pop し、`a` の階乗 を push する。|stack `[7, 4, 6] -> [5040, 4, 6]`|
|‼️ | semifact | o | `a` を pop し、`a` の半階乗 を push する。|stack `[7, 4, 6] -> [105, 4, 6]`|
|👍 | increment | o | `a` を pop し、`a + 1` を push する。|stack `[7, 4, 6] -> [8, 4, 6]`|
|👎 | decrement | o | `a` を pop し、`a - 1` を push する。|stack `[7, 4, 6] -> [8, 4, 6]`|

### スタック操作

| emoji | name | mode | action | example |
|---|---|---|---|---|
|🚮 | pop | o | `a` を popする。値は ゴミ箱stack に pushする。|stack `[7, 4, 6] -> [4, 6]`|
|🗑️ | pick-up-trash | o | ゴミ箱stack から `a` を popし、操作中の stack に pushする。ゴミ箱stack を clear する。||
|💕 | dup | o | `a` を pop し、`a`, `a` を push する。 |stack `[7, 4, 6] -> [7, 7, 4, 6]`|
|💞 | swap | o | (top)`a`, `b` を pop し、(top)`b`, `a` を push する。|stack `[7, 4, 6] -> [4, 7, 6]`|
|♻️| swap3 | o | (top)`a`, `b`, `c` を pop し、(top)`c`, `a`, `b` を push する。|stack `[7, 4, 6] -> [6, 7, 4]`|
|🏗| swapN | o | `x` を 数値として pop する。 `x - 1` 回 pop し、 `c` を pop し、 `x - 1` 回 push し、 `c`, を push する。|stack `[3, 7, 4, 6] -> [6, 7, 4]`|
|📐 | length | x | stackの長さを push する。 |stack `[7, [4, 3], 6] -> [3, 7, [4, 3], 6]`|
|🙃 | reverse | x | stackを反転する。 |stack `[7, 4, 6] -> [6, 4, 7]`|
|🎆 | fireworks | x | stack を clear する |stack `[18, 4, 26] -> []`|
|🔞 | R-18 | x | stack から、 18未満の数を取り除く|stack `[18, 4, 26] -> [18, 26]`|
|📧 | create-empty-stack | x | 空の stack を作り、pushする。||
|💌 | create-new-stack | o | `a` を 数値として pop し、 `a` 回 pop する。空の stack を作り、空の stack に対し、`a` 回 pop したものを 逆順に push する（すなわち元通りの順番のstackができる）。 この stack を push する。 ||
|📨 | change-popmode | x | popモード の 通常モード と スタックモード を切り替える。|||

### ネストスタック操作

| emoji | name | mode | action | example |
|---|---|---|---|---|
|📬 | into-nested-stack | x | 操作中の stack の top を、操作中の stack とする。 top が数値だった場合、1要素の stack に変換してから行う。 ||
|📫 | exit-nested-stack | x | 現在操作中の stack の親を、現在操作中の stack とする。 親 stack がない場合は、この stack のみを要素とする 新たな stack を作成し、それを親 stack とする。 root stack は、この新たな stack に変更される。 ||
|📪 | goto-root-stack | x | root stack を、操作中の stack とする。 ||
|📭 | open-stack | x | `a` を スタックとして pop し、 stack だった場合、開いて push する。数値の場合、そのままpushする。||

### 記憶領域操作

| emoji | name | mode | action | example |
|---|---|---|---|---|
|📥 | mailbox-in| o | `a` を pop し、stackとは異なるstack(mailbox)にpushする。||
|📤 | mailbox-out| o | mailbox から　`a` を pop し、stackにpushする。||

### 移動

| emoji | name | mode | action | example |
|---|---|---|---|---|
|➡️ | right | x | `(dx, dy) = (1, 0)`||
|⬅️ | left | x | `(dx, dy) = (-1, 0)`||
|⬆️ | up | x | `(dx, dy) = (0, -1)`||
|⬇️ | down | x | `(dx, dy) = (0, 1)`||
|↗️ | up-right | x | `(dx, dy) = (1, -1)`||
|↘️ | down-right | x | `(dx, dy) = (1, 1)`||
|↖️ | up-left | x | `(dx, dy) = (-1, -1)`||
|↙️ | down-left | x | `(dx, dy) = (-1, 1)`||
|⏩ | fast-right | x | `dx++` ||
|⏪ | fast-left | x | `dx--` ||
|⏫ | fast-up | x | `dy--` ||
|⏬ | fast-down | x | `dy++` ||
|🔃 | turn-clockwise | x | `(dx, dy) = (-dy, dx)` ||
|🔄 | turn-counterclockwise | x | `(dx, dy) = (dy, -dx)` ||
|🕸️ | spider| x | `(dx, dy) = (sign(dx), sign(dy))` ||
|🔀 | change-rotate| x | 回転方向を(時計回り/反時計回り)に変更する。 ||
|✴️| warp | x | (top)`a`, `b` を 数値として pop し、 `(x, y) = (a, b)`||

### 条件分岐

| emoji | name | mode | action | example |
|---|---|---|---|---|
|↪️ | right-if-true| x | `a` を 数値として pop し、`a > 0` なら right||
|↩️ | left-if-true| x | `a` を 数値として pop し、`a > 0` なら left||
|⤴️ | up-if-true| x | `a` を 数値として pop し、`a > 0` なら up||
|⤵️ | down-if-true| x | `a` を 数値として pop し、`a > 0` なら down||
|📏 | equal-to | o | (top)`a`, `b` を pop し、 `a == b ? 1 : 0` を push|stack `[7, 4, 6] -> [0, 6]`|
|📈 | greater-than | o | (top)`a`, `b` を pop し、 `a > b ? 1 : 0` を push|stack `[7, 4, 6] -> [1, 6]`|
|📉 | less-than | o | (top)`a`, `b` を pop し、 `a < b ? 1 : 0` を push|stack `[7, 4, 6] -> [0, 6]`|
|❕ | not| o | `a` を pop し、`a > 0 ? 0 : 1` を push する。|stack `[7, 4, 6] -> [3, 6]`|
|🉑 | fair | o | `a` を pop し、 `60 <= a < 80 ? 1 : 0` を push|stack `[7, 4, 6] -> [0, 4, 6]`|
|🈴 | passed | o | `a` を pop し、 `60 <= a ? 1 : 0` を push|stack `[7, 4, 6] -> [0, 4, 6]`|

### 回数操作

| emoji | name | mode | action | example |
|---|---|---|---|---|
|🏃‍♀️ | speedrun | x | 命令実行回数stackに `2` をpushする（すなわち、次の命令を2回行う。）。||
|🎰 | slot | x | (top)`a`, `b`, `c` を 数値として pop し、`a == b == c`なら、命令実行回数stackに `7`,`7`,`7` をpushする。||
|💤 | sleep | x | 命令実行回数stackに `0`,`0`,`0` をpushする。||
|🕰  | time-manipulation | o | 操作中の stack から `a` を pop し、命令実行回数stackに `a` を push する。||
|➿ | infinity-loop | x | 命令実行回数stackに `Infinity` をpushする。||

# 録画

| emoji | name | mode | action | example |
|---|---|---|---|---|
|🎥| record | x |録画中でないとき: 録画中とする。（録画stack に実行したemojiをpushする。）録画中の時: 録画を停止する。録画stack を逆順にする。（録画した順番通りに再生するため。） ||
|📽️| play-record | x | 録画stack がemptyになるまで、録画stack から スタックして pop し、emoji を実行する。 ||

### misc

| emoji | name | mode | action | example |
|---|---|---|---|---|
|💻 | exec | x | `a` を スタックとして pop し、対応する emoji を 実行する。 ||
|⏱️ | stopwatch | x | OFFのとき: ONにする。 ONのとき: ONにしてからのステップ数をpushしてOFFにする。 ||
|🥇 | gold | x | stackを開いた際の最大値を取得し、pushする。 |stack `[7, 4, 6, 2] -> [7, 7, 4, 6, 2]`|
|🥈 | silver | x | stackを開いた際の2番目に大きい値を取得し、pushする。 |stack `[7, 4, 6, 2] -> [6, 7, 4, 6, 2]`|
|🥉 | bronze | x | stackを開いた際の3番目に大きい値を取得し、pushする。 |stack `[7, 4, 4, 2] -> [4, 7, 4, 4, 2]`|
|🀄 | median | x | stackを開いた際の中央値を取得し、pushする。 |stack `[7, 4, 6, 2] -> [5, 7, 4, 6, 2]`|
|📅| calendar| x | 日付をpushする|stack `[7, 4, 6] -> [2021, 2, 28, 11, 20, 43, 7, 4, 6]`|
|🤖| kazoeage-oneesan| x | `a` を 数値として pop し、 a * a のグリッド上の左上から右下に行く時、同じところを2度通らない道順の数を頑張って数える。 |stack `[8, 4, 6] ->(4 hours later)->[3266598486981642, 4, 6]`|
