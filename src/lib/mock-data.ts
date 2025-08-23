export const mockReviews = [
  { id: 1, product: "Laptop Pro", user: "User A", date: "2024-07-20", text: "The battery life is amazing! Lasts all day without a problem." },
  { id: 2, product: "Laptop Pro", user: "User B", date: "2024-07-19", text: "It's a bit heavy for my taste, and the fan gets really loud under load." },
  { id: 3, product: "Wireless Mouse", user: "User C", date: "2024-07-18", text: "Connects instantly and the ergonomic design is very comfortable." },
  { id: 4, product: "Laptop Pro", user: "User D", date: "2024-07-17", text: "The screen is beautiful, but I've experienced a few software crashes." },
  { id: 5, product: "Keyboard XL", user: "User E", date: "2024-07-16", text: "The keyboard is okay, nothing special. The keys feel a bit mushy." },
  { id: 6, product: "Laptop Pro", user: "User F", date: "2024-07-15", text: "Customer support was fantastic when I had an issue with setup." },
  { id: 7, product: "Wireless Mouse", user: "User G", date: "2024-07-14", text: "The scroll wheel broke after just two weeks of use. Very disappointed." },
  { id: 8, product: "Keyboard XL", user: "User H", date: "2024-07-13", text: "I love the backlighting on this keyboard! It's perfect for late-night work." },
  { id: 9, product: "Laptop Pro", user: "User I", date: "2024-07-12", text: "For the price, this is a solid laptop. Good performance for everyday tasks." },
  { id: 10, product: "Wireless Mouse", user: "User J", date: "2024-07-11", text: "The connection drops occasionally, which is frustrating during gaming." },
];

export const mockReviewText = mockReviews.map(r => `Review for ${r.product} by ${r.user}: ${r.text}`).join('\n\n');
