export interface NavItem {
  title: string;
  href?: string;
  items?: {
    title: string;
    href: string;
    description?: string;
  }[];
}

export const navigation: NavItem[] = [
  {
    title: "Gold",
    items: [
      { title: "Yellow", href: "/" },
      { title: "Rose", href: "/" },
      { title: "White", href: "/" },
    ],
  },
  {
    title: "Silver",
  },
  {
    title: "Platinum",
  },
  {
    title: "Diamond",
    items: [
      { title: "Natural Diamond", href: "/" },
      { title: "CVD", href: "/" },
      { title: "Moissainite", href: "/" },
      { title: "Tanzanite", href: "/" },
      { title: "Icecrush", href: "/" },
      { title: "Swarovski", href: "/" },
      { title: "American", href: "/" },
      { title: "Gems Stone", href: "/" },
    ],
  },
  {
    title: "Pearls",
    items: [
      { title: "Natural Pearls", href: "/" },
      { title: "CVD", href: "/" },
      { title: "MOP", href: "/" },
    ],
  },
  {
    title: "Navratna Stones",
    items: [
      { title: "The Sun", href: "/" },
      { title: "The Moon", href: "/" },
      { title: "Mars", href: "/" },
      { title: "Mercury", href: "/" },
      { title: "Jupiter", href: "/" },
      { title: "Venus", href: "/" },
      { title: "Saturn", href: "/" },
    ],
  },
];
