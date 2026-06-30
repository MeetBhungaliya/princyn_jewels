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
    href: "/",
  },
  {
    title: "Silver",
    href: "/",
  },
  {
    title: "Plantinum",
    href: "/",
  },
  {
    title: "Pearl",
    items: [
      {
        title: "Real Pearl",
        href: "/",
      },
      {
        title: "CVD Pearl",
        href: "/",
      },
      {
        title: "Mop Pearl",
        href: "/",
      },
    ],
  },
  {
    title: "Navratnas Stones",
    items: [
      {
        title: "The Moon",
        href: "/",
      },
      {
        title: "The Sun",
        href: "/",
      },
      {
        title: "Mars",
        href: "/",
      },
      {
        title: "Mercury",
        href: "/",
      },
      {
        title: "Jupiter",
        href: "/",
      },
      {
        title: "Venus",
        href: "/",
      },
      {
        title: "Saturn",
        href: "/",
      },
    ],
  },
  {
    title: "Diamond",
    items: [
      {
        title: "Real Diamond",
        href: "/",
      },
      {
        title: "CVD Diamond",
        href: "/",
      },
      {
        title: "Lab Grown Diamond",
        href: "/",
      },
      {
        title: "Mono Night Diamond",
        href: "/",
      },
      {
        title: "Tanza Diamond",
        href: "/",
      },
      {
        title: "ICE Crush Diamond",
        href: "/",
      },
      {
        title: "Swaroski Diamond",
        href: "/",
      },
      {
        title: "American Diamond",
        href: "/",
      },
      {
        title: "James Stone",
        href: "/",
      },
    ],
  },
];
