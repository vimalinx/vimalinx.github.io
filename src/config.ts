import { Github, Smartphone, BookOpen, Gift, Database, Layout } from 'lucide-react';

export type Language = 'zh' | 'en';

export const config = {
  profile: {
    name: "七叶怀瑾",
    englishName: "Vimalinx",
    title: {
      zh: "全栈开发者 & 创意构建者",
      en: "Full Stack Developer & Creator"
    },
    bio: {
      zh: "探索代码与艺术的边界。构建有呼吸感的数字体验。",
      en: "Exploring the boundary between code and art. Building digital experiences that breathe."
    },
    avatar: "/avatar-placeholder.png", 
  },
  projects: [
    {
      id: 'cybergift',
      title: "CyberGift",
      description: {
        zh: "未来主义数字礼物平台。为现代纪元策划独特的虚拟赠礼体验，打破物理世界的馈赠限制。",
        en: "A futuristic digital gifting platform. Curating unique virtual experiences for the modern era."
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
        zh: "专为高效学习设计的智能题库系统。通过算法优化知识留存率，让刷题不再是机械重复。",
        en: "Intelligent question bank designed for efficient learning. optimizing retention through algorithms."
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
        zh: "专注于心流状态的沉浸式学习环境。融合番茄工作法与白噪音，打造极致专注空间。",
        en: "An immersive study environment focused on flow state. Merging pomodoro with ambient soundscapes."
      },
      url: "#", 
      tags: ["Productivity", "Flow State", "App"],
      icon: BookOpen,
      image: "linear-gradient(135deg, #23074d 0%, #cc5333 100%)",
      accent: "from-orange-500 to-red-500",
      status: "Concept",
    },
    {
      id: 'portfolio',
      title: "Portfolio v1",
      description: {
        zh: "你现在看到的这个网站。基于 React + Framer Motion 打造的流体极简主义实验。",
        en: "The site you are viewing. A fluid minimalism experiment built with React + Framer Motion."
      },
      url: "#",
      tags: ["Design", "Animation", "React"],
      icon: Layout,
      image: "linear-gradient(135deg, #000000 0%, #434343 100%)",
      accent: "from-gray-200 to-gray-500",
      status: "Live",
    },
  ],
  socials: [
    {
      id: 'wechat',
      name: { zh: '微信公众号', en: 'WeChat' },
      icon: Smartphone,
      type: 'qrcode',
      qrCode: '/qr-wechat.jpg',
      color: 'hover:text-green-500',
    },
    {
      id: 'xiaohongshu',
      name: { zh: '小红书', en: 'RedNote' },
      icon: Smartphone, 
      type: 'qrcode',
      qrCode: '/qr-xhs.jpg',
      color: 'hover:text-red-500',
    },
    {
      id: 'github',
      name: { zh: 'GitHub', en: 'GitHub' },
      icon: Github,
      type: 'link',
      url: 'https://github.com/vimalinx',
      color: 'hover:text-gray-400',
    },
  ],
};