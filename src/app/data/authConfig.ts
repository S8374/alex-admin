export interface AuthSlide {
  image: string;
  alt: string;
  quote: string;
}

export const AUTH_SLIDES = {
  login: {
    image: "/admin-login-office.png",
    alt: "Admin Dashboard",
    quote: "Management is the efficiency in climbing the ladder of success.",
  },
  signup: {
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
    alt: "Collaboration",
    quote: "Great things in business are never done by one person.",
  },
};
