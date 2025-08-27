export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: 'citizen' | 'leader' | 'journalist';
  verified: boolean;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  type: 'text' | 'article' | 'poll' | 'interview';
  image?: string;
  articleUrl?: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  posts: number;
  trending: boolean;
  category: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  author: User;
  publishedAt: string;
  readTime: string;
  image: string;
  category: string;
  tags: string[];
}

export const dummyUsers: User[] = [
  {
    id: '1',
    name: 'Hon. Rebecca Kadaga',
    username: 'rebeccakadaga',
    avatar: '/api/placeholder/40/40',
    role: 'leader',
    verified: true
  },
  {
    id: '2',
    name: 'Charles Onyango-Obbo',
    username: 'cobbo',
    avatar: '/api/placeholder/40/40',
    role: 'journalist',
    verified: true
  },
  {
    id: '3',
    name: 'Sarah Namuli',
    username: 'snamuli',
    avatar: '/api/placeholder/40/40',
    role: 'citizen',
    verified: false
  },
  {
    id: '4',
    name: 'Dr. Kiiza Besigye',
    username: 'kizzabesigye',
    avatar: '/api/placeholder/40/40',
    role: 'leader',
    verified: true
  },
  {
    id: '5',
    name: 'Grace Natabaalo',
    username: 'gnatabaalo',
    avatar: '/api/placeholder/40/40',
    role: 'journalist',
    verified: true
  }
];

export const dummyPosts: Post[] = [
  {
    id: '1',
    user: dummyUsers[0],
    content: 'The youth unemployment rate in Uganda requires immediate attention. We must create more opportunities in technology and agriculture sectors. What are your thoughts on this pressing issue?',
    timestamp: '2 hours ago',
    likes: 124,
    comments: 32,
    shares: 18,
    type: 'text'
  },
  {
    id: '2',
    user: dummyUsers[1],
    content: 'Breaking: New infrastructure development announced for Northern Uganda. This could be a game-changer for economic growth in the region.',
    timestamp: '4 hours ago',
    likes: 89,
    comments: 45,
    shares: 67,
    type: 'article',
    image: '/api/placeholder/500/300',
    articleUrl: '#'
  },
  {
    id: '3',
    user: dummyUsers[2],
    content: 'As a young entrepreneur in Kampala, I believe we need better access to credit facilities. Small businesses are the backbone of our economy. #UgandaEntrepreneurs',
    timestamp: '6 hours ago',
    likes: 56,
    comments: 23,
    shares: 12,
    type: 'text'
  },
  {
    id: '4',
    user: dummyUsers[3],
    content: 'Join me for a live discussion on education reform tomorrow at 3 PM. We\'ll be addressing the challenges facing our schools and universities.',
    timestamp: '8 hours ago',
    likes: 198,
    comments: 78,
    shares: 34,
    type: 'interview'
  },
  {
    id: '5',
    user: dummyUsers[4],
    content: 'Investigative report: The impact of climate change on coffee farming in Uganda. Our farmers need support now more than ever.',
    timestamp: '12 hours ago',
    likes: 156,
    comments: 67,
    shares: 89,
    type: 'article',
    image: '/api/placeholder/500/300'
  }
];

export const dummyTopics: Topic[] = [
  {
    id: '1',
    title: 'Youth Employment',
    description: 'Discussing job creation and opportunities for young Ugandans',
    posts: 234,
    trending: true,
    category: 'Economy'
  },
  {
    id: '2',
    title: 'Education Reform',
    description: 'Reforms needed in our education system',
    posts: 189,
    trending: true,
    category: 'Education'
  },
  {
    id: '3',
    title: 'Healthcare Access',
    description: 'Improving healthcare delivery across Uganda',
    posts: 156,
    trending: false,
    category: 'Health'
  },
  {
    id: '4',
    title: 'Infrastructure Development',
    description: 'Roads, bridges, and digital infrastructure',
    posts: 145,
    trending: true,
    category: 'Infrastructure'
  },
  {
    id: '5',
    title: 'Climate Action',
    description: 'Environmental protection and climate change',
    posts: 123,
    trending: false,
    category: 'Environment'
  },
  {
    id: '6',
    title: 'Digital Innovation',
    description: 'Technology and innovation in Uganda',
    posts: 98,
    trending: true,
    category: 'Technology'
  }
];

export const dummyArticles: Article[] = [
  {
    id: '1',
    title: 'Uganda\'s Economic Growth: Opportunities and Challenges Ahead',
    summary: 'An in-depth analysis of Uganda\'s economic trajectory and the key factors that will shape its future growth.',
    author: dummyUsers[1],
    publishedAt: '2024-01-15',
    readTime: '8 min read',
    image: '/api/placeholder/600/400',
    category: 'Economy',
    tags: ['Economics', 'Growth', 'Policy']
  },
  {
    id: '2',
    title: 'The Digital Revolution: How Technology is Transforming Uganda',
    summary: 'Exploring the rapid digital transformation happening across Uganda and its impact on various sectors.',
    author: dummyUsers[4],
    publishedAt: '2024-01-14',
    readTime: '6 min read',
    image: '/api/placeholder/600/400',
    category: 'Technology',
    tags: ['Technology', 'Innovation', 'Digital']
  },
  {
    id: '3',
    title: 'Climate Change and Agriculture: A Ugandan Perspective',
    summary: 'How climate change is affecting agricultural practices and what farmers are doing to adapt.',
    author: dummyUsers[1],
    publishedAt: '2024-01-13',
    readTime: '10 min read',
    image: '/api/placeholder/600/400',
    category: 'Environment',
    tags: ['Climate', 'Agriculture', 'Environment']
  },
  {
    id: '4',
    title: 'Education for All: Progress and Challenges in Uganda',
    summary: 'Examining the strides made in education and the challenges that remain in achieving universal access.',
    author: dummyUsers[4],
    publishedAt: '2024-01-12',
    readTime: '7 min read',
    image: '/api/placeholder/600/400',
    category: 'Education',
    tags: ['Education', 'Policy', 'Development']
  }
];