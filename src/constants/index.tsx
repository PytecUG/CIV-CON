import {
  FaComments,
  FaUser,
  FaBullhorn,
  FaHeadphones,
  FaUsersCog,
  FaPen,
} from "react-icons/fa";

import {
  Home,
  MessageSquare,
  Hash,
  User as LucideUser,
  Settings,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";

export const features = [
  {
    id: "0",
    icon: "/images/feature-1.png",
    caption: "Citizen Engagement",
    title: "Connect directly with leaders",
    text: "CIV-CON allows Ugandans to engage directly with political leaders, journalists, and community members. Share your thoughts, participate in discussions, and make your voice heard.",
    button: {
      icon: "/images/magictouch.svg",
      title: "Watch the demo",
    },
  },
  {
    id: "1",
    icon: "/images/feature-2.png",
    caption: "News & Articles",
    title: "Stay informed, stay empowered",
    text: "Access the latest news, reports, and articles from trusted journalists. CIV-CON keeps you updated on important civic topics and government initiatives.",
    button: {
      icon: "/images/docs.svg",
      title: "Read the docs",
    },
  },
];

export const details = [
  { id: "0", icon: FaComments, title: "Engage in Public Discussions" },
  { id: "1", icon: FaUser, title: "Connect with Fellow Citizens" },
  { id: "2", icon: FaBullhorn, title: "Share Opinions with Leaders" },
  { id: "3", icon: FaHeadphones, title: "Access News & Updates" },
];

export const plans = [
  {
    id: "0",
    title: "Citizen",
    priceMonthly: 0,
    priceYearly: 0,
    caption: "Free access for all Ugandans",
    features: [
      "Read and comment on articles",
      "Join public discussions",
      "Follow leaders & journalists",
      "Basic community profile",
    ],
    icon: FaUsersCog,
    logo: null,
  },
  {
    id: "1",
    title: "Journalist",
    priceMonthly: 25,
    priceYearly: 19,
    caption: "For journalists & media outlets",
    features: [
      "Publish unlimited articles",
      "Access engagement analytics",
      "Verified journalist badge",
      "Priority support",
    ],
    icon: FaPen,
    logo: null,
  },
  {
    id: "2",
    title: "Leader",
    priceMonthly: 49,
    priceYearly: 39,
    caption: "For government & community leaders",
    features: [
      "Post civic discussion topics",
      "Engage with citizens directly",
      "Analytics & sentiment insights",
      "Verified leader badge",
    ],
    icon: FaUser,
    logo: null,
  },
];

export const testimonials = [
  {
    id: "0",
    name: "Sarah Namatovu",
    role: "Citizen, Kampala",
    avatarUrl: "/images/testimonials/sarah-namatovu.png",
    comment:
      "Civ-Con gives me a voice in discussions that matter. I can follow leaders, share my opinions, and stay informed.",
  },
  {
    id: "1",
    name: "James Okello",
    role: "Journalist, Daily Monitor",
    avatarUrl: "/images/testimonials/james-okello.png",
    comment:
      "Publishing articles on Civ-Con has expanded my reach. Citizens interact directly with my work in real time.",
  },
  {
    id: "2",
    name: "Hon. Grace Atwine",
    role: "Community Leader, Gulu",
    avatarUrl: "/images/testimonials/grace-atwine.png",
    comment:
      "This platform bridges the gap between leaders and citizens. I use it to start conversations and gather feedback.",
  },
  {
    id: "3",
    name: "Daniel Ssemanda",
    role: "Citizen, Mbarara",
    avatarUrl: "/images/testimonials/daniel-ssemanda.png",
    comment:
      "I joined to follow debates on local governance. Now I feel more connected to issues affecting my community.",
  },
  {
    id: "4",
    name: "Ruth Nabirye",
    role: "Journalist, UBC",
    avatarUrl: "/images/testimonials/ruth-nabirye.png",
    comment:
      "The verified journalist badge helps me build trust with readers. It's a game-changer for credible reporting online.",
  },
  {
    id: "5",
    name: "Mayor Robert Mugisha",
    role: "Municipal Leader, Jinja",
    avatarUrl: "/images/testimonials/robert-mugisha.png",
    comment:
      "Through Civ-Con, I engage directly with citizens’ concerns. It makes governance more transparent and participatory.",
  },
];

export const sidebarItems = [
  {
    title: "Feed",
    icon: Home,
    href: "/feed",
  },
  {
    title: "Topics",
    icon: Hash,
    href: "/topics",
  },
  {
    title: "Articles",
    icon: FileText,
    href: "/articles",
  },
  {
    title: "Hot Topics",
    icon: TrendingUp,
    href: "/explore",
  },
  {
    title: "Community Groups",
    icon: Users,
    href: "/groups",
  },
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/messages",
  },
  {
    title: "Profile",
    icon: LucideUser,
    href: "/profile",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];
