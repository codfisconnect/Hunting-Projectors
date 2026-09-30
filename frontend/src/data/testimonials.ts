export interface Testimonial {
  id: string;
  name: string;
  location: string;
  verifiedBuyer: boolean;
  projectorModel: string;
  rating: number;
  reviewTitle: string;
  comment: string;
  date: string;
  environment: 'Dedicated Theater' | 'Living Room' | 'Console Gaming' | 'Bedroom Setup';
  isDemoReview?: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Karthik Ramanathan',
    location: 'Chennai, Tamil Nadu',
    verifiedBuyer: true,
    projectorModel: 'Hunting Vision X1 4K',
    rating: 5,
    reviewTitle: 'Astonishing 4K optical sharpness — replaced our 75" TV',
    comment: 'Visited the Chennai showroom to witness the demo before purchasing. The optical focus and deep black levels on a 120-inch ALR screen are unbelievable. The direct support from NAP Computers gave complete peace of mind.',
    date: 'Demo Review • Verified Purchaser',
    environment: 'Living Room',
    isDemoReview: true,
  },
  {
    id: 'test-2',
    name: 'Arjun Mehta',
    location: 'Bengaluru, Karnataka',
    verifiedBuyer: true,
    projectorModel: 'Hunting Cinema X4 Laser',
    rating: 5,
    reviewTitle: 'ALPD laser brightness cuts straight through daylight',
    comment: 'The 3,500 ANSI output genuinely holds up even during afternoon football matches with partial curtains. The fan noise is virtually inaudible. A true reference-grade cinema investment.',
    date: 'Demo Review • Verified Purchaser',
    environment: 'Dedicated Theater',
    isDemoReview: true,
  },
  {
    id: 'test-3',
    name: 'Siddharth V.',
    location: 'Hyderabad, Telangana',
    verifiedBuyer: true,
    projectorModel: 'Hunting Ultra Pro UST',
    rating: 5,
    reviewTitle: 'Incredible 150 inches from inches off the wall',
    comment: 'No messy ceiling mounts or trailing cables across our living room. It sits directly on our low TV credenza and turns our entire feature wall into an IMAX experience. The built-in Dolby soundbar is surprisingly punchy.',
    date: 'Demo Review • Verified Purchaser',
    environment: 'Living Room',
    isDemoReview: true,
  },
  {
    id: 'test-4',
    name: 'Vikram Menon',
    location: 'Kochi, Kerala',
    verifiedBuyer: true,
    projectorModel: 'Hunting Horizon Max',
    rating: 5,
    reviewTitle: '240Hz console gaming on 130 inches is mind-blowing',
    comment: 'Zero perceptible input lag when playing PS5 racing and first-person shooters. Brightness and high refresh rate feel as responsive as my esports gaming monitor, only 10 times larger.',
    date: 'Demo Review • Verified Purchaser',
    environment: 'Console Gaming',
    isDemoReview: true,
  },
  {
    id: 'test-5',
    name: 'Ananya Sharma',
    location: 'Mumbai, Maharashtra',
    verifiedBuyer: true,
    projectorModel: 'Hunting Neo Air',
    rating: 5,
    reviewTitle: 'Perfect for weekend terrace screenings and bedroom ceiling movies',
    comment: 'Being able to swivel the lens straight up to the ceiling is fantastic. Autofocus is instant, and powering it via USB-C battery pack makes outdoor terrace movie nights with friends effortless.',
    date: 'Demo Review • Verified Purchaser',
    environment: 'Bedroom Setup',
    isDemoReview: true,
  },
];
