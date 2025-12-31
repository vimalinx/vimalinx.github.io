import { Github, Smartphone, BookOpen, GraduationCap, Gift, Database, Layout } from 'lucide-react';

export type Language = 'zh' | 'en';

export const config = {
  profile: {
    name: "七叶怀瑾",
    englishName: "Vimalinx",
    title: {
      zh: "个人开发者 & 终身学习者 & AI 发烧友",
      en: "Personal Developer & Lifelong Learner & AI Enthusiast"
    },
    bio: {
      zh: "一个对技术和创意有无限热情的个人开发者，写点好玩的好看的小东西",
      en: "A passionate personal developer with an insatiable love for technology and creativity. Building fun and beautiful things."
    },
    avatar: "/avatar-placeholder.png", 
  },
  projects: [
    {
      id: 'cybergift',
      title: "CyberGift",
      description: {
        zh: "粒子世界的极致浪漫 · 永久封存的数字誓言",
        en: "The ultimate romantic experience in the particle world. A permanent digital vow."
      },
      url: "https://cybergift.store",
      tags: ["E-Commerce", "Futuristic", "Web3"],
      icon: Gift,
      image: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", // Placeholder for actual image
      accent: "from-purple-500 to-indigo-500",
      status: "Live",
    },
    {
      id: 'tiku',
      title: "Tiku",
      description: {
        zh: "给学会计的老婆的刷题系统，爱你宝贝(可能还会加哦)",
        en: "A practice question system for my wife who is studying accounting, love you baby (might add more later)"
      },
      url: "https://vimalinx.xyz/tiku",
      tags: ["Education", "Algorithm", "SaaS"],
      icon: Database,
      image: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
      accent: "from-emerald-500 to-teal-500",
      status: "Live",
    },
    {
      id: 'flowstudy',
      title: "FlowStudy",
      description: {
        zh: "AI时代个人自学平台，打通知识学习、复盘、整理的各种场景，颜值和实力兼具的学习系统，打造极致专注空间。",
        en: "An AI-powered personal study platform that connects knowledge learning, review, and organization in various scenarios. Combining the beauty of design with the power of technology, it creates the ultimate focused study space."
      },
      url: "#", 
      tags: ["Productivity", "Flow State", "App"],
      icon: GraduationCap,
      image: "linear-gradient(135deg, #23074d 0%, #cc5333 100%)",
      accent: "from-orange-500 to-red-500",
      status: "Concept",
    },
    {
      id: 'cogniread',
      title: "CogniRead",
      description: {
        zh: "一个轻量化的简单的英文阅读软件，打造沉浸式可持续广泛兼容的阅读体验",
        en: "A lightweight and simple English reading software that creates an immersive, sustainable, and widely compatible reading experience."
      },
      url: "https://github.com/vimalinx/CogniRead", 
      tags: ["Productivity", "Flow State", "App"],
      icon: BookOpen,
      image: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", // Placeholder for actual image
      accent: "from-purple-500 to-indigo-500",
      status: "Live",
    }
  ],
    socials: [
      {
        id: 'wechat',
        name: { zh: '微信公众号', en: 'WeChat' },
        icon: Smartphone,
        type: 'qrcode',
        qrCode: '/qr-wechat.jpg',
        color: 'hover:text-green-500',
        details: {
          zh: [
            "”照我思索，能认识人”",
            "这是我的核心思维阵地。",
            "分享个人成长经历，阅读、思考、写作。",
            "认知源于对内在世界的观察和体验"
          ],
          en: [
            "My core thinking hub.",
            "Sharing personal growth experiences, reading, thinking, writing.",
            "Cognition emerges from the observation and experience of the inner world."
          ]
        }
      },
      {
        id: 'xiaohongshu',
        name: { zh: '小红书', en: 'RedNote' },
        icon: Smartphone, 
        type: 'qrcode',
        qrCode: '/qr-xhs.png',
        color: 'hover:text-red-500',
        details: {
          zh: [
            "探索数字游民的生活美学。",
            "在这里展示我的小东西的开发进度和学习经验分享、生产力工具推荐以及设计灵感来源。",
            "用视觉语言记录代码之外的精彩瞬间。"
          ],
          en: [
            "Exploring the aesthetics of digital nomad life.",
            "Showcasing the development progress and learning experiences of my small projects, productivity tools, and design inspirations.",
            "Visualizing the beautiful moments beyond the code."
          ]
        }
      },
      {
        id: 'github',
        name: { zh: 'GitHub', en: 'GitHub' },
        icon: Github,
        type: 'link',
        url: 'https://github.com/vimalinx',
        color: 'hover:text-gray-400',
        details: {
          zh: [
            "开源世界的代码仓库。",
            "你可以在这里找到 FlowStudy、CyberGift 的源码，以及更多实验性项目。",
            "欢迎 Star，欢迎 Fork，让我们一起构建更好的软件。"
          ],
          en: [
            "My code repository in the open source world.",
            "Find source codes for FlowStudy, CyberGift, and more experimental projects.",
            "Stars and Forks welcome. Let's build better software together."
          ]
        }
      },
    ],
  };
  