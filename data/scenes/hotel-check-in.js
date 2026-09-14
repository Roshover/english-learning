/**
 * 场景数据：酒店入住 & 前台沟通
 * 复制这个文件改内容，就能新增一个场景。
 * 记得在 index.html 里加一行 <script>，并在 data/scenes-index.js 里注册。
 */
window.RTE_SCENES = window.RTE_SCENES || {};
window.RTE_SCENES['hotel-check-in'] = {
  id: 'hotel-check-in',
  category: { zh: '出国旅游', en: 'Travel' },
  icon: '🏨',
  minutes: 6,
  title: { zh: '酒店入住 & 前台沟通', en: 'Hotel Check-in & Front Desk' },
  scene: {
    zh: '你刚下飞机，拖着行李来到酒店前台办理入住。过程中房卡出了点问题，你需要和前台沟通解决。',
    en: 'You just landed and arrive at the hotel front desk to check in. Something goes wrong with the key card, and you work it out with the receptionist.'
  },

  // 生僻词 / 专业名词：先看懂再进对话
  vocabulary: [
    {
      word: 'reservation',
      phonetic: '/ˌrezərˈveɪʃn/',
      pos: 'n.',
      meaning: { zh: '预订（房间、座位等）', en: 'a booking made in advance' },
      example: 'I have a reservation under the name Zhang.'
    },
    {
      word: 'check in',
      phonetic: '/tʃek ɪn/',
      pos: 'phr. v.',
      meaning: { zh: '办理入住登记', en: 'to register on arrival at a hotel' },
      example: "I'd like to check in, please."
    },
    {
      word: 'confirmation number',
      phonetic: '/ˌkɑːnfərˈmeɪʃn ˈnʌmbər/',
      pos: 'n.',
      meaning: { zh: '预订确认号', en: 'the code that confirms your booking' },
      example: 'Here is my confirmation number.'
    },
    {
      word: 'deposit',
      phonetic: '/dɪˈpɑːzɪt/',
      pos: 'n.',
      meaning: { zh: '押金', en: 'money paid in advance, refundable' },
      example: 'We require a $50 deposit for incidentals.'
    },
    {
      word: 'key card',
      phonetic: '/kiː kɑːrd/',
      pos: 'n.',
      meaning: { zh: '房卡', en: 'the card used to open your room' },
      example: 'Your key card is not working.'
    },
    {
      word: 'deactivate',
      phonetic: '/diˈæktɪveɪt/',
      pos: 'v.',
      meaning: { zh: '（使）失效、停用', en: 'to make something stop working' },
      example: 'Your phone may have deactivated the key card.'
    },
    {
      word: 'complimentary',
      phonetic: '/ˌkɑːmplɪˈmentri/',
      pos: 'adj.',
      meaning: { zh: '免费赠送的', en: 'given free of charge' },
      example: 'Breakfast is complimentary from 7 to 10 a.m.'
    },
    {
      word: 'late check-out',
      phonetic: '/leɪt ˈtʃek aʊt/',
      pos: 'n.',
      meaning: { zh: '延迟退房', en: 'leaving the room later than the standard time' },
      example: 'Could I request a late check-out?'
    }
  ],

  // 对话：role 是双语，en / zh 分别是英文台词与中文翻译
  dialogue: [
    { roleKey: 'guest', role: { zh: '你', en: 'You' },
      en: "Hi, I'd like to check in, please. I have a reservation under Zhang.",
      zh: '你好，我想办理入住。我用张先生的名字预订了房间。' },

    { roleKey: 'staff', role: { zh: '前台', en: 'Front Desk' },
      en: "Welcome! May I have your confirmation number and a photo ID?",
      zh: '欢迎光临！可以给我您的预订确认号和一张证件吗？' },

    { roleKey: 'guest', role: { zh: '你', en: 'You' },
      en: "Sure. The confirmation number is 8842-K, and here's my passport.",
      zh: '好的。确认号是 8842-K，这是我的护照。' },

    { roleKey: 'staff', role: { zh: '前台', en: 'Front Desk' },
      en: "Thank you. I have you down for a king room for three nights. We'll place a $50 deposit for incidentals, refunded at check-out.",
      zh: '谢谢。我这边显示您预订了一间大床房，住三晚。我们会预授权 50 美元押金用于杂费，退房时退还。' },

    { roleKey: 'guest', role: { zh: '你', en: 'You' },
      en: "That works. Is breakfast included?",
      zh: '可以。请问含早餐吗？' },

    { roleKey: 'staff', role: { zh: '前台', en: 'Front Desk' },
      en: "Yes, breakfast is complimentary from 7 to 10 a.m. on the second floor. Here are your two key cards for room 1208.",
      zh: '含的，早餐免费，早上 7 点到 10 点在二楼。这是您 1208 房间的两张房卡。' },

    { roleKey: 'guest', role: { zh: '你', en: 'You' },
      en: "Great, thank you!",
      zh: '太好了，谢谢！' },

    // —— 房卡出问题，回来沟通 ——
    { roleKey: 'guest', role: { zh: '你', en: 'You' },
      en: "Sorry to bother you. My key card isn't working — the light turns red.",
      zh: '不好意思打扰一下。我的房卡刷不开，指示灯是红的。' },

    { roleKey: 'staff', role: { zh: '前台', en: 'Front Desk' },
      en: "I'm sorry about that. Sometimes a phone can deactivate the card if they're kept together. Let me re-activate it for you.",
      zh: '非常抱歉。房卡和手机放一起有时会消磁失效。我帮您重新激活一下。' },

    { roleKey: 'guest', role: { zh: '你', en: 'You' },
      en: "Ah, that makes sense. Also, could I request a late check-out on my last day?",
      zh: '原来如此。另外，我最后一天可以申请延迟退房吗？' },

    { roleKey: 'staff', role: { zh: '前台', en: 'Front Desk' },
      en: "Of course. I can offer check-out until 2 p.m. at no extra charge. You're all set — enjoy your stay!",
      zh: '当然可以。我可以给您延到下午 2 点退房，不额外收费。都办好了，祝您入住愉快！' }
  ]
};
