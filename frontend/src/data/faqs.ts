export interface FAQItem {
  id: string;
  category: 'general' | 'selection' | 'technical' | 'delivery' | 'support';
  categoryLabel: string;
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    categoryLabel: 'General & Brand',
    question: 'What is Hunting Projectors, and who operates the brand?',
    answer: 'Hunting is a premium projection brand engineered for cinema enthusiasts, creators, and modern homes. The brand is supplied, owned, and operated by NAP Computers & Electronics, established in Chennai, Tamil Nadu, India. Customers deal directly with the brand entity for genuine products, direct warranty, and technical service without intermediary markups.',
  },
  {
    id: 'faq-2',
    category: 'general',
    categoryLabel: 'General & Brand',
    question: 'How is a dedicated projector better than a large television?',
    answer: 'A premium Hunting projector delivers genuine cinematic scale from 80 inches up to 200–300 inches at a fraction of the cost and weight of an equivalent 98" or 115" flat-panel television. Reflected light from a projection screen is also significantly more comfortable for your eyes during extended movie marathons compared to direct backlit LED screens.',
  },
  {
    id: 'faq-3',
    category: 'selection',
    categoryLabel: 'Choosing a Projector',
    question: 'How do I choose the right Hunting projector for my room?',
    answer: 'Consider three key criteria: room light levels, throw distance, and your primary use. For dedicated darkened rooms, the Hunting Vision X1 or Cinema X4 delivers maximum contrast. For living rooms with no space for a ceiling mount, the Hunting Ultra Pro Ultra Short Throw sits right next to the wall. For portable movie nights, choose the Neo Air. You can also use our interactive Projector Finder tool for personalized guidance.',
  },
  {
    id: 'faq-4',
    category: 'selection',
    categoryLabel: 'Choosing a Projector',
    question: 'Which projector is best suited for competitive gaming?',
    answer: 'The Hunting Horizon Max is specifically engineered for high-refresh gaming, offering up to 240Hz refresh rate at 1080p and 4.2ms ultra-low input lag, along with full 4K HDR console support for PlayStation 5 and Xbox Series X.',
  },
  {
    id: 'faq-5',
    category: 'technical',
    categoryLabel: 'Technical & Installation',
    question: 'What room size and throw distance do I need?',
    answer: 'With a standard 1.2:1 throw ratio (such as on the Vision X1), you need approximately 2.6 meters to cast a 100-inch screen, or 3.2 meters for 120 inches. If your room is compact or you prefer zero ceiling mounts, our Ultra Short Throw (UST) models project a massive 100" to 150" canvas from only 20–30 cm away from the wall.',
  },
  {
    id: 'faq-6',
    category: 'technical',
    categoryLabel: 'Technical & Installation',
    question: 'Do I need a special projection screen, or can I project on a white wall?',
    answer: 'All Hunting projectors can project directly onto a smooth, flat white or neutral matte wall. However, pairing your projector with an Ambient Light Rejecting (ALR) or high-contrast fixed frame screen dramatically improves black levels and contrast, particularly in living rooms with daylight.',
  },
  {
    id: 'faq-7',
    category: 'delivery',
    categoryLabel: 'Pan-India Delivery',
    question: 'How does delivery work across India?',
    answer: 'We provide pan-India insured door-to-door express shipping to all serviceable pin codes across India. Every unit is dispatched in reinforced shock-proof protective flight cases. Full tracking updates are provided via WhatsApp and SMS upon shipment dispatch from our Chennai facility.',
  },
  {
    id: 'faq-8',
    category: 'support',
    categoryLabel: 'Warranty & Support',
    question: 'What warranty and after-sales support is provided?',
    answer: 'All Hunting projectors come backed by official direct brand warranty from NAP Computers & Electronics. Technical guidance, installation consultations, and repair servicing are handled directly by our dedicated product specialists in Chennai. Extended warranty options and spare support are available.',
  },
  {
    id: 'faq-9',
    category: 'support',
    categoryLabel: 'Warranty & Support',
    question: 'Can I experience a live demo before placing an order?',
    answer: 'Yes! Customers in Chennai are welcome to visit our showcase studio for a live side-by-side demonstration. For customers across India, we arrange 1-on-1 personalized video consultations over WhatsApp to walk you through image quality, fan sound, and interface responsiveness.',
  },
];
