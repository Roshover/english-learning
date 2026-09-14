/**
 * glossary.js — 通用词库（离线）
 * 点对话里的单词时，先查场景词汇 → 再查这里 → 都没有才联网查。
 * key 用单词原形（小写）；meaning 双语；collocations 是常用搭配/表达。
 * 想让某个词的卡片更丰富，往这里加即可。
 */
window.RTE_GLOSSARY = {
  reservation: {
    phonetic: '/ˌrezərˈveɪʃn/', pos: 'n.',
    meaning: { zh: '预订（房间、座位等）', en: 'a booking made in advance' },
    collocations: [
      { en: 'make a reservation', zh: '进行预订' },
      { en: 'have a reservation under (the name) …', zh: '以……的名字有预订' },
      { en: 'cancel / change a reservation', zh: '取消 / 更改预订' },
      { en: 'a dinner reservation', zh: '餐厅订位' }
    ]
  },
  check: {
    phonetic: '/tʃek/', pos: 'v. / n.',
    meaning: { zh: '检查；办理（登记）；账单(美式)', en: 'to look at; to register; (US) a bill' },
    collocations: [
      { en: 'check in / check out', zh: '入住 / 退房' },
      { en: 'check the availability', zh: '查询有没有空位' },
      { en: 'double-check', zh: '再确认一遍' }
    ]
  },
  deposit: {
    phonetic: '/dɪˈpɑːzɪt/', pos: 'n. / v.',
    meaning: { zh: '押金；存款；存放', en: 'money paid in advance; to put money in' },
    collocations: [
      { en: 'pay / leave a deposit', zh: '付押金' },
      { en: 'a refundable deposit', zh: '可退押金' },
      { en: 'a security deposit', zh: '保证金' }
    ]
  },
  refund: {
    phonetic: '/ˈriːfʌnd/', pos: 'n. / v.',
    meaning: { zh: '退款；退还', en: 'money paid back; to pay money back' },
    collocations: [
      { en: 'get / receive a refund', zh: '拿到退款' },
      { en: 'a full / partial refund', zh: '全额 / 部分退款' },
      { en: 'refund the deposit', zh: '退还押金' }
    ]
  },
  available: {
    phonetic: '/əˈveɪləbl/', pos: 'adj.',
    meaning: { zh: '可用的；有空的；可获得的', en: 'able to be used or obtained; free' },
    collocations: [
      { en: 'be available', zh: '有空 / 可用' },
      { en: 'check availability', zh: '查询是否有空' },
      { en: 'readily available', zh: '很容易得到的' }
    ]
  },
  authorize: {
    phonetic: '/ˈɔːθəraɪz/', pos: 'v.',
    meaning: { zh: '授权；批准（预授权）', en: 'to give official permission' },
    collocations: [
      { en: 'authorize a payment / hold', zh: '（对付款/押金）进行预授权' },
      { en: 'be authorized to do sth', zh: '被授权做某事' }
    ]
  },
  hold: {
    phonetic: '/hoʊld/', pos: 'n. / v.',
    meaning: { zh: '（信用卡）预授权冻结；握住；保留', en: 'a temporary charge held on a card; to keep' },
    collocations: [
      { en: 'place a hold on your card', zh: '在卡上做预授权冻结' },
      { en: 'hold on', zh: '稍等；坚持' },
      { en: 'on hold', zh: '（电话）等待中；搁置' }
    ]
  },
  amenities: {
    phonetic: '/əˈmenətiz/', pos: 'n.',
    meaning: { zh: '（酒店的）设施与便利用品', en: 'facilities and comforts provided' },
    collocations: [
      { en: 'hotel amenities', zh: '酒店设施' },
      { en: 'in-room amenities', zh: '客房内用品' },
      { en: 'basic amenities', zh: '基本设施' }
    ]
  },
  complimentary: {
    phonetic: '/ˌkɑːmplɪˈmentri/', pos: 'adj.',
    meaning: { zh: '免费赠送的', en: 'given free of charge' },
    collocations: [
      { en: 'complimentary breakfast / Wi-Fi', zh: '免费早餐 / 网络' },
      { en: 'a complimentary upgrade', zh: '免费升级' }
    ]
  },
  charge: {
    phonetic: '/tʃɑːrdʒ/', pos: 'n. / v.',
    meaning: { zh: '收费；费用；充电', en: 'a fee; to ask for payment; to power up' },
    collocations: [
      { en: 'at no extra charge', zh: '不额外收费' },
      { en: 'free of charge', zh: '免费' },
      { en: 'charge sb for sth', zh: '就某事向某人收费' }
    ]
  },
  request: {
    phonetic: '/rɪˈkwest/', pos: 'n. / v.',
    meaning: { zh: '请求；要求', en: 'to politely ask for something' },
    collocations: [
      { en: 'make a request', zh: '提出请求' },
      { en: 'request a late check-out', zh: '申请延迟退房' },
      { en: 'on request', zh: '一经要求（即提供）' }
    ]
  },
  offer: {
    phonetic: '/ˈɔːfər/', pos: 'v. / n.',
    meaning: { zh: '提供；提议；报价', en: 'to provide or propose' },
    collocations: [
      { en: 'offer sb sth', zh: '给某人提供某物' },
      { en: 'a special offer', zh: '特价优惠' },
      { en: 'offer to help', zh: '主动提出帮忙' }
    ]
  },
  welcome: {
    phonetic: '/ˈwelkəm/', pos: 'int. / v. / adj.',
    meaning: { zh: '欢迎；欢迎的', en: 'a greeting to a guest; to greet warmly' },
    collocations: [
      { en: "You're welcome.", zh: '不客气。' },
      { en: 'a warm welcome', zh: '热烈欢迎' },
      { en: 'welcome aboard', zh: '欢迎加入' }
    ]
  },
  bother: {
    phonetic: '/ˈbɑːðər/', pos: 'v. / n.',
    meaning: { zh: '打扰；麻烦', en: 'to trouble or disturb someone' },
    collocations: [
      { en: 'Sorry to bother you.', zh: '不好意思打扰一下。' },
      { en: "Don't bother.", zh: '不用麻烦了。' }
    ]
  },
  sort: {
    phonetic: '/sɔːrt/', pos: 'v. / n.',
    meaning: { zh: '整理；解决；种类', en: 'to arrange; to solve; a type' },
    collocations: [
      { en: 'sort sth out', zh: '把某事解决好' },
      { en: 'sort of', zh: '有点儿；算是' },
      { en: 'all sorts of', zh: '各种各样的' }
    ]
  },
  pleasure: {
    phonetic: '/ˈpleʒər/', pos: 'n.',
    meaning: { zh: '愉快；荣幸', en: 'a feeling of enjoyment' },
    collocations: [
      { en: 'My pleasure.', zh: '不客气（我的荣幸）。' },
      { en: 'with pleasure', zh: '很乐意' },
      { en: 'It’s a pleasure to …', zh: '很高兴能……' }
    ]
  },
  dial: {
    phonetic: '/ˈdaɪəl/', pos: 'v.',
    meaning: { zh: '拨（电话号码）', en: 'to enter a phone number' },
    collocations: [
      { en: 'dial zero / an extension', zh: '拨 0 / 拨分机' },
      { en: 'dial a number', zh: '拨号码' }
    ]
  },
  note: {
    phonetic: '/noʊt/', pos: 'n. / v.',
    meaning: { zh: '备注；便条；注意', en: 'a short record; to notice' },
    collocations: [
      { en: 'add a note to …', zh: '给……加个备注' },
      { en: 'take notes', zh: '记笔记' },
      { en: 'please note that …', zh: '请注意……' }
    ]
  },
  throughout: {
    phonetic: '/θruːˈaʊt/', pos: 'prep. / adv.',
    meaning: { zh: '遍及；在整个期间', en: 'in every part; during the whole time' },
    collocations: [
      { en: 'throughout the hotel', zh: '整个酒店（各处）' },
      { en: 'throughout the day', zh: '一整天' }
    ]
  },
  include: {
    phonetic: '/ɪnˈkluːd/', pos: 'v.',
    meaning: { zh: '包括；包含', en: 'to contain as a part' },
    collocations: [
      { en: 'breakfast is included', zh: '含早餐' },
      { en: 'including …', zh: '包括……' },
      { en: 'tax included', zh: '含税' }
    ]
  },
  elevator: {
    phonetic: '/ˈelɪveɪtər/', pos: 'n.',
    meaning: { zh: '电梯（美式；英式 lift）', en: 'a lift (US English)' },
    collocations: [
      { en: 'take the elevator', zh: '乘电梯' },
      { en: 'the elevators are …', zh: '电梯在……' }
    ]
  },
  housekeeping: {
    phonetic: '/ˈhaʊskiːpɪŋ/', pos: 'n.',
    meaning: { zh: '客房清洁服务', en: 'the department that cleans rooms' },
    collocations: [
      { en: 'call / let housekeeping know', zh: '通知客房部' },
      { en: 'housekeeping service', zh: '客房清洁服务' }
    ]
  },
  passport: {
    phonetic: '/ˈpæspɔːrt/', pos: 'n.',
    meaning: { zh: '护照', en: 'an official travel document' },
    collocations: [
      { en: 'show your passport', zh: '出示护照' },
      { en: 'a valid passport', zh: '有效护照' }
    ]
  },
  flight: {
    phonetic: '/flaɪt/', pos: 'n.',
    meaning: { zh: '航班；飞行', en: 'a journey by plane' },
    collocations: [
      { en: 'catch / miss a flight', zh: '赶上 / 错过航班' },
      { en: 'a connecting flight', zh: '转机航班' },
      { en: 'my flight is at …', zh: '我的航班在……' }
    ]
  }
};
