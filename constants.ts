import { Contact, ChatSession, Moment, User } from './types';

export const CURRENT_USER: User = {
  id: 'me',
  name: '旅行者',
  avatar: 'https://picsum.photos/id/64/200/200',
  wxid: 'wxid_traveler123',
  region: '中国 上海'
};

// 扩充的百家姓库
const SURNAMES = [
  '李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴',
  '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗',
  '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧',
  '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕',
  '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎',
  '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜',
  '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆',
  '郝', '孔', '白', '崔', '康', '毛', '邱', '秦', '江', '史',
  '顾', '侯', '邵', '孟', '龙', '万', '段', '雷', '钱', '汤',
  '尹', '黎', '易', '常', '武', '乔', '贺', '赖', '龚', '文'
];

// 扩充的名字库
const NAMES = [
  '伟', '芳', '娜', '敏', '静', '强', '磊', '洋', '艳', '勇',
  '军', '杰', '娟', '涛', '明', '超', '秀英', '浩', '平', '刚',
  '桂英', '子涵', '梓萱', '一诺', '梦', '茜', '安', '雨', '欣', '博',
  '思', '文', '雅', '婷', '龙', '雪', '琳', '宇', '通过', '建华',
  '建国', '志强', '红', '玉', '兰', '梅', '飞', '翔', '云', '晨',
  '瑞', '东', '海', '波', '辉', '力', '峰', '松', '彬', '宁',
  '楠', '萍', '玲', '霞', '薇', '丹', '晶', '媛', '璐', '菲',
  '慧', '颖', '俊', '凯', '铭', '旭', '阳', '鹏', '宏', '锐',
  '振', '佳', '乐', '天', '昊', '然', '一', '星', '光', '亮',
  '嘉', '哲', '熙', '若是', '依', '诺', '诗', '涵', '语', '瞳'
];

// 偶尔生成一些带英文或Emoji的昵称，更逼真
const EXTRAS = [' (Tony)', '酱', '✨', 'Design', 'mama', 'Pro', ''];

export const generateFakeNames = (count: number): string[] => {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const surname = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    // 30% 概率生成三字名
    const name2 = Math.random() > 0.7 ? NAMES[Math.floor(Math.random() * NAMES.length)] : '';
    // 5% 概率加后缀
    const extra = Math.random() > 0.95 ? EXTRAS[Math.floor(Math.random() * EXTRAS.length)] : '';
    
    result.push(surname + name + name2 + extra);
  }
  return result;
};

export const CONTACTS: Contact[] = [
  {
    id: 'ai_assistant',
    name: 'AI 助手',
    avatar: 'https://picsum.photos/id/96/200/200',
    isAi: true,
    initial: 'A',
    wxid: 'gemini_ai'
  },
  {
    id: 'c_file',
    name: '文件传输助手',
    avatar: 'https://picsum.photos/id/0/200/200',
    initial: 'W',
    wxid: 'filehelper'
  },
  // 真实感名字
  { id: 'c_zhangwei', name: '张伟', avatar: 'https://picsum.photos/id/1005/200/200', initial: 'Z', wxid: 'zhangwei_88' },
  { id: 'c_lina', name: '李娜', avatar: 'https://picsum.photos/id/1011/200/200', initial: 'L', wxid: 'lina_na' },
  { id: 'c_wangqiang', name: '王强', avatar: 'https://picsum.photos/id/1012/200/200', initial: 'W', wxid: 'strong_wang' },
  { id: 'c_chenjing', name: '陈静', avatar: 'https://picsum.photos/id/1027/200/200', initial: 'C', wxid: 'jing_chen' },
  { id: 'c_liuyang', name: '刘洋', avatar: 'https://picsum.photos/id/1025/200/200', initial: 'L', wxid: 'ocean_liu' },
  { id: 'c_zhaomin', name: '赵敏', avatar: 'https://picsum.photos/id/338/200/200', initial: 'Z', wxid: 'min_zhao' },
  { id: 'c_sunjie', name: '孙杰', avatar: 'https://picsum.photos/id/64/200/200', initial: 'S', wxid: 'sun_jay' },
  { id: 'c_wugang', name: '吴刚', avatar: 'https://picsum.photos/id/91/200/200', initial: 'W', wxid: 'wu_gang' },
  { id: 'c_zhengting', name: '郑婷婷', avatar: 'https://picsum.photos/id/349/200/200', initial: 'Z', wxid: 'tingting_z' },
  { id: 'c_linlin', name: '林林', avatar: 'https://picsum.photos/id/355/200/200', initial: 'L', wxid: 'linlin_wood' },
  { id: 'c_guotao', name: '郭涛', avatar: 'https://picsum.photos/id/334/200/200', initial: 'G', wxid: 'guo_tao' },
  { id: 'c_majun', name: '马军', avatar: 'https://picsum.photos/id/375/200/200', initial: 'M', wxid: 'ma_army' },
  { id: 'c_luowei', name: '罗伟', avatar: 'https://picsum.photos/id/399/200/200', initial: 'L', wxid: 'luo_wei' },
  { id: 'c_liangzi', name: '梁子', avatar: 'https://picsum.photos/id/447/200/200', initial: 'L', wxid: 'liang_zi' },
  { id: 'c_song', name: '宋佳', avatar: 'https://picsum.photos/id/453/200/200', initial: 'S', wxid: 'song_jia' },
  { id: 'c_family', name: '相亲相爱一家人', avatar: 'https://picsum.photos/id/835/200/200', initial: 'X', wxid: 'family_group' },
];

export const INITIAL_CHATS: ChatSession[] = [
  {
    id: 'chat_ai',
    contactId: 'ai_assistant',
    unreadCount: 0,
    lastMessage: {
      id: 'm_init_1',
      text: '你好！我是 AI 助手。',
      senderId: 'ai_assistant',
      timestamp: Date.now() - 60000,
      type: 'text'
    }
  },
  {
    id: 'chat_1',
    contactId: 'c_zhangwei',
    unreadCount: 1,
    lastMessage: {
      id: 'm_init_2',
      text: '今晚有空出来吃饭吗？老地方见。',
      senderId: 'c_zhangwei',
      timestamp: Date.now() - 1800000,
      type: 'text'
    }
  },
  {
    id: 'chat_2',
    contactId: 'c_lina',
    unreadCount: 2,
    lastMessage: {
      id: 'm_init_3',
      text: 'PPT 我已经发到你邮箱了，记得查收一下。',
      senderId: 'c_lina',
      timestamp: Date.now() - 3600000,
      type: 'text'
    }
  },
  {
    id: 'chat_3',
    contactId: 'c_file',
    unreadCount: 0,
    lastMessage: {
      id: 'm_init_4',
      text: '[文件] data_report.pdf',
      senderId: 'me',
      timestamp: Date.now() - 86400000,
      type: 'text'
    }
  },
  {
    id: 'chat_4',
    contactId: 'c_family',
    unreadCount: 5,
    lastMessage: {
      id: 'm_init_5',
      text: '妈妈: 周末记得回来喝汤啊！',
      senderId: 'c_family',
      timestamp: Date.now() - 1200000,
      type: 'text'
    }
  },
  {
    id: 'chat_5',
    contactId: 'c_wangqiang',
    unreadCount: 0,
    lastMessage: {
      id: 'm_init_6',
      text: '收到，谢谢！',
      senderId: 'c_wangqiang',
      timestamp: Date.now() - 172800000,
      type: 'text'
    }
  }
];

export const MOCK_MOMENTS: Moment[] = [
  {
    id: 'moment_1',
    userId: 'c_lina',
    content: '周末的阳光真好，适合出去踏青。☀️',
    images: ['https://picsum.photos/id/200/400/300', 'https://picsum.photos/id/201/400/300'],
    timestamp: Date.now() - 1200000,
    likes: ['张伟', '王强', '陈静', '刘洋'],
    comments: [{ user: '张伟', text: '哪里拍的？景色不错！' }]
  },
  {
    id: 'moment_2',
    userId: 'c_zhangwei',
    content: '加班到现在的有没有？求安慰。☕️',
    images: [], // Text only
    timestamp: Date.now() - 3600000,
    likes: ['李娜', '赵敏', 'AI 助手'],
    comments: [
      { user: '李娜', text: '辛苦了，早点回去休息。' },
      { user: '赵敏', text: '同在加班中...' }
    ]
  },
  {
    id: 'moment_3',
    userId: 'c_zhaomin',
    content: '强力推荐这家餐厅，味道绝绝子！',
    isLink: true,
    linkTitle: '大众点评：上海必吃榜前十名餐厅，没吃过后悔一年！',
    linkIcon: 'https://picsum.photos/id/106/100/100',
    timestamp: Date.now() - 7200000,
    likes: ['张伟', '孙杰', '郑婷婷'],
    comments: []
  }
];