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
      { title: "Rings", href: "/" },
      { title: "Necklaces", href: "/" },
      { title: "Bangles", href: "/" },
      { title: "Chains", href: "/" },
    ],
  },
  {
    title: "Silver",
    items: [
      { title: "Rings", href: "/" },
      { title: "Necklaces", href: "/" },
      { title: "Anklets", href: "/" },
      { title: "Payal", href: "/" },
    ],
  },
  {
    title: "Platinum",
    items: [
      { title: "Rings", href: "/" },
      { title: "Bracelets", href: "/" },
      { title: "Pendants", href: "/" },
    ],
  },
  {
    title: "Pearls",
    items: [
      { title: "Real Pearl", href: "/" },
      { title: "CVD Pearl", href: "/" },
      { title: "Mop Pearl", href: "/" },
    ],
  },
  {
    title: "Navratna Stones",
    items: [
      { title: "The Moon", href: "/" },
      { title: "The Sun", href: "/" },
      { title: "Mars", href: "/" },
      { title: "Mercury", href: "/" },
      { title: "Jupiter", href: "/" },
      { title: "Venus", href: "/" },
      { title: "Saturn", href: "/" },
    ],
  },
  {
    title: "Collections",
    items: [
      { title: "Rings", href: "/" },
      { title: "Bracelets", href: "/" },
      { title: "Necklaces", href: "/" },
      { title: "Earrings", href: "/" },
    ],
  },
  {
    title: "Diamond",
    items: [
      { title: "Real Diamond", href: "/" },
      { title: "CVD Diamond", href: "/" },
      { title: "Lab Grown Diamond", href: "/" },
      { title: "Swaroski Diamond", href: "/" },
      { title: "American Diamond", href: "/" },
    ],
  },
];
