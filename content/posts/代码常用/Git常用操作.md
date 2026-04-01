```text
feat     新功能
fix      修复 bug
docs     文档修改
style    代码格式修改
refactor 重构
perf     性能优化
test     测试相关
build    构建工具或依赖变更
revert   回滚某次提交
chore    杂项修改
```
# Git 常用操作

这份笔记按“我一天里最常用的 Git 操作”来整理，尽量只保留高频内容，再补上开分支、多分支协作这些实际工作里很常见的场景。

---

ssh-add ~/.ssh/id_rsa
ssh-add -l
## 一、先记住几个最常用命令

### 1.1 看状态

```bash
git status
```

最常用的命令之一，用来确认：

- 当前在哪个分支
- 哪些文件修改了
- 哪些文件已经暂存
- 有没有未跟踪文件

### 1.2 看改了什么

```bash
git diff
git diff <filename>
```

- `git diff`：看工作区和暂存区的差异
- `git diff <filename>`：只看某个文件

### 1.3 提交代码

```bash
git add .
git commit -m "fix: 修复登录接口报错"
```

- `git add .`：把当前目录下改动加入暂存区
- `git add -A`：把所有改动都加入暂存区
- `git commit -m "xxx"`：提交

### 1.4 拉代码

```bash
git pull --rebase
```

常用原因：

- 先同步远端最新代码
- 用 `--rebase` 能让提交历史更线性
- 减少 merge 带来的“菱形提交记录”

### 1.5 推代码

```bash
git push
```

第一次推新分支时通常会用：

```bash
git push -u origin <branch-name>
```

`-u` 的作用是建立本地分支和远程分支的跟踪关系，后面再 push / pull 就方便很多。

---

## 二、我一天里最常用的工作流

### 2.1 开始工作前

先确认当前状态：

```bash
git status
git branch
```

如果你要在主分支基础上开始新任务，通常先同步主分支：

```bash
git checkout main
git pull --rebase origin main
```

如果项目主分支还是 `master`，就把上面的 `main` 换成 `master`。
-如果当前分支不是 main，这个命令其实是“把远程 main 的最新内容，rebase 到你当前分支上”

### 2.2 开一个自己的功能分支

最常用：

```bash
git checkout -b feat/login-page
```

这条命令等于两步：

```bash
git branch feat/login-page
git checkout feat/login-page
```

含义：

- `git branch xxx`：创建分支
- `git checkout xxx`：切换分支
- `git checkout -b xxx`：创建并切换

如果是新版本 Git，也可以写成：

```bash
git switch -c feat/login-page
```

### 2.3 开发过程中

常见节奏：

```bash
git status
git diff
git add .
git commit -m "feat: 完成登录页基础布局"
```

如果只想提交某个文件：

```bash
git add src/login.tsx
git commit -m "fix: 修复登录按钮点击失效"
```

### 2.4 提交前同步主分支最新代码

如果你开发了一段时间，主分支已经更新了，通常先同步一下再推自己的分支：

```bash
git checkout main
git pull --rebase origin main
git checkout feat/login-page
git rebase main
```

这样做的好处：

- 让你的分支基于最新主分支
- 提前解决冲突
- 提交记录更干净

### 2.5 推送自己的分支

第一次推：

```bash
git push -u origin feat/login-page
```

后续继续推：

```bash
git push
```

---

## 三、怎么开分支

### 3.1 从当前分支开新分支

```bash
git checkout -b dev/xxx
```

这表示：

- 以当前分支为起点
- 创建一个新分支
- 并立即切过去

### 3.2 从指定分支开新分支

如果你想明确从 `main` 开：

```bash
git checkout main
git pull --rebase origin main
git checkout -b feat/order-api
```

这也是最推荐的方式，因为你能确保新分支基于最新主分支。

### 3.3 常见分支命名

可以按任务类型命名：

- `feat/xxx`：新功能
- `fix/xxx`：修 bug
- `refactor/xxx`：重构
- `docs/xxx`：文档
- `test/xxx`：测试相关

例如：

```bash
git checkout -b feat/user-center
git checkout -b fix/login-bug
git checkout -b refactor/request-layer
```

### 3.4 查看所有分支

```bash
git branch
git branch -a
```

- `git branch`：看本地分支
- `git branch -a`：看本地 + 远程分支

### 3.5 切换分支

```bash
git checkout <branch-name>
```

或者：

```bash
git switch <branch-name>
```

### 3.6 删除分支

删除本地分支：

```bash
git branch -d <branch-name>
```

强制删除本地分支：

```bash
git branch -D <branch-name>
```

删除远程分支：

```bash
git push origin --delete <branch-name>
```

---

## 四、多个分支怎么用

### 4.1 最常见场景

你可能同时会有多个分支：

- `main`：主分支
- `feat/a`：功能 A
- `feat/b`：功能 B
- `fix/urgent-bug`：线上紧急修复

这时不要在一个分支里混着改多个需求，最好一个需求一个分支。

### 4.2 多个分支切换的常规方式

例如你本来在 `feat/a`，突然要去修线上 bug：

```bash
git status
git add .
git commit -m "wip: 暂存当前开发进度"
git checkout main
git pull --rebase origin main
git checkout -b fix/urgent-bug
```

修完之后：

```bash
git push -u origin fix/urgent-bug
```

然后再切回原来的功能分支继续干：

```bash
git checkout feat/a
```

### 4.3 如果当前改动还没提交，但要切别的分支

有两种常见做法。

第一种，直接先提交一个临时 commit：

```bash
git add .
git commit -m "wip: 暂存开发进度"
```

第二种，用 stash 暂存：

```bash
git stash
git checkout fix/urgent-bug
```

回来的时候恢复：

```bash
git checkout feat/a
git stash pop
```

### 4.4 多个分支之间拿代码

#### merge

```bash
git merge <branch-name>
```

特点：

- 把两个分支合并
- 会保留分叉结构
- 历史更真实，但可能更乱

#### rebase

```bash
git rebase <branch-name>
```

特点：

- 把当前分支“挪”到目标分支最新提交后面
- 历史更线性
- 更适合自己分支同步主分支

#### cherry-pick

```bash
git cherry-pick <commit-hash>
```

特点：

- 只拿某一个提交
- 很适合“另一个分支里有一小段修复我也想要”

### 4.5 日常建议

- 一个需求一个分支
- 不要在 `main` 上直接开发
- 自己分支提交前，先同步一次 `main`
- 小步提交，commit 信息写清楚
- 如果分支很多，命名一定要规范

---

## 五、远程仓库和初始化

### 5.1 克隆仓库

```bash
git clone --recursive git@gitee.com:wang-66/diff-power.git --depth 10
```

说明：

- `--recursive`：把子模块一起拉下来
- `--depth 10`：浅克隆，只拉最近一些提交

如果子模块没更新好，可以执行：

```bash
git submodule update --init --recursive
git status
```

### 5.2 初始化仓库

```bash
git init
```

这个命令会把当前目录初始化成 Git 仓库。

### 5.3 添加远程仓库

```bash
git remote add origin <url>
```

查看远程：

```bash
git remote
git remote -v
```

### 5.4 第一次推代码

```bash
git checkout -b main
git add .
git commit -m "feat: first commit"
git remote add origin git@github.com:yourname/project.git
git pull --rebase origin main
git push -u origin main
```

### 5.5 一个完整初始化示例

```bash
cd SynNet
git config --list
git init
git checkout -b main
git add .
git commit -m "feat: first commit"
git remote add SynNet git@github.com:Kikihqq/SynNet.git
git pull --rebase SynNet main
git push -u SynNet main
```

---

## 六、撤销和回退

### 6.1 回退上一次提交，但保留改动

```bash
git reset --soft HEAD^
```

适合：

- commit 信息写错了
- 提交得太早了
- 想重新组织一下提交
![[Pasted image 20260317110537.png]]
### 6.2 只是想修改上一次提交信息

```bash
git commit --amend
```

---

## 七、commit message 常用规范

### 7.1 基本结构

```text
type(scope): subject
```

其中：

- `type`：提交类型，必填
- `scope`：影响范围，可选
- `subject`：简短说明，必填，尽量不超过 50 个字符

### 7.2 常见 type

```text
feat     新功能
fix      修复 bug
docs     文档修改
style    代码格式修改
refactor 重构
perf     性能优化
test     测试相关
build    构建工具或依赖变更
revert   回滚某次提交
chore    杂项修改
```

### 7.3 例子

```bash
git commit -m "feat: 新增登录页"
git commit -m "fix: 修复接口超时问题"
git commit -m "refactor: 重构用户信息模块"
```

---

## 八、Git 的数据模型，面试时可以简单讲

### 8.1 快照

Git 不是只记录“文件差异”，更像是在记录某一时刻整个目录的快照。

- 文件内容可以理解成 `blob`
- 目录可以理解成 `tree`
- 一次提交就是一个 `commit`

### 8.2 历史记录

Git 的提交历史本质上是一个有向无环图（DAG）。

每个 commit 会记录：

- 当前快照
- 父提交是谁
- 作者
- 提交说明

可以用伪代码记：

```python
type blob = array<byte>
type tree = map<string, tree | blob>
type commit = struct {
    parent: array<commit>
    author
    message: string
    snapshot: tree
}
```

### 8.3 引用

Git 会给提交哈希起一个更好记的名字，也就是引用（reference）。

例如：

- `main`
- `HEAD`
- `origin/main`

分支本质上就是“一个可移动的指针”。

---

## 九、gitignore 怎么写

### 9.1 常见写法

```text
# 忽略 .a 文件
*.a

# 不忽略 lib.a
!lib.a

# 只忽略当前目录下的 TODO
/TODO

# 忽略 build/ 目录
build/

# 忽略 doc 目录下的 txt
doc/*.txt

# 忽略 doc 目录下所有子目录中的 pdf
doc/**/*.pdf
```

### 9.2 忽略文件或目录

```text
img*
*.md
```

### 9.3 排除忽略

```text
*.md
!README.md
```

---

## 十、最后给自己留一版超短工作流

### 新需求开发

```bash
git checkout main
git pull --rebase origin main
git checkout -b feat/xxx
git status
git add .
git commit -m "feat: xxx"
git push -u origin feat/xxx
```

### 同步主分支最新代码

```bash
git checkout main
git pull --rebase origin main
git checkout feat/xxx
git rebase main
```

### 修紧急 bug

```bash
git checkout main
git pull --rebase origin main
git checkout -b fix/urgent-bug
git add .
git commit -m "fix: xxx"
git push -u origin fix/urgent-bug
```
