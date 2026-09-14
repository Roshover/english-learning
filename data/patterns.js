/**
 * patterns.js — 句型公式数据
 * 按交际功能分类的常用英语句型模板，帮助非母语者掌握"框架"。
 * 参考 Cambridge English Grammar Today 及 ESL 教学中的 Functional Language 体系。
 */
window.RTE_PATTERNS = {
  categories: [
    {
      key: 'requesting',
      name: { zh: '请求 & 许可', en: 'Requesting & Permission' },
      icon: '🙋',
      patterns: [
        {
          formula: 'Would you mind if I + past tense …?',
          meaning: { zh: '你介意我……吗？（非常礼貌的请求许可）', en: 'A very polite way to ask for permission' },
          usage: { zh: '正式场合或对不太熟悉的人使用；注意动词要用过去式', en: 'Formal situations or with people you don\'t know well; note the past tense verb' },
          examples: [
            { en: 'Would you mind if I opened the window?', zh: '你介意我开一下窗户吗？' },
            { en: 'Would you mind if I took tomorrow off?', zh: '你介意我明天请个假吗？' }
          ]
        },
        {
          formula: 'I was wondering if you could + verb …',
          meaning: { zh: '我在想你能不能……（委婉的请求帮助）', en: 'A gentle, indirect way to ask for help' },
          usage: { zh: '比 "Can you" 更委婉；适合职场邮件、会议等场景', en: 'Softer than "Can you"; great for emails and meetings' },
          examples: [
            { en: 'I was wondering if you could review my PR by Friday.', zh: '我在想你能不能周五前帮我审一下 PR。' },
            { en: 'I was wondering if you could share the meeting notes.', zh: '我在想你能不能分享一下会议纪要。' }
          ]
        },
        {
          formula: 'Would it be possible to + verb …?',
          meaning: { zh: '有没有可能……？（礼貌地询问可行性）', en: 'Politely asking whether something is feasible' },
          usage: { zh: '用于对方可能拒绝的情况，给对方留余地', en: 'When the other person might say no — leaves them room' },
          examples: [
            { en: 'Would it be possible to reschedule the meeting to 3 p.m.?', zh: '有没有可能把会议改到下午三点？' },
            { en: 'Would it be possible to get an early check-in?', zh: '有没有可能提前办理入住？' }
          ]
        },
        {
          formula: 'Do you mind + verb-ing …?',
          meaning: { zh: '你介意……吗？（请求对方做某事）', en: 'Politely asking someone to do something' },
          usage: { zh: '注意回答："No, not at all" 表示不介意（同意）；"I\'d rather not" 表示拒绝', en: 'Note: "No, not at all" means they agree; "I\'d rather not" means they decline' },
          examples: [
            { en: 'Do you mind sharing your screen?', zh: '你介意共享一下屏幕吗？' },
            { en: 'Do you mind waiting for a few minutes?', zh: '你介意等几分钟吗？' }
          ]
        }
      ]
    },
    {
      key: 'suggesting',
      name: { zh: '建议 & 提议', en: 'Suggesting & Proposing' },
      icon: '💡',
      patterns: [
        {
          formula: 'How about + verb-ing …?',
          meaning: { zh: '……怎么样？（轻松的建议）', en: 'A casual suggestion' },
          usage: { zh: '非正式的口语建议，适合同事/朋友之间', en: 'Informal, spoken suggestion — good between colleagues or friends' },
          examples: [
            { en: 'How about grabbing lunch together?', zh: '一起去吃午饭怎么样？' },
            { en: 'How about adding a loading spinner here?', zh: '在这里加个加载动画怎么样？' }
          ]
        },
        {
          formula: 'It might be worth + verb-ing …',
          meaning: { zh: '也许值得……（温和的建议）', en: 'A gentle, non-pushy suggestion' },
          usage: { zh: '语气温和不强迫，适合会议讨论中提出想法', en: 'Soft tone, no pressure — ideal for discussions and meetings' },
          examples: [
            { en: 'It might be worth running a few more tests before release.', zh: '发布前也许值得多跑几个测试。' },
            { en: 'It might be worth checking with the legal team first.', zh: '也许值得先跟法务确认一下。' }
          ]
        },
        {
          formula: 'Why don\'t we + verb …?',
          meaning: { zh: '我们何不……？（积极的提议）', en: 'An upbeat, proactive proposal' },
          usage: { zh: '比较积极主动的建议语气，常用于推动讨论', en: 'Proactive tone, often used to move a discussion forward' },
          examples: [
            { en: 'Why don\'t we start with the MVP and iterate from there?', zh: '我们何不先做 MVP，再迭代优化？' },
            { en: 'Why don\'t we take a five-minute break?', zh: '我们何不休息五分钟？' }
          ]
        },
        {
          formula: 'What if we + past tense …?',
          meaning: { zh: '如果我们……呢？（假设性提议）', en: 'A hypothetical proposal, inviting discussion' },
          usage: { zh: '用虚拟语气抛出一个想法，让对方一起讨论可行性', en: 'Floats an idea using the subjunctive — invites discussion on feasibility' },
          examples: [
            { en: 'What if we moved the deadline to next Friday?', zh: '如果我们把截止日期推到下周五呢？' },
            { en: 'What if we split the task between two developers?', zh: '如果我们把任务分给两个开发呢？' }
          ]
        }
      ]
    },
    {
      key: 'opinion',
      name: { zh: '表达观点', en: 'Expressing Opinions' },
      icon: '🗣️',
      patterns: [
        {
          formula: 'I think / I believe / I feel that …',
          meaning: { zh: '我认为/我相信/我觉得……（基本的观点表达）', en: 'Basic opinion statements with different levels of certainty' },
          usage: { zh: '"I think" 最常用；"I believe" 较正式/坚定；"I feel" 侧重个人感受', en: '"I think" is most common; "I believe" is more formal/firm; "I feel" is more personal' },
          examples: [
            { en: 'I think we should prioritize mobile users.', zh: '我认为我们应该优先考虑移动端用户。' },
            { en: 'I believe this approach will save us time in the long run.', zh: '我相信这个方案长远来看会节省时间。' }
          ]
        },
        {
          formula: 'From my perspective, …',
          meaning: { zh: '从我的角度来看，……', en: 'Introducing your viewpoint' },
          usage: { zh: '适合在多人讨论中礼貌地表达不同看法', en: 'Great for politely introducing a different view in group discussions' },
          examples: [
            { en: 'From my perspective, the UX needs more work before launch.', zh: '从我的角度来看，上线前 UX 还需要打磨。' },
            { en: 'From my perspective, we\'re overcomplicating this.', zh: '从我的角度来看，我们把这个搞得太复杂了。' }
          ]
        },
        {
          formula: 'As far as I\'m concerned, …',
          meaning: { zh: '就我而言，……（表明个人立场）', en: 'Stating your personal stance' },
          usage: { zh: '语气稍强，表示"至少在我看来是这样"', en: 'Slightly stronger tone — "at least as I see it"' },
          examples: [
            { en: 'As far as I\'m concerned, the current design works well.', zh: '就我而言，现在的设计效果不错。' },
            { en: 'As far as I\'m concerned, security should be the top priority.', zh: '就我而言，安全性应该是第一优先级。' }
          ]
        },
        {
          formula: 'It seems to me that …',
          meaning: { zh: '在我看来，……（较谦虚的表达）', en: 'A modest way to share an observation' },
          usage: { zh: '语气谦和，表示"这是我的观察/印象"，不强迫别人接受', en: 'Humble tone — "this is my impression," not forcing agreement' },
          examples: [
            { en: 'It seems to me that we need more user research.', zh: '在我看来，我们需要更多的用户调研。' },
            { en: 'It seems to me that the two proposals are quite similar.', zh: '在我看来，这两个方案其实挺像的。' }
          ]
        }
      ]
    },
    {
      key: 'agreeing',
      name: { zh: '同意 & 反对', en: 'Agreeing & Disagreeing' },
      icon: '🤝',
      patterns: [
        {
          formula: 'I couldn\'t agree more.',
          meaning: { zh: '我完全同意。（强烈赞同）', en: 'I totally agree. (strong agreement)' },
          usage: { zh: '非常强烈的赞同，比 "I agree" 情感更饱满', en: 'Much stronger than a simple "I agree" — shows enthusiasm' },
          examples: [
            { en: 'I couldn\'t agree more — we should ship this ASAP.', zh: '我完全同意——我们应该尽快发布。' },
            { en: '"The code review process needs improvement." "I couldn\'t agree more."', zh: '"代码评审流程需要改进。""我完全同意。"' }
          ]
        },
        {
          formula: 'That\'s a valid point, but …',
          meaning: { zh: '你说得有道理，但是……（礼貌的部分反对）', en: 'Acknowledging then politely disagreeing' },
          usage: { zh: '先肯定对方，再提出不同看法——职场讨论中最常用的反对方式', en: 'Acknowledge first, then present a different view — the go-to pattern for workplace disagreements' },
          examples: [
            { en: 'That\'s a valid point, but I think we\'d save more time with automated tests.', zh: '你说得有道理，但我认为自动化测试能帮我们节省更多时间。' },
            { en: 'That\'s a valid point, but the budget won\'t allow it right now.', zh: '你说得有道理，但目前预算不允许。' }
          ]
        },
        {
          formula: 'I see what you mean, however …',
          meaning: { zh: '我理解你的意思，不过……（委婉地转折）', en: 'Showing understanding before pivoting' },
          usage: { zh: '表示你听懂了对方的观点，但有不同想法要补充', en: 'Shows you listened and understood, but have a different take to add' },
          examples: [
            { en: 'I see what you mean, however the timeline is too tight for that.', zh: '我理解你的意思，不过时间线太紧了，做不了那个。' },
            { en: 'I see what you mean, however we should consider the edge cases.', zh: '我理解你的意思，不过我们应该考虑边界情况。' }
          ]
        },
        {
          formula: 'I\'m not sure I agree with that because …',
          meaning: { zh: '我不太确定我同意这个，因为……（直接但不失礼貌的反对）', en: 'Direct but still polite disagreement with a reason' },
          usage: { zh: '比 "I disagree" 更柔和，而且带上了原因', en: 'Softer than "I disagree" and backed up with a reason' },
          examples: [
            { en: 'I\'m not sure I agree with that because we haven\'t tested it yet.', zh: '我不太确定我同意这个，因为我们还没测试过。' },
            { en: 'I\'m not sure I agree with that because the data tells a different story.', zh: '我不太确定我同意这个，因为数据反映的情况不一样。' }
          ]
        }
      ]
    },
    {
      key: 'clarifying',
      name: { zh: '澄清 & 确认', en: 'Clarifying & Confirming' },
      icon: '🔍',
      patterns: [
        {
          formula: 'Just to clarify, do you mean …?',
          meaning: { zh: '我确认一下，你是说……吗？', en: 'Double-checking what was said' },
          usage: { zh: '会议或对话中确认对方意思，避免误解', en: 'In meetings or conversations to avoid misunderstandings' },
          examples: [
            { en: 'Just to clarify, do you mean the search should be case-insensitive?', zh: '我确认一下，你是说搜索应该不区分大小写吗？' },
            { en: 'Just to clarify, do you mean the old API or the new one?', zh: '我确认一下，你是说旧 API 还是新的？' }
          ]
        },
        {
          formula: 'If I understand correctly, …',
          meaning: { zh: '如果我理解没错的话，……', en: 'Restating your understanding to check it' },
          usage: { zh: '用自己的话复述对方意思来确认理解是否正确', en: 'Paraphrasing what was said to confirm your understanding' },
          examples: [
            { en: 'If I understand correctly, we\'re dropping the sorting feature from this sprint.', zh: '如果我理解没错的话，我们这个迭代不做排序功能了。' },
            { en: 'If I understand correctly, the deadline is the end of this month.', zh: '如果我理解没错的话，截止日期是这个月底。' }
          ]
        },
        {
          formula: 'So what you\'re saying is …?',
          meaning: { zh: '所以你的意思是……？（主动确认理解）', en: 'Actively confirming what the other person means' },
          usage: { zh: '在对方说完一段较长的话之后，用来总结并确认要点', en: 'After someone finishes a longer explanation, use this to summarize and confirm the key point' },
          examples: [
            { en: 'So what you\'re saying is we need both name and number matching?', zh: '所以你的意思是我们需要同时支持姓名和号码匹配？' },
            { en: 'So what you\'re saying is the budget is approved but the timeline isn\'t?', zh: '所以你的意思是预算批了但时间线还没定？' }
          ]
        },
        {
          formula: 'Could you elaborate on …?',
          meaning: { zh: '你能详细说一下……吗？', en: 'Asking someone to explain further' },
          usage: { zh: '请对方展开说明某个细节，比 "Can you explain" 更专业', en: 'Asking for more detail on a specific point — more professional than "Can you explain"' },
          examples: [
            { en: 'Could you elaborate on the performance requirements?', zh: '你能详细说一下性能要求吗？' },
            { en: 'Could you elaborate on what "user-friendly" means in this context?', zh: '你能详细说一下在这个场景里"用户友好"具体指什么吗？' }
          ]
        }
      ]
    },
    {
      key: 'comparing',
      name: { zh: '对比 & 偏好', en: 'Comparing & Preferring' },
      icon: '⚖️',
      patterns: [
        {
          formula: 'Rather than + verb-ing …, I\'d prefer to + verb …',
          meaning: { zh: '与其……，我更倾向于……', en: 'Expressing a preference over an alternative' },
          usage: { zh: '委婉地表达你更喜欢的方案，同时承认另一个选项', en: 'Politely states your preference while acknowledging the alternative' },
          examples: [
            { en: 'Rather than rewriting it from scratch, I\'d prefer to refactor step by step.', zh: '与其从头重写，我更倾向于逐步重构。' },
            { en: 'Rather than hiring contractors, I\'d prefer to train our existing team.', zh: '与其雇外包，我更倾向于培训现有团队。' }
          ]
        },
        {
          formula: 'Compared to / with …, … is more …',
          meaning: { zh: '和……相比，……更……', en: 'Drawing a comparison between two things' },
          usage: { zh: '"compared to" 和 "compared with" 都可以；前者更常用于口语', en: '"Compared to" and "compared with" are both fine; "to" is more common in speech' },
          examples: [
            { en: 'Compared to the old design, this version is more intuitive.', zh: '和旧设计相比，这个版本更直观。' },
            { en: 'Compared with last quarter, our response time has improved significantly.', zh: '和上季度相比，我们的响应时间有了显著提升。' }
          ]
        },
        {
          formula: 'On one hand …, on the other hand …',
          meaning: { zh: '一方面……，另一方面……（对比两面）', en: 'Presenting two sides of an argument' },
          usage: { zh: '列出正反两面后再做判断，适合分析型讨论', en: 'Lay out both sides before making a judgment — good for analytical discussions' },
          examples: [
            { en: 'On one hand the framework is mature, on the other hand it has a steep learning curve.', zh: '一方面这个框架很成熟，另一方面学习曲线比较陡。' },
            { en: 'On one hand it saves cost, on the other hand it increases maintenance effort.', zh: '一方面能节省成本，另一方面会增加维护工作量。' }
          ]
        }
      ]
    },
    {
      key: 'cause',
      name: { zh: '因果 & 结果', en: 'Cause & Effect' },
      icon: '🔗',
      patterns: [
        {
          formula: 'The reason (why) … is that …',
          meaning: { zh: '……的原因是……', en: 'Explaining why something is the case' },
          usage: { zh: '"why" 可省略；避免写 "The reason is because"（语法冗余）', en: '"Why" is optional; avoid "The reason is because" (redundant)' },
          examples: [
            { en: 'The reason we chose React is that it has a large community.', zh: '我们选 React 的原因是它社区很大。' },
            { en: 'The reason the build failed is that a dependency was missing.', zh: '构建失败的原因是缺少了一个依赖。' }
          ]
        },
        {
          formula: 'Due to / Because of + noun …, …',
          meaning: { zh: '由于……，……', en: 'Stating a cause (followed by a noun, not a clause)' },
          usage: { zh: '"due to" 更正式书面；"because of" 口语也常用；后接名词而非句子', en: '"Due to" is more formal/written; "because of" works in speech; both take a noun, not a clause' },
          examples: [
            { en: 'Due to a network outage, the deployment was delayed.', zh: '由于网络中断，部署被推迟了。' },
            { en: 'Because of the feedback we received, we redesigned the flow.', zh: '由于收到的反馈，我们重新设计了流程。' }
          ]
        },
        {
          formula: 'As a result, … / Consequently, …',
          meaning: { zh: '因此，……/ 结果，……', en: 'Introducing a consequence' },
          usage: { zh: '放在句首引出结果；"consequently" 更书面', en: 'Placed at the start of a sentence to introduce the result; "consequently" is more formal' },
          examples: [
            { en: 'The server was overloaded. As a result, response times doubled.', zh: '服务器过载了。因此，响应时间翻了一倍。' },
            { en: 'We skipped testing. Consequently, several bugs reached production.', zh: '我们跳过了测试。结果，好几个 bug 流入了生产环境。' }
          ]
        }
      ]
    },
    {
      key: 'condition',
      name: { zh: '条件 & 假设', en: 'Conditions & Hypotheticals' },
      icon: '🔀',
      patterns: [
        {
          formula: 'If + present tense, … will + verb …',
          meaning: { zh: '如果……，就会……（真实条件句）', en: 'Real / likely condition and its result' },
          usage: { zh: '用于你认为有可能发生的事（第一类条件句）', en: 'For situations you believe are possible (first conditional)' },
          examples: [
            { en: 'If we launch by Friday, we\'ll have two weeks for user feedback.', zh: '如果我们周五上线，就有两周收集用户反馈。' },
            { en: 'If the API returns an error, we\'ll show a retry button.', zh: '如果 API 返回错误，我们就显示重试按钮。' }
          ]
        },
        {
          formula: 'If + past tense, … would + verb …',
          meaning: { zh: '如果……的话，就会……（假设/不太可能的情况）', en: 'Hypothetical / unlikely condition' },
          usage: { zh: '虚拟语气，用于假设性讨论（第二类条件句）', en: 'Subjunctive mood for hypothetical discussion (second conditional)' },
          examples: [
            { en: 'If we had more engineers, we would deliver it faster.', zh: '如果我们有更多工程师，就能更快交付。' },
            { en: 'If I were you, I would add unit tests first.', zh: '如果我是你，我会先加单元测试。' }
          ]
        },
        {
          formula: 'Unless + clause, …',
          meaning: { zh: '除非……，否则……（= if … not）', en: 'The negative condition — "if … not"' },
          usage: { zh: '表示"不满足这个条件就不行"，注意别和 "if not" 混淆导致双重否定', en: '"Unless" already means "if not" — don\'t add extra negation' },
          examples: [
            { en: 'Unless we fix this bug, we can\'t release.', zh: '除非我们修了这个 bug，否则没法发布。' },
            { en: 'Unless the client confirms by Monday, we\'ll push back the timeline.', zh: '除非客户周一前确认，否则我们就推迟时间线。' }
          ]
        },
        {
          formula: 'Provided (that) / As long as …, …',
          meaning: { zh: '只要……，就……（附带条件的同意）', en: 'Conditional agreement — "yes, if …"' },
          usage: { zh: '"provided that" 较正式；"as long as" 较口语；都表示在某个前提下可以', en: '"Provided that" is more formal; "as long as" is more casual; both set a precondition' },
          examples: [
            { en: 'We can go live as long as QA signs off.', zh: '只要 QA 通过，我们就可以上线。' },
            { en: 'Provided that the costs stay under budget, I\'m fine with the plan.', zh: '只要费用不超预算，我同意这个方案。' }
          ]
        }
      ]
    },
    {
      key: 'concession',
      name: { zh: '让步 & 转折', en: 'Concession & Contrast' },
      icon: '↩️',
      patterns: [
        {
          formula: 'Although / Even though + clause, …',
          meaning: { zh: '虽然……，但是……（让步转折）', en: 'Acknowledging one fact, then presenting a contrasting one' },
          usage: { zh: '"although" 和 "even though" 意思接近；"even though" 强调让步的意外性更强', en: '"Although" and "even though" are similar; "even though" emphasizes the surprise more' },
          examples: [
            { en: 'Although the feature is complex, the team delivered it on time.', zh: '虽然这个功能很复杂，但团队按时交付了。' },
            { en: 'Even though we increased the budget, the project is still behind schedule.', zh: '尽管我们增加了预算，项目仍然落后于计划。' }
          ]
        },
        {
          formula: 'Despite / In spite of + noun/-ing, …',
          meaning: { zh: '尽管……，……', en: 'Conceding a fact before stating the main point' },
          usage: { zh: '后接名词或动名词（不接句子）；"despite" 比 "in spite of" 更常用', en: 'Followed by a noun or gerund (not a clause); "despite" is more common than "in spite of"' },
          examples: [
            { en: 'Despite the tight deadline, we managed to ship a polished product.', zh: '尽管截止日期很紧，我们还是交付了一个精良的产品。' },
            { en: 'In spite of the negative reviews, downloads kept growing.', zh: '尽管评价不佳，下载量仍在增长。' }
          ]
        },
        {
          formula: 'While / Whereas …, …',
          meaning: { zh: '然而/而……（对比两个不同情况）', en: 'Contrasting two different situations' },
          usage: { zh: '"while" 放句首更常见；"whereas" 更正式，常出现在书面对比中', en: '"While" at the start is more common; "whereas" is more formal, often in written comparisons' },
          examples: [
            { en: 'While the backend is ready, the frontend still needs work.', zh: '后端已经就绪了，然而前端还需要打磨。' },
            { en: 'Android users prefer dark mode, whereas iOS users tend to stick with light mode.', zh: '安卓用户更偏好暗黑模式，而 iOS 用户倾向于使用浅色模式。' }
          ]
        }
      ]
    },
    {
      key: 'sequence',
      name: { zh: '步骤 & 流程', en: 'Sequencing & Process' },
      icon: '📋',
      patterns: [
        {
          formula: 'First / To begin with, … Then / Next, … Finally, …',
          meaning: { zh: '首先……，然后/接着……，最后……', en: 'Ordering steps in a process' },
          usage: { zh: '最基础的流程叙述框架；正式场合可用 "firstly, secondly, lastly"', en: 'The most basic sequencing framework; for formal contexts use "firstly, secondly, lastly"' },
          examples: [
            { en: 'First, clone the repo. Then, install the dependencies. Finally, run the dev server.', zh: '首先克隆仓库，然后安装依赖，最后运行开发服务器。' },
            { en: 'To begin with, we\'ll design the schema. Next, we\'ll build the API. Finally, we\'ll add the UI.', zh: '首先我们设计数据结构，接着构建 API，最后添加界面。' }
          ]
        },
        {
          formula: 'Once + clause, …',
          meaning: { zh: '一旦……，就……', en: '"As soon as" / "After" — the next step triggers' },
          usage: { zh: '强调某件事完成后下一步自动开始，比 "after" 更有节奏感', en: 'Emphasizes that the next step starts immediately after — more rhythmic than "after"' },
          examples: [
            { en: 'Once the design is approved, I\'ll start coding.', zh: '一旦设计稿通过，我就开始写代码。' },
            { en: 'Once you merge this PR, the CI pipeline will run automatically.', zh: '一旦你合并这个 PR，CI 流水线就会自动跑。' }
          ]
        },
        {
          formula: 'Before + verb-ing / clause, make sure (that) …',
          meaning: { zh: '在……之前，确保……', en: 'A prerequisite before an action' },
          usage: { zh: '提醒别人做某事之前先完成前置步骤', en: 'Reminds someone of a prerequisite before they act' },
          examples: [
            { en: 'Before deploying, make sure all tests pass.', zh: '部署之前，确保所有测试都通过。' },
            { en: 'Before you start the review, make sure you\'ve pulled the latest changes.', zh: '开始评审之前，确保你拉取了最新代码。' }
          ]
        }
      ]
    }
  ]
};
