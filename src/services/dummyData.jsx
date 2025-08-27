// dummyData.js

// 🧑‍🤝‍🧑 USERS
export const users = [
  {
    id: 1,
    name: "Alice Kato",
    username: "cv",
    password: "pass123",
    avatar: "/images/users/alice.jpg",
    bio: "Journalist | Storyteller | Ugandan Culture Enthusiast",
    joined: "2024-02-12",
    district: "Wakiso",
    city: "Kampala",
  },
  {
    id: 2,
    name: "Brian Okello",
    username: "ok",
    password: "Pass2025",
    avatar: "/images/users/brian.jpg",
    bio: "Tech & Innovation Writer",
    joined: "2023-11-05",
    district: "Kampala",
    city: "Kampala",
  },
  {
    id: 3,
    name: "Sarah Namukasa",
    username: "sarahn",
    password: "sarahSecure#1",
    avatar: "/images/users/sarah.jpg",
    bio: "Lifestyle Blogger & Photographer",
    joined: "2024-03-20",
    district: "Jinja",
    city: "Jinja",
  },
  {
    id: 4,
    name: "David Mugisha",
    username: "mugishad",
    password: "mugisha_2025",
    avatar: "/images/users/david.jpg",
    bio: "Sports Analyst & Commentator",
    joined: "2024-05-14",
    district: "Mbarara",
    city: "Mbarara",
  },
];

// 📰 CATEGORIES
export const categories = [
  "Business",
  "Technology",
  "Travel",
  "Lifestyle",
  "Environment",
  "Sports",
  "Politics",
  "Health",
];

// 🏷️ TRENDING TOPICS
export const trendingTopics = [
  { topic: "Uganda Elections 2025", mentions: 1240 },
  { topic: "Coffee Industry", mentions: 980 },
  { topic: "Kampala Startups", mentions: 860 },
  { topic: "Rolex Street Food", mentions: 720 },
  { topic: "Renewable Energy", mentions: 680 },
];

// 🚨 BREAKING NEWS ALERTS
export const breakingNews = [
  {
    id: 1,
    title: "President Signs New Renewable Energy Bill",
    link: "/news/renewable-energy-bill",
    createdAt: "2025-08-13T06:45:00Z",
    urgency: "high",
  },
  {
    id: 2,
    title: "Heavy Rains Cause Flooding in Eastern Uganda",
    link: "/news/eastern-uganda-floods",
    createdAt: "2025-08-12T14:20:00Z",
    urgency: "medium",
  },
];

// 📌 POSTS
export const posts = [
  {
    id: 1,
    authorId: 1,
    title: "Uganda’s Coffee Industry Booms in 2025",
    type: "image",
    media: "/images/posts/coffee.jpg",
    content:
      "Uganda’s coffee exports hit a record high in 2025, bringing new opportunities for farmers and the economy.",
    category: "Business",
    tags: ["coffee", "economy", "agriculture"],
    reads: 1280,
    downloads: { pdf: 50, images: 40, videos: 30 },
    commentsCount: 5,
    createdAt: "2025-08-01T10:30:00Z",
  },
  {
    id: 2,
    authorId: 2,
    title: "Tech Startups Changing Kampala’s Skyline",
    type: "video",
    media: "/videos/posts/startups.mp4",
    content:
      "A wave of tech startups in Kampala is transforming the business landscape, creating jobs and innovations.",
    category: "Technology",
    tags: ["startups", "innovation", "Kampala"],
    reads: 980,
    downloads: { pdf: 20, images: 35, videos: 25 },
    commentsCount: 8,
    createdAt: "2025-07-25T14:15:00Z",
  },
  {
    id: 3,
    authorId: 3,
    title: "Top 10 Travel Destinations in Eastern Uganda",
    type: "image",
    media: "/images/posts/travel.jpg",
    content:
      "From waterfalls to cultural heritage sites, explore the best travel spots in Eastern Uganda.",
    category: "Travel",
    tags: ["tourism", "culture", "Eastern Uganda"],
    reads: 670,
    downloads: { pdf: 15, images: 20, videos: 10 },
    commentsCount: 3,
    createdAt: "2025-08-05T09:00:00Z",
  },
  {
    id: 4,
    authorId: 1,
    title: "How to Prepare the Perfect Rolex",
    type: "image",
    media: "/images/posts/rolex.jpg",
    content:
      "Step-by-step guide to making Uganda’s most beloved street food: the Rolex.",
    category: "Lifestyle",
    tags: ["food", "recipe", "Rolex"],
    reads: 1450,
    downloads: { pdf: 120, images: 100, videos: 80 },
    commentsCount: 10,
    createdAt: "2025-07-30T18:45:00Z",
  },
  {
    id: 5,
    authorId: 2,
    title: "Inside Uganda’s Renewable Energy Push",
    type: "video",
    media: "/videos/posts/renewable.mp4",
    content:
      "From solar farms to hydroelectric projects, Uganda is making strides in renewable energy.",
    category: "Environment",
    tags: ["renewable energy", "sustainability"],
    reads: 850,
    downloads: { pdf: 40, images: 30, videos: 20 },
    commentsCount: 4,
    createdAt: "2025-08-10T11:20:00Z",
  },
];

// 💬 COMMENTS
export const comments = [
  { id: 1, postId: 1, userId: 2, content: "This is great news for farmers!", createdAt: "2025-08-01T11:00:00Z" },
  { id: 2, postId: 1, userId: 3, content: "Coffee lovers like me are celebrating! ☕", createdAt: "2025-08-01T12:15:00Z" },
  { id: 3, postId: 2, userId: 1, content: "Tech growth is exactly what we need.", createdAt: "2025-07-25T15:20:00Z" },
  { id: 4, postId: 4, userId: 3, content: "I tried this recipe and it was amazing!", createdAt: "2025-07-31T09:45:00Z" },
  { id: 5, postId: 5, userId: 4, content: "Renewable energy is the future.", createdAt: "2025-08-10T13:50:00Z" },
];

// 💌 CHAT MESSAGES
export const chatMessages = [
  { id: 1, fromUserId: 1, toUserId: 2, content: "Hey Brian, did you see the new renewable energy report?", createdAt: "2025-08-12T08:30:00Z", isRead: true },
  { id: 2, fromUserId: 2, toUserId: 1, content: "Yes, it's really promising for Uganda’s future.", createdAt: "2025-08-12T08:35:00Z", isRead: true },
  { id: 3, fromUserId: 3, toUserId: 1, content: "Hi Alice, are you covering the coffee festival?", createdAt: "2025-08-13T07:20:00Z", isRead: false },
  { id: 4, fromUserId: 1, toUserId: 3, content: "Yes, I’ll be there tomorrow!", createdAt: "2025-08-13T07:25:00Z", isRead: false },
  { id: 5, fromUserId: 4, toUserId: 1, content: "Big match tonight, are you watching?", createdAt: "2025-08-12T21:10:00Z", isRead: true },
];


// dummyArticles.js

// src/services/dummyData.js
// src/services/dummyData.js
const articles = [
  {
    id: 1,
    title: "Exploring Uganda's Cultural Heritage",
    content:
      "A deep dive into Uganda’s traditions, from music and dance to ancient customs that still shape the nation today Smotrich announced the pending approval of 3,401 new housing units on Thursday in a press conference held on the site of the planned construction of a new neighborhood in the West Bank settlement of Efrat.",


    author: "Alice Kato",
    createdAt: "2025-08-14",
    mediaSrc: "/images/animal.jpg",
    mediaType: "image",
    category: "Culture",
    reads: 1240,
  },
  {
    id: 2,
    title: "The Rise of Tech Startups in East Africa",
    content:
      "Young entrepreneurs are transforming the region’s business landscape with bold ideas and cutting-edge technology.",
    author: "Brian Okello",
    createdAt: "2025-08-10",
    mediaSrc: "/animal.jpg",
    mediaType: "video",
    category: "Technology",
    reads: 980,
  },
  {
    id: 3,
    title: "Sustainable Tourism in Uganda",
    content:
      "Eco-friendly travel experiences that preserve nature while empowering local communities.",
    author: "Sarah Namukasa",
    createdAt: "2025-08-08",
    mediaSrc: "/images/animal.jpg",
    mediaType: "image",
    category: "Travel",
    reads: 670,
  },
  {
    id: 4,
    title: "Ugandan Cuisine: A Culinary Journey",
    content:
      "Discovering unique flavors, traditional recipes, and the cultural stories behind Uganda’s food.",
    author: "David Mugisha",
    createdAt: "2025-08-05",
    mediaSrc: "/images/animal.jpg",
    mediaType: "image",
    category: "Lifestyle",
    reads: 1450,
  },
  {
    id: 5,
    title: "Wildlife Conservation Efforts in Uganda",
    content:
      "Protecting endangered species and preserving biodiversity through community-based conservation projects.",
    author: "Alice Kato",
    createdAt: "2025-08-01",
       mediaSrc: "/images/animal.jpg",
    mediaType: "image",
    category: "Environment",
    reads: 850,
  },

    {
    id: 6,
    title: "Exploring Uganda's Cultural Heritage",
    content:
      "A deep dive into Uganda’s traditions, from music and dance to ancient customs that still shape the nation today.",
    author: "Alice Kato",
    createdAt: "2025-08-14",
    mediaSrc: "/images/animal.jpg",
    mediaType: "image",
    category: "Culture",
    reads: 1240,
  },
  {
    id: 7,
    title: "The Rise of Tech Startups in East Africa",
    content:
      "Young entrepreneurs are transforming the region’s business landscape with bold ideas and cutting-edge technology.",
    author: "Brian Okello",
    createdAt: "2025-08-10",
    mediaSrc: "/animal.jpg",
    mediaType: "video",
    category: "Technology",
    reads: 980,
  },
  {
    id: 8,
    title: "Sustainable Tourism in Uganda",
    content:
      "Eco-friendly travel experiences that preserve nature while empowering local communities.",
    author: "Sarah Namukasa",
    createdAt: "2025-08-08",
    mediaSrc: "/images/animal.jpg",
    mediaType: "image",
    category: "Travel",
    reads: 670,
  },
  {
    id: 9,
    title: "Uganda Cuisine: A Culinary Journey",
    content:
      "Discovering unique flavors, traditional recipes, and the cultural stories behind Uganda’s food.",
    author: "David Mugisha",
    createdAt: "2025-08-05",
      mediaSrc: "/images/animal.jpg",
    mediaType: "image",
    category: "Lifestyle",
    reads: 1450,
  },
  {
    id: 11,
    title: "Wildife Conservation Efforts in Uganda",
    content:
      "Protecting endangered species and preserving biodiversity through community-based conservation projects.",
    author: "Alice Kato",
    createdAt: "2025-08-01",
    mediaSrc: "/images/animal.jpg",
    mediaType: "image",
    category: "Environment",
    reads: 850,
  },
    {
    id: 12,
    title: "Sustainable Tourism in Uganda",
    content:
      "Eco-friendly travel experiences that preserve nature while empowering local communities.",
    author: "Sarah Namukasa",
    createdAt: "2025-08-08",
    mediaSrc: "/images/animal.jpg",
    mediaType: "image",
    category: "Travel",
    reads: 670,
  },
  {
    id: 13,
    title: "Uganda Cuisine: A Culinary Journey",
    content:
      "Discovering unique flavors, traditional recipes, and the cultural stories behind Uganda’s food.",
    author: "David Mugisha",
    createdAt: "2025-08-05",
      mediaSrc: "/images/animal.jpg",
    mediaType: "image",
    category: "Lifestyle",
    reads: 1450,
  },
  {
    id: 14,
    title: "Wildife Conservation Efforts in Uganda",
    content:
      "Protecting endangered species and preserving biodiversity through community-based conservation projects.",
    author: "Alice Kato",
    createdAt: "2025-08-01",
    mediaSrc: "/images/animal.jpg",
    mediaType: "image",
    category: "Environment",
    reads: 850,
  },
];



export { articles };


// Combine all into one object for default export
const dummyData = {
  users,
  categories,
  trendingTopics,
  breakingNews,
  posts,
  comments,
  chatMessages,
  articles
};

export default dummyData;