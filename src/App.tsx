import React, { useState, useEffect, useRef } from 'react';

type Currency = 'NGN' | 'USD';

interface Product {
  id: string;
  series: string;
  category: string;
  name: string;
  priceNGN: number;
  priceUSD: number;
  finishOptions: string[];
  dimensions: string;
  kelvin: string;
  voltageSpec: string;
  leadTime: string;
  image: string;
  fallbackImage: string;
  description: string;
  edition?: string;
}

interface CartItem {
  product: Product;
  finish: string;
  quantity: number;
}

const DECK_COLLECTIONS = [
  {
    index: 0,
    series: 'Series 01',
    title: 'Statement Chandeliers',
    category: 'Statement Chandeliers',
    image:
      'https://images.unsplash.com/photo-1585261450736-67d578ff00b4?ixid=M3w4NjU0NDF8MHwxfHNlYXJjaHwxfHxNb2Rlcm4lMjBhcmNoaXRlY3R1cmFsJTIwcGVuZGFudCUyMGxpZ2h0JTIwaGFuZ2luZyUyMGluJTIwa2l0Y2hlbnxlbnwwfDB8fHwxNzc0MDEyNDI3fDA&ixlib=rb-4.1.0&w=600&h=800&fit=crop&fm=jpg&q=80',
    fallback:
      'https://images.pexels.com/photos/7519888/pexels-photo-7519888.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    index: 1,
    series: 'Series 02',
    title: 'Sculptural Floor Lamps',
    category: 'Sculptural Floor Lamps',
    image:
      'https://images.unsplash.com/photo-1659100171587-a8a5e9d9417a?ixid=M3w4NjU0NDF8MHwxfHNlYXJjaHwxfHxUYWxsJTIwYXJjaGl0ZWN0dXJhbCUyMGJyYXNzJTIwZmxvb3IlMjBsYW1wfGVufDB8MXx8fDE3NzQ0MzE3MTh8MA&ixlib=rb-4.1.0&w=600&h=800&fit=crop&fm=jpg&q=80',
    fallback:
      'https://images.pexels.com/photos/6580404/pexels-photo-6580404.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    index: 2,
    series: 'Series 03',
    title: 'Dining Pendants',
    category: 'Dining Pendants',
    image:
      'https://images.unsplash.com/photo-1763525398198-d154a309f356?ixid=M3w4NjU0NDF8MHwxfHNlYXJjaHwxfHxIYW5kLWJsb3duJTIwZ2xhc3MlMjBwZW5kYW50JTIwbGlnaHQlMjBmaXh0dXJlfGVufDB8MXx8fDE3NzQ0MzE3MTh8MA&ixlib=rb-4.1.0&w=600&h=800&fit=crop&fm=jpg&q=80',
    fallback:
      'https://images.pexels.com/photos/7519888/pexels-photo-7519888.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    index: 3,
    series: 'Series 04',
    title: 'Wall Sconces',
    category: 'Wall Sconces',
    image:
      'https://images.unsplash.com/photo-1770277375251-d394346bd4cf?ixid=M3w4NjU0NDF8MHwxfHNlYXJjaHwxfHxNaW5pbWFsaXN0JTIwYnJhc3MlMjB3YWxsJTIwc2NvbmNlJTIwbGlnaHRpbmd8ZW58MHwxfHx8MTc3NDQzMTcxOHww&ixlib=rb-4.1.0&w=600&h=800&fit=crop&fm=jpg&q=80',
    fallback:
      'https://images.pexels.com/photos/7439756/pexels-photo-7439756.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    index: 4,
    series: 'Series 05',
    title: 'Bespoke Commissions',
    category: 'Bespoke Commissions',
    image:
      'https://images.unsplash.com/photo-1692856135967-89f9b37aa8ba?ixid=M3w4NjU0NDF8MHwxfHNlYXJjaHwxfHxMdXh1cnklMjBsaW1pdGVkJTIwZWRpdGlvbiUyMHNjdWxwdHVyYWwlMjBsYW1wfGVufDB8MXx8fDE3NzQ0MzE3MTh8MA&ixlib=rb-4.1.0&w=600&h=800&fit=crop&fm=jpg&q=80',
    fallback:
      'https://images.pexels.com/photos/2762957/pexels-photo-2762957.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

const CAROUSEL_SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1675608691851-6493dbbc111e?ixid=M3w4NjU0NDF8MHwxfHNlYXJjaHwxfHxNaW5pbWFsaXN0JTIwYnJhc3MlMjBmbG9vciUyMGxhbXAlMjBpbiUyMG1vb2R5JTIwbGl2aW5nJTIwcm9vbXxlbnwwfDB8fHwxNzc0MDEyNDI3fDA&ixlib=rb-4.1.0&w=800&h=600&fit=crop&fm=jpg&q=80',
    fallback:
      'https://images.pexels.com/photos/6580404/pexels-photo-6580404.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Eko Solstice Floor Lamp in Ikoyi penthouse',
    productId: 'eko-solstice-floor',
  },
  {
    src: 'https://images.unsplash.com/photo-1765371512501-d25a6af94c91?ixid=M3w4NjU0NDF8MHwxfHNlYXJjaHwxfHxEZXNpZ25lciUyMHRhYmxlJTIwbGFtcCUyMG9uJTIwd29vZGVuJTIwZGVzayUyMHdpdGglMjBzb2Z0JTIwd2FybSUyMGxpZ2h0fGVufDB8MHx8fDE3NzQwMTI0Mjd8MA&ixlib=rb-4.1.0&w=800&h=600&fit=crop&fm=jpg&q=80',
    fallback:
      'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Idia Bronze & Iroko Table Lamp',
    productId: 'idia-table-lamp',
  },
  {
    src: 'https://images.unsplash.com/photo-1585261450736-67d578ff00b4?ixid=M3w4NjU0NDF8MHwxfHNlYXJjaHwxfHxNb2Rlcm4lMjBhcmNoaXRlY3R1cmFsJTIwcGVuZGFudCUyMGxpZ2h0JTIwaGFuZ2luZyUyMGluJTIwa2l0Y2hlbnxlbnwwfDB8fHwxNzc0MDEyNDI3fDA&ixlib=rb-4.1.0&w=800&h=600&fit=crop&fm=jpg&q=80',
    fallback:
      'https://images.pexels.com/photos/7519888/pexels-photo-7519888.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Ikoyi Void Cascade Chandelier',
    productId: 'ikoyi-void-chandelier',
  },
  {
    src: 'https://images.unsplash.com/photo-1566890463705-46b4fefa8a53?ixid=M3w4NjU0NDF8MHwxfHNlYXJjaHwxfHxTbGVlayUyMGFyY2hpdGVjdHVyYWwlMjBsaWdodGluZyUyMGluJTIwY29udGVtcG9yYXJ5JTIwaGFsbHdheXxlbnwwfDB8fHwxNzc0MDEyNDI3fDA&ixlib=rb-4.1.0&w=800&h=600&fit=crop&fm=jpg&q=80',
    fallback:
      'https://images.pexels.com/photos/7439756/pexels-photo-7439756.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Maitama Linear Wall Sconce',
    productId: 'maitama-wall-sconce',
  },
  {
    src: 'https://images.unsplash.com/photo-1758448755969-8791367cf5c5?ixid=M3w4NjU0NDF8MHwxfHNlYXJjaHwxfHxXYXJtJTIwbGlnaHRpbmclMjBhdG1vc3BoZXJlJTIwaW4lMjBsdXh1cnklMjBiZWRyb29tJTIwc3VpdGV8ZW58MHwwfHx8MTc3NDAxMjQyN3ww&ixlib=rb-4.1.0&w=800&h=600&fit=crop&fm=jpg&q=80',
    fallback:
      'https://images.pexels.com/photos/2762957/pexels-photo-2762957.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Bourdillon Monolith in Banana Island master suite',
    productId: 'bourdillon-monolith',
  },
];

const PRODUCTS: Product[] = [
  {
    id: 'eko-solstice-floor',
    series: 'Series 02',
    category: 'Sculptural Floor Lamps',
    name: 'The Eko Solstice Floor Lamp',
    priceNGN: 2850000,
    priceUSD: 1850,
    finishOptions: ['Burnished Benin Bronze', 'Matte Obsidian Black', 'Kiln-Dried Nigerian Iroko'],
    dimensions: 'H 168cm × Ø 36cm',
    kelvin: '2400K – 2700K Warm Dim',
    voltageSpec: '160V–260V Surge-Protected & Inverter Safe',
    leadTime: 'In Stock in Victoria Island — 48hr Delivery',
    edition: 'Limited Commission of 50',
    image:
      'https://images.unsplash.com/photo-1659100171587-a8a5e9d9417a?ixid=M3w4NjU0NDF8MHwxfHNlYXJjaHwxfHxUYWxsJTIwYXJjaGl0ZWN0dXJhbCUyMGJyYXNzJTIwZmxvb3IlMjBsYW1wfGVufDB8MXx8fDE3NzQ0MzE3MTh8MA&ixlib=rb-4.1.0&w=600&h=800&fit=crop&fm=jpg&q=80',
    fallbackImage:
      'https://images.pexels.com/photos/6580404/pexels-photo-6580404.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Hand-spun heavy-gauge bronze stem anchored in turned Nigerian Iroko hardwood. Engineered with zero-flicker drivers for seamless generator and solar-inverter transitions.',
  },
  {
    id: 'ikoyi-void-chandelier',
    series: 'Series 01',
    category: 'Statement Chandeliers',
    name: 'Ikoyi Void Cascade Chandelier',
    priceNGN: 6400000,
    priceUSD: 4150,
    finishOptions: ['Sand-Cast Brass & Fluted Glass', 'Aged Benin Bronze & Amber Glass'],
    dimensions: 'Drop 240cm–550cm × Ø 110cm',
    kelvin: '2700K High-CRI Architectural Glow',
    voltageSpec: '160V–260V Dual-Stage Surge Guard',
    leadTime: 'White-Glove Duplex Rigging — 2 Weeks',
    edition: 'Duplex Void Signature',
    image:
      'https://images.unsplash.com/photo-1585261450736-67d578ff00b4?ixid=M3w4NjU0NDF8MHwxfHNlYXJjaHwxfHxNb2Rlcm4lMjBhcmNoaXRlY3R1cmFsJTIwcGVuZGFudCUyMGxpZ2h0JTIwaGFuZ2luZyUyMGluJTIwa2l0Y2hlbnxlbnwwfDB8fHwxNzc0MDEyNDI3fDA&ixlib=rb-4.1.0&w=600&h=800&fit=crop&fm=jpg&q=80',
    fallbackImage:
      'https://images.pexels.com/photos/7519888/pexels-photo-7519888.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Purpose-built for double-height living salons and staircase voids in Ikoyi, Banana Island, and Maitama. Features tiered hand-cast brass arms and mouth-blown glass cylinders.',
  },
  {
    id: 'zuma-pendant',
    series: 'Series 03',
    category: 'Dining Pendants',
    name: 'Zuma Crystalline Island Pendant',
    priceNGN: 1950000,
    priceUSD: 1280,
    finishOptions: ['Warm Harmattan Amber Glass', 'Clear Fluted Glass & Unlacquered Brass'],
    dimensions: 'H 42cm × Ø 48cm (Adjustable Drop)',
    kelvin: '2600K Warm Dining Spectrum',
    voltageSpec: '160V–260V Surge-Protected & Inverter Safe',
    leadTime: 'In Stock in Lagos & Abuja — 2–3 Days',
    image:
      'https://images.unsplash.com/photo-1763525398198-d154a309f356?ixid=M3w4NjU0NDF8MHwxfHNlYXJjaHwxfHxIYW5kLWJsb3duJTIwZ2xhc3MlMjBwZW5kYW50JTIwbGlnaHQlMjBmaXh0dXJlfGVufDB8MXx8fDE3NzQ0MzE3MTh8MA&ixlib=rb-4.1.0&w=600&h=800&fit=crop&fm=jpg&q=80',
    fallbackImage:
      'https://images.pexels.com/photos/7519888/pexels-photo-7519888.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Inspired by the monolithic contours of Zuma Rock. Organic ripples in the thick hand-blown shade diffuse a rich golden wash across 10-seater marble and timber dining tables.',
  },
  {
    id: 'maitama-wall-sconce',
    series: 'Series 04',
    category: 'Wall Sconces',
    name: 'Maitama Fluted Bronze Sconce',
    priceNGN: 1150000,
    priceUSD: 740,
    finishOptions: ['Coastal-Sealed Brushed Brass', 'Patina Darkened Benin Bronze'],
    dimensions: 'H 56cm × W 13cm × D 14cm',
    kelvin: '2700K CRI 97+ Linear Wash',
    voltageSpec: '160V–260V Surge Guard · IP44 Humidity Rated',
    leadTime: 'In Stock — Ships Nationwide in 48hrs',
    image:
      'https://images.unsplash.com/photo-1770277375251-d394346bd4cf?ixid=M3w4NjU0NDF8MHwxfHNlYXJjaHwxfHxNaW5pbWFsaXN0JTIwYnJhc3MlMjB3YWxsJTIwc2NvbmNlJTIwbGlnaHRpbmd8ZW58MHwxfHx8MTc3NDQzMTcxOHww&ixlib=rb-4.1.0&w=600&h=800&fit=crop&fm=jpg&q=80',
    fallbackImage:
      'https://images.pexels.com/photos/7439756/pexels-photo-7439756.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Precision-milled fluted bronze cylinder engineered to graze textured plaster, travertine, and timber cladding. Treated with a marine-grade seal against coastal Lagos humidity.',
  },
  {
    id: 'bourdillon-monolith',
    series: 'Series 05',
    category: 'Bespoke Commissions',
    name: 'Bourdillon Monolith No. 04',
    priceNGN: 4500000,
    priceUSD: 2950,
    finishOptions: ['Sand-Cast Benin Bronze & Scorched Iroko', 'Brushed Brass & Raw Nigerian Granite'],
    dimensions: 'H 72cm × W 34cm × D 24cm',
    kelvin: '2200K Candlelight Sanctuary Spectrum',
    voltageSpec: '160V–260V Isolated Transformer Driver',
    leadTime: 'Atelier Commission — 3–4 Weeks',
    edition: 'Numbered Edition of 25',
    image:
      'https://images.unsplash.com/photo-1692856135967-89f9b37aa8ba?ixid=M3w4NjU0NDF8MHwxfHNlYXJjaHwxfHxMdXh1cnklMjBsaW1pdGVkJTIwZWRpdGlvbiUyMHNjdWxwdHVyYWwlMjBsYW1wfGVufDB8MXx8fDE3NzQ0MzE3MTh8MA&ixlib=rb-4.1.0&w=600&h=800&fit=crop&fm=jpg&q=80',
    fallbackImage:
      'https://images.pexels.com/photos/2762957/pexels-photo-2762957.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Signed and numbered architectural sculpture cast in lost-wax bronze molds and paired with charred Nigerian Iroko. Designed as an heirloom statement piece for private studies and foyers.',
  },
  {
    id: 'idia-table-lamp',
    series: 'Series 05',
    category: 'Bespoke Commissions',
    name: 'Idia Carved Stone & Bronze Lamp',
    priceNGN: 1650000,
    priceUSD: 1080,
    finishOptions: ['Unlacquered Brass & Travertine', 'Antiqued Bronze & Smoked Mahogany'],
    dimensions: 'H 46cm × Ø 28cm',
    kelvin: '2700K Stepless Rotary Dimming',
    voltageSpec: '160V–260V Surge-Protected & Inverter Safe',
    leadTime: 'In Stock in Victoria Island — 48hr Delivery',
    image:
      'https://images.unsplash.com/photo-1770646403987-64cf5c08c870?ixid=M3w4NjU0NDF8MHwxfHNlYXJjaHwxfHxEZXNpZ25lciUyMG1pbmltYWxpc3QlMjB0YWJsZSUyMGxhbXAlMjBvbiUyMG1hcmJsZSUyMGJhc2V8ZW58MHwxfHx8MTc3NDQzMTcxOHww&ixlib=rb-4.1.0&w=600&h=800&fit=crop&fm=jpg&q=80',
    fallbackImage:
      'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'A tribute to classic West African proportion. Hand-turned natural stone base crowned with a spun bronze reflector dome that casts a warm, glare-free pool of light.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Are Lumina fixtures protected against voltage fluctuations and power switchovers?',
    answer:
      'Yes. Every Lumina luminaire is engineered specifically for Nigerian power realities. We integrate wide-voltage (160V–260V) surge-protected drivers and zero-flicker capacitors, ensuring your lights remain completely steady during EKEDC/AEDC grid spikes, generator changeovers, and solar-inverter transitions.',
  },
  {
    question: 'Do you handle installation for double-height duplex ceilings in Lagos and Abuja?',
    answer:
      'Absolutely. Our in-house White-Glove Engineering Team handles full scaffolding, structural ceiling reinforcement, and precision rigging for double- and triple-height voids across Ikoyi, Victoria Island, Banana Island, Lekki, Maitama, and Asokoro.',
  },
  {
    question: 'How do your bronze and hardwood finishes hold up in coastal Lagos humidity?',
    answer:
      'Unlike imported mass-market fixtures that pit or peel within a year near the Atlantic coast, we use solid heavy-gauge architectural brass and Benin-inspired bronze treated with micro-crystalline wax, paired with 100% kiln-dried Nigerian Iroko and Mahogany that will never warp in tropical humidity.',
  },
  {
    question: 'What is the lead time for in-stock pieces versus bespoke estate commissions?',
    answer:
      'In-stock pieces at our Victoria Island and Maitama showrooms are delivered and installed within 48 to 72 hours. For custom chandelier configurations and numbered bronze commissions, please allow 3 to 4 weeks from our Lagos foundry.',
  },
  {
    question: 'Do you partner with Nigerian architects, interior designers, and luxury developers?',
    answer:
      'Yes. Members of the Lumina Trade & Developer Program receive trade pricing, custom CAD/BIM and IES photometric packages, on-site lighting consultations, and dedicated project engineers for residential estates and boutique hospitality projects.',
  },
];

const ATELIERS_INFO: Record<string, { city: string; address: string; hours: string; phone: string }> = {
  'Lagos HQ': {
    city: 'Victoria Island Flagship & Foundry Showroom',
    address: '14B Adeola Odeku Street, Victoria Island, Lagos',
    hours: 'Mon – Sat · 09:30 – 19:00 · Private Evening Viewings Available',
    phone: '+234 906 000 4421',
  },
  Abuja: {
    city: 'Maitama Architectural Galerie',
    address: '28 Gana Street, Maitama, Abuja FCT',
    hours: 'Mon – Sat · 10:00 – 18:30',
    phone: '+234 809 882 1900',
  },
  London: {
    city: 'London Mayfair — Diaspora & Export Desk',
    address: '42 Mount Street, Mayfair, London W1K 2TH',
    hours: 'Tue – Sat · 10:00 – 18:00 (By Appointment)',
    phone: '+44 20 7946 0192',
  },
};

function formatPrice(product: Product, currency: Currency, quantity = 1) {
  if (currency === 'NGN') {
    return `₦${(product.priceNGN * quantity).toLocaleString()}`;
  }
  return `$${(product.priceUSD * quantity).toLocaleString()}`;
}

function SafeImage({
  src,
  fallbackSrc,
  alt,
  className,
}: {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [failedAll, setFailedAll] = useState(false);

  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else {
      setFailedAll(true);
    }
  };

  if (failedAll) {
    return (
      <div
        className={`bg-gradient-to-br from-[#1e1c1a] via-[#121212] to-[#2c251d] flex flex-col items-center justify-center p-6 text-center ${
          className || ''
        }`}
      >
        <i className="ph ph-lamp text-4xl text-brand-accent mb-2"></i>
        <span className="font-primary text-xs tracking-widest uppercase text-white/70">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={handleError}
      className={className}
    />
  );
}

function AnimatedWords({
  text,
  className,
  as: Tag = 'span',
}: {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [text]);

  const tokens = text.split(/(\s+)/);

  return (
    <Tag ref={ref as any} className={className}>
      {tokens.map((token, idx) => {
        if (token.trim() === '') {
          return <React.Fragment key={idx}>{token}</React.Fragment>;
        }
        return (
          <span
            key={idx}
            className={`word-reveal ${visible ? 'visible' : ''}`}
            style={{ transitionDelay: `${idx * 0.03}s` }}
          >
            {token}
          </span>
        );
      })}
    </Tag>
  );
}

export default function App() {
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const [deckSpread, setDeckSpread] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showShowroomGrid, setShowShowroomGrid] = useState<boolean>(false);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedAtelier, setSelectedAtelier] = useState<string>('Lagos HQ');

  // Interactive Modals & Drawers
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [selectedFinish, setSelectedFinish] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUCTS[0],
      finish: PRODUCTS[0].finishOptions[0],
      quantity: 1,
    },
  ]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);

  // Story / Film / Catalog / Concierge Modals
  const [filmModalOpen, setFilmModalOpen] = useState(false);
  const [storyModalOpen, setStoryModalOpen] = useState<
    'bakare' | 'projects' | 'journal' | 'concierge' | null
  >(null);
  const [catalogModalOpen, setCatalogModalOpen] = useState(false);
  const [catalogSubmitted, setCatalogSubmitted] = useState(false);
  const [conciergeSubmitted, setConciergeSubmitted] = useState(false);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<string | null>(null);

  const deckTriggerRef = useRef<HTMLDivElement | null>(null);

  // Observe Deck Trigger and general [data-animation-on-scroll] elements
  useEffect(() => {
    const deckNode = deckTriggerRef.current;
    const deckObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setDeckSpread(true);
            deckObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    if (deckNode) deckObserver.observe(deckNode);

    const scrollElements = document.querySelectorAll('[data-animation-on-scroll]');
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-on-scroll-visible');
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    scrollElements.forEach((el) => {
      el.classList.add('animate-on-scroll-hidden');
      scrollObserver.observe(el);
    });

    return () => {
      deckObserver.disconnect();
      scrollObserver.disconnect();
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const openProductDetail = (product: Product) => {
    setActiveProductModal(product);
    setSelectedFinish(product.finishOptions[0]);
  };

  const addToCart = (product: Product, finish?: string) => {
    const chosenFinish = finish || product.finishOptions[0];
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.finish === chosenFinish
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prev, { product, finish: chosenFinish, quantity: 1 }];
    });
    setActiveProductModal(null);
    setCartOpen(true);
    setCheckoutSuccess(null);
  };

  const updateCartQuantity = (idx: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item, i) => (i === idx ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotalNGN = cart.reduce(
    (acc, item) => acc + item.product.priceNGN * item.quantity,
    0
  );
  const cartSubtotalUSD = cart.reduce(
    (acc, item) => acc + item.product.priceUSD * item.quantity,
    0
  );

  const handleDeckCardClick = (category: string) => {
    setSelectedCategory(category);
    setShowShowroomGrid(true);
    const showroomEl = document.getElementById('atelier-showroom-grid');
    if (showroomEl) {
      showroomEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredProducts =
    selectedCategory === 'All'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  const toggleFlipCard = (index: number) => {
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterStatus(
      'Welcome to the Lumina Lagos & Abuja Private List. Invitations to our next Victoria Island exhibition will be sent to your inbox.'
    );
    setNewsletterEmail('');
  };

  return (
    <div className="font-secondary bg-neutral-background text-text-primary overflow-x-hidden min-h-screen flex flex-col w-full relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border-light/40">
        <nav className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          {/* Menu Toggle (Left) */}
          <div className="flex items-center gap-3">
            <button
              id="menu-btn"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
              className="p-3 hover:bg-brand-secondary rounded-full transition-colors flex items-center justify-center group cursor-pointer"
            >
              <i className="ph ph-list text-2xl text-brand-primary group-hover:text-brand-accent transition-colors"></i>
            </button>
            <button
              onClick={() => {
                setStoryModalOpen('concierge');
                setConciergeSubmitted(false);
              }}
              className="hidden lg:inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-text-secondary hover:text-brand-primary transition-colors cursor-pointer"
            >
              <i className="ph ph-whatsapp-logo text-base text-brand-accent"></i>
              <span>VI &amp; Maitama Concierge</span>
            </button>
          </div>

          {/* Centered Logo */}
          <a
            href="#top"
            className="flex flex-col items-center group absolute left-1/2 -translate-x-1/2"
          >
            <i className="ph ph-lamp text-2xl mb-1 text-brand-accent group-hover:scale-110 transition-transform duration-500"></i>
            <span className="font-primary text-xl font-bold text-brand-primary tracking-[0.25em] uppercase">
              Lumina
            </span>
          </a>

          {/* Currency Switcher, Bag & CTA Button (Right) */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-brand-secondary border border-border-light rounded-full p-1">
              <button
                onClick={() => setCurrency('NGN')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  currency === 'NGN'
                    ? 'bg-brand-primary text-white'
                    : 'text-text-secondary hover:text-brand-primary'
                }`}
              >
                ₦ NGN
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-brand-primary text-white'
                    : 'text-text-secondary hover:text-brand-primary'
                }`}
              >
                $ USD
              </button>
            </div>

            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open Atelier Bag"
              className="relative p-3 hover:bg-brand-secondary rounded-full transition-colors flex items-center justify-center cursor-pointer"
            >
              <i className="ph ph-shopping-bag text-xl text-brand-primary"></i>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-brand-accent text-brand-primary text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            <a
              href="#collections"
              onClick={() => setShowShowroomGrid(true)}
              className="hidden md:inline-block bg-brand-primary hover:bg-brand-accent text-white px-8 py-3 rounded-full font-bold text-[11px] uppercase tracking-[0.15em] shadow-lg transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              Shop Now
            </a>
          </div>
        </nav>
      </header>

      {/* Fullscreen Mobile / Navigation Menu Overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 bg-brand-primary z-[60] flex flex-col items-center justify-center space-y-12 transition-all duration-500 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto visible'
            : 'opacity-0 pointer-events-none invisible'
        }`}
      >
        <button
          id="close-menu-btn"
          aria-label="Close menu"
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-8 left-6 p-3 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <i className="ph ph-x text-3xl text-white"></i>
        </button>

        <div className="flex flex-col items-center space-y-7 text-center">
          <a
            href="#top"
            onClick={() => setMobileMenuOpen(false)}
            className="text-4xl md:text-5xl font-primary font-bold text-white hover:text-brand-accent transition-colors menu-link"
          >
            Home
          </a>
          <a
            href="#collections"
            onClick={() => {
              setMobileMenuOpen(false);
              setShowShowroomGrid(true);
            }}
            className="text-4xl md:text-5xl font-primary font-bold text-white hover:text-brand-accent transition-colors menu-link"
          >
            Collections
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-4xl md:text-5xl font-primary font-bold text-white hover:text-brand-accent transition-colors menu-link"
          >
            Lagos &amp; Abuja Showrooms
          </a>
          <a
            href="#why-lumina"
            onClick={() => setMobileMenuOpen(false)}
            className="text-4xl md:text-5xl font-primary font-bold text-white hover:text-brand-accent transition-colors menu-link"
          >
            Bronze &amp; Craft
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setStoryModalOpen('journal');
            }}
            className="text-4xl md:text-5xl font-primary font-bold text-white hover:text-brand-accent transition-colors menu-link cursor-pointer"
          >
            Journal
          </button>

          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <a
              href="#collections"
              onClick={() => {
                setMobileMenuOpen(false);
                setShowShowroomGrid(true);
              }}
              className="bg-brand-accent hover:bg-white text-brand-primary px-10 py-4 rounded-full font-bold text-[13px] uppercase tracking-[0.2em] shadow-xl transition-all transform hover:scale-105 active:scale-95 menu-link inline-block"
            >
              Explore Pieces
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setStoryModalOpen('concierge');
                setConciergeSubmitted(false);
              }}
              className="border border-white/25 text-white hover:bg-white hover:text-brand-primary px-8 py-4 rounded-full font-bold text-[13px] uppercase tracking-[0.2em] transition-all cursor-pointer"
            >
              Book Site Visit
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 pt-8">
          <p className="text-[11px] font-bold text-brand-accent uppercase tracking-widest">
            Victoria Island · Maitama · Mayfair
          </p>
          <div className="flex gap-8">
            <a
              href="#collections"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Instagram"
              className="text-white/40 hover:text-white transition-colors"
            >
              <i className="ph ph-instagram-logo text-3xl"></i>
            </a>
            <a
              href="#collections"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Pinterest"
              className="text-white/40 hover:text-white transition-colors"
            >
              <i className="ph ph-pinterest-logo text-3xl"></i>
            </a>
            <a
              href="#collections"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Behance"
              className="text-white/40 hover:text-white transition-colors"
            >
              <i className="ph ph-behance-logo text-3xl"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main id="top" className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-12 md:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-16">
            <div className="flex flex-col lg:flex-row items-end justify-between gap-12">
              <div className="w-full lg:w-2/3">
                <AnimatedWords
                  as="h1"
                  text="Sculpted Light for Statement Spaces."
                  className="font-primary text-[52px] md:text-[86px] leading-[0.92] font-bold text-brand-primary tracking-tighter mb-8"
                />
                <AnimatedWords
                  as="p"
                  text="Afro-modernist architectural lighting crafted for Lagos penthouses, Abuja villas, and discerning spaces worldwide. Discover hand-cast bronze and kiln-dried Nigerian Iroko luminaires."
                  className="text-xl md:text-2xl text-text-secondary leading-relaxed max-w-2xl"
                />
              </div>
              <div className="w-full lg:w-1/3 flex flex-col gap-6" data-animation-on-scroll="">
                <div
                  onClick={() => openProductDetail(PRODUCTS[0])}
                  className="bg-brand-secondary p-8 rounded-xl border border-border-light hover:border-brand-accent transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-accent">
                      New Lagos Release
                    </p>
                    <span className="text-xs text-text-secondary group-hover:text-brand-primary transition-colors">
                      Inspect Piece →
                    </span>
                  </div>
                  <p className="text-lg font-medium">
                    The Eko Solstice Floor Lamp is now available in Burnished Benin Bronze. Limited
                    commission of 50 pieces.
                  </p>
                </div>
                <a
                  href="#collections"
                  onClick={() => setShowShowroomGrid(true)}
                  className="bg-brand-primary text-white text-center py-5 rounded-full text-[13px] font-bold uppercase tracking-widest hover:bg-brand-accent transition-all shadow-xl"
                >
                  Shop The Collection
                </a>
              </div>
            </div>
          </div>

          {/* Infinite Product/Lifestyle Carousel */}
          <div className="relative w-full overflow-hidden mb-24">
            <div
              onMouseEnter={() => setCarouselPaused(true)}
              onMouseLeave={() => setCarouselPaused(false)}
              style={{ animationPlayState: carouselPaused ? 'paused' : 'running' }}
              className="animate-infinite-scroll flex gap-6 px-4 w-max"
            >
              {[...CAROUSEL_SLIDES, ...CAROUSEL_SLIDES].map((slide, index) => {
                const linkedProduct =
                  PRODUCTS.find((p) => p.id === slide.productId) || PRODUCTS[0];
                return (
                  <div
                    key={index}
                    onClick={() => openProductDetail(linkedProduct)}
                    className="relative w-[450px] h-[350px] shrink-0 rounded-xl overflow-hidden shadow-soft group cursor-pointer"
                  >
                    <SafeImage
                      src={slide.src}
                      fallbackSrc={slide.fallback}
                      alt={slide.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">
                          {linkedProduct.series}
                        </p>
                        <p className="font-primary text-lg font-bold text-white">
                          {linkedProduct.name}
                        </p>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-white bg-white/15 backdrop-blur-md px-4 py-2 rounded-full tabular-nums">
                        {formatPrice(linkedProduct, currency)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats/Brand Values */}
        <section id="about" className="py-24 bg-brand-secondary border-y border-border-light">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
              <div data-animation-on-scroll="">
                <p className="text-brand-accent text-3xl font-primary italic mb-2">160V–260V</p>
                <h3 className="text-sm font-bold uppercase tracking-widest text-text-primary">
                  Inverter &amp; Surge Ready
                </h3>
              </div>
              <div data-animation-on-scroll="">
                <p className="text-brand-accent text-3xl font-primary italic mb-2">100%</p>
                <h3 className="text-sm font-bold uppercase tracking-widest text-text-primary">
                  Kiln-Dried Nigerian Iroko
                </h3>
              </div>
              <div data-animation-on-scroll="">
                <p className="text-brand-accent text-3xl font-primary italic mb-2">Hand-Cast</p>
                <h3 className="text-sm font-bold uppercase tracking-widest text-text-primary">
                  Bronze &amp; Brass In Lagos
                </h3>
              </div>
              <div data-animation-on-scroll="">
                <p className="text-brand-accent text-3xl font-primary italic mb-2">White-Glove</p>
                <h3 className="text-sm font-bold uppercase tracking-widest text-text-primary">
                  Lagos &amp; Abuja Installation
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* Collection Deck Spreading Section */}
        <section
          id="collections"
          className="py-32 bg-brand-primary text-white overflow-hidden relative"
        >
          <div className="max-w-7xl mx-auto px-6 text-center mb-16">
            <p
              className="text-brand-accent text-sm font-bold uppercase tracking-[0.2em] mb-4"
              data-animation-on-scroll=""
            >
              The Lagos &amp; Abuja Editions
            </p>
            <AnimatedWords
              as="h2"
              text="Browse Our Collections"
              className="font-primary text-4xl md:text-7xl font-bold tracking-tighter"
            />
          </div>

          <div
            ref={deckTriggerRef}
            id="deck-trigger"
            className={`relative w-full max-w-6xl mx-auto h-[500px] md:h-[650px] flex items-center justify-center ${
              deckSpread ? 'spread-active' : ''
            }`}
          >
            <div className="deck-container relative w-full h-full flex items-center justify-center perspective-1000">
              {DECK_COLLECTIONS.map((card) => (
                <div
                  key={card.index}
                  data-index={card.index}
                  style={{ '--index': card.index } as React.CSSProperties}
                  onClick={() => handleDeckCardClick(card.category)}
                  className={`deck-card group ${
                    selectedCategory === card.category && showShowroomGrid
                      ? 'active-deck-card'
                      : ''
                  }`}
                >
                  <SafeImage
                    src={card.image}
                    fallbackSrc={card.fallback}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="deck-card-overlay">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-2">
                      {card.series}
                    </span>
                    <h4 className="font-primary text-3xl font-bold text-white">{card.title}</h4>
                    <p className="text-xs text-white/60 mt-2 uppercase tracking-widest">
                      Explore Collection →
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Atelier Showroom Filter & Product Grid */}
          <div id="atelier-showroom-grid" className="max-w-7xl mx-auto px-6 pt-12">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              {[
                'All',
                'Statement Chandeliers',
                'Sculptural Floor Lamps',
                'Dining Pendants',
                'Wall Sconces',
                'Bespoke Commissions',
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowShowroomGrid(true);
                  }}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-brand-accent text-brand-primary shadow-lg'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => openProductDetail(product)}
                  className="bg-[#1a1a1a] border border-white/10 hover:border-brand-accent/60 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                >
                  <div>
                    <div className="relative h-72 overflow-hidden bg-black">
                      <SafeImage
                        src={product.image}
                        fallbackSrc={product.fallbackImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {product.edition && (
                        <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest text-brand-accent bg-brand-primary/90 backdrop-blur-md px-3 py-1.5 rounded-md">
                          {product.edition}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between text-xs text-white/50 uppercase tracking-widest mb-2">
                        <span>
                          {product.series} · {product.category}
                        </span>
                        <span>160V–260V</span>
                      </div>
                      <h3 className="font-primary text-2xl font-bold text-white mb-2 group-hover:text-brand-accent transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-white/60 line-clamp-2 mb-4">
                        {product.description}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 pb-6 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-lg font-medium text-white tabular-nums">
                      {formatPrice(product, currency)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="text-xs font-bold uppercase tracking-widest text-brand-accent hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Add to Bag</span>
                      <i className="ph ph-plus"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lumina Highlights / Testimonials Section */}
        <section className="px-6 py-24 max-w-7xl mx-auto overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div data-animation-on-scroll="">
              <p className="text-brand-accent text-sm font-bold uppercase tracking-[0.2em] mb-3">
                Nigerian Spaces &amp; Commissions
              </p>
              <AnimatedWords
                as="h2"
                text="Lumina in Atmosphere"
                className="text-4xl md:text-5xl font-bold text-brand-primary font-primary tracking-tighter"
              />
            </div>
            <div data-animation-on-scroll="">
              <button
                onClick={() => setStoryModalOpen('projects')}
                className="bg-white border border-border-light px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-brand-secondary transition-colors text-text-primary shadow-sm cursor-pointer"
              >
                View All Projects
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            {/* Testimonial Card */}
            <div
              data-animation-on-scroll=""
              className="md:col-span-4 bg-brand-secondary p-8 md:p-10 rounded-[2.5rem] shadow-soft flex flex-col justify-between border border-border-light relative overflow-hidden group"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <SafeImage
                    src="https://images.pexels.com/photos/36279931/pexels-photo-36279931.jpeg?w=200&h=200&fit=crop"
                    fallbackSrc="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300"
                    alt="Arc. Tunde Bakare"
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h4 className="font-bold text-brand-primary font-primary text-lg">
                      Arc. Tunde Bakare
                    </h4>
                    <p className="text-[10px] text-text-secondary uppercase tracking-[0.15em] font-bold">
                      Studio Bakare, Ikoyi, Lagos
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 text-brand-accent mb-6">
                  <i className="ph-fill ph-star text-sm"></i>
                  <i className="ph-fill ph-star text-sm"></i>
                  <i className="ph-fill ph-star text-sm"></i>
                  <i className="ph-fill ph-star text-sm"></i>
                  <i className="ph-fill ph-star text-sm"></i>
                </div>

                <h5 className="font-primary font-bold text-2xl mb-4 text-brand-primary">
                  Unapologetic Nigerian Grandeur
                </h5>
                <p className="text-text-secondary text-base leading-relaxed mb-8 italic">
                  "Specifying Lumina for our Banana Island and Maitama residences has transformed how
                  our clients experience evening atmosphere. The weight of the sand-cast bronze and
                  their built-in surge stabilization mean our fixtures never flicker during power
                  switchovers."
                </p>
              </div>

              <button
                onClick={() => setStoryModalOpen('bakare')}
                className="text-brand-primary font-bold text-[11px] uppercase tracking-widest hover:text-brand-accent flex items-center gap-2 group relative z-10 cursor-pointer text-left"
              >
                Read full story
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              {/* Decorative background icon */}
              <i className="ph ph-quotes absolute -bottom-6 -right-6 text-[12rem] text-brand-accent/5 pointer-events-none"></i>
            </div>

            {/* Highlight Images */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8 h-full">
              {/* Image 1 */}
              <div
                data-animation-on-scroll=""
                onClick={() => setStoryModalOpen('projects')}
                className="relative h-[400px] md:h-full min-h-[350px] rounded-[2.5rem] overflow-hidden group shadow-card cursor-pointer"
              >
                <SafeImage
                  src="https://images.pexels.com/photos/6580404/pexels-photo-6580404.jpeg?w=800&h=1000&fit=crop"
                  alt="Lumina in a Banana Island Lagos Penthouse"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-2">
                    Project 01 · Lagos
                  </p>
                  <p className="font-primary font-bold text-2xl">Banana Island Penthouse</p>
                </div>
              </div>

              {/* Image 2 with Play Button */}
              <div
                data-animation-on-scroll=""
                onClick={() => setFilmModalOpen(true)}
                className="relative h-[400px] md:h-full min-h-[350px] rounded-[2.5rem] overflow-hidden group shadow-card cursor-pointer"
              >
                <SafeImage
                  src="https://images.pexels.com/photos/7439756/pexels-photo-7439756.jpeg?w=800&h=1000&fit=crop"
                  alt="Lumina bronze casting craftsmanship detail"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors z-10">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 hover:scale-110 hover:bg-brand-accent hover:border-brand-accent transition-all duration-500 group/play">
                    <i className="ph-fill ph-play text-white text-2xl ml-1 group-hover/play:text-brand-primary transition-colors"></i>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-2">
                    Atelier Film
                  </p>
                  <p className="font-primary font-bold text-2xl">The Benin Bronze Pour</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Lumina (Nexus Style with Flip Cards) */}
        <section
          id="why-lumina"
          className="relative w-full flex flex-col items-center justify-center py-[120px] px-[30px] bg-white overflow-hidden font-secondary"
        >
          {/* Side Decorative Lines */}
          <div className="absolute inset-0 pointer-events-none flex justify-center z-0">
            <div className="w-full max-w-[1300px] h-full relative">
              <div className="absolute left-[50px] w-[1px] h-full bg-border-light/40"></div>
              <div className="absolute right-[50px] w-[1px] h-full bg-border-light/40"></div>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-[1060px] flex flex-col items-center gap-[56px]">
            {/* Header Content */}
            <div className="flex flex-col items-center gap-4 text-center">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-[9px] bg-white rounded-full border-[1.5px] border-border-light shadow-[0_4px_16px_rgba(0,0,0,0.03)]"
                data-animation-on-scroll=""
              >
                <i className="ph ph-sparkle text-brand-accent"></i>
                <span className="text-[13px] font-bold uppercase tracking-widest text-brand-primary">
                  Why Lumina Nigeria
                </span>
              </div>

              <AnimatedWords
                as="h2"
                text="Afro-modernist form, engineered resilience"
                className="text-[42px] md:text-[56px] font-bold font-primary leading-[1.1] text-brand-primary tracking-tighter"
              />
              <AnimatedWords
                as="p"
                text="Discerning Nigerian homeowners and architects choose Lumina because we unite West African bronze and hardwood heritage with power-stabilized lighting engineering."
                className="text-[18px] text-text-secondary leading-[1.6] max-w-2xl"
              />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {/* Card 1 */}
              <div
                onClick={() => toggleFlipCard(0)}
                className={`flip-card aspect-[337/350] w-full ${flippedCards[0] ? 'flipped' : ''}`}
                data-animation-on-scroll=""
              >
                <div className="flip-card-inner">
                  {/* Front */}
                  <div className="front bg-brand-secondary border-[1.5px] border-border-light shadow-sm">
                    <div className="w-full h-2/3 rounded-xl overflow-hidden mb-6">
                      <SafeImage
                        src="https://images.pexels.com/photos/12733/pexels-photo-12733.jpeg?w=600&h=400&fit=crop"
                        alt="Benin Bronze Heritage"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-[22px] font-bold font-primary text-brand-primary tracking-tight">
                      Benin Bronze Heritage
                    </h3>
                  </div>
                  {/* Back */}
                  <div className="back bg-brand-primary text-white shadow-xl">
                    <h3 className="text-[24px] font-bold font-primary mb-4 text-brand-accent">
                      Cast for Generations
                    </h3>
                    <p className="text-[15px] leading-[1.6] opacity-80">
                      Inspired by centuries of Nigerian bronze casting, our heavy-gauge brass and
                      bronze hardware develops a rich living patina that elevates modern interiors.
                    </p>
                    <div className="mt-6 px-4 py-2 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      Artisan Metallurgy
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div
                onClick={() => toggleFlipCard(1)}
                className={`flip-card aspect-[337/350] w-full ${flippedCards[1] ? 'flipped' : ''}`}
                data-animation-on-scroll=""
                style={{ transitionDelay: '100ms' }}
              >
                <div className="flip-card-inner">
                  {/* Front */}
                  <div className="front bg-brand-secondary border-[1.5px] border-border-light shadow-sm">
                    <div className="w-full h-2/3 rounded-xl overflow-hidden mb-6">
                      <SafeImage
                        src="https://images.pexels.com/photos/7519888/pexels-photo-7519888.jpeg?w=600&h=400&fit=crop"
                        alt="Power & Surge Resilient"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-[22px] font-bold font-primary text-brand-primary tracking-tight">
                      Power &amp; Surge Resilient
                    </h3>
                  </div>
                  {/* Back */}
                  <div className="back bg-brand-accent text-brand-primary shadow-xl">
                    <h3 className="text-[24px] font-bold font-primary mb-4">
                      160V–260V Stabilized
                    </h3>
                    <p className="text-[15px] leading-[1.6] font-medium opacity-90">
                      Engineered for Nigerian power realities. Every luminaire integrates wide-voltage
                      surge protection and zero-flicker drivers for seamless inverter and generator
                      switchovers.
                    </p>
                    <div className="mt-6 px-4 py-2 border border-brand-primary/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      Inverter Ready
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div
                onClick={() => toggleFlipCard(2)}
                className={`flip-card aspect-[337/350] w-full ${flippedCards[2] ? 'flipped' : ''}`}
                data-animation-on-scroll=""
                style={{ transitionDelay: '200ms' }}
              >
                <div className="flip-card-inner">
                  {/* Front */}
                  <div className="front bg-brand-secondary border-[1.5px] border-border-light shadow-sm">
                    <div className="w-full h-2/3 rounded-xl overflow-hidden mb-6">
                      <SafeImage
                        src="https://images.pexels.com/photos/2762957/pexels-photo-2762957.jpeg?w=600&h=400&fit=crop"
                        alt="Tropical-Grade Finishes"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-[22px] font-bold font-primary text-brand-primary tracking-tight">
                      Tropical-Grade Finishes
                    </h3>
                  </div>
                  {/* Back */}
                  <div className="back bg-black text-white shadow-xl">
                    <h3 className="text-[24px] font-bold font-primary mb-4 text-brand-accent">
                      Built for Our Climate
                    </h3>
                    <p className="text-[15px] leading-[1.6] opacity-80">
                      From coastal Victoria Island salt air to Harmattan dust, our marine-sealed solid
                      brass and kiln-dried Nigerian Iroko timber resist corrosion and warping for life.
                    </p>
                    <div className="mt-6 px-4 py-2 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      Climate Engineered
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 md:py-32 bg-white" id="faq">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-16 md:gap-24">
              {/* FAQ Header */}
              <div className="lg:w-2/5" data-animation-on-scroll="">
                <div className="inline-block px-4 py-2 bg-brand-accent/10 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-6">
                  Client Advisory &amp; Care
                </div>
                <AnimatedWords
                  as="h2"
                  text="Frequently Asked Questions"
                  className="font-primary text-4xl md:text-6xl font-bold tracking-tighter leading-[1.1] text-brand-primary"
                />
                <AnimatedWords
                  as="p"
                  text="Everything you need to know about our voltage protection, duplex void installations, and Lagos & Abuja delivery."
                  className="mt-8 text-text-secondary text-lg max-w-sm"
                />
                <div className="mt-12 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-secondary flex items-center justify-center border border-border-light">
                      <i className="ph ph-envelope text-xl"></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-brand-accent">
                        Private Client Desk
                      </p>
                      <a
                        href="mailto:concierge@lumina.ng"
                        className="text-sm font-medium hover:text-brand-accent transition-colors"
                      >
                        concierge@lumina.ng
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setStoryModalOpen('concierge');
                      setConciergeSubmitted(false);
                    }}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-brand-secondary border border-border-light hover:border-brand-accent text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    <i className="ph ph-whatsapp-logo text-lg text-brand-accent"></i>
                    <span>Schedule Lagos / Abuja Site Visit</span>
                  </button>
                </div>
              </div>

              {/* FAQ List */}
              <div className="lg:w-3/5 space-y-4" data-animation-on-scroll="">
                {FAQ_ITEMS.map((item, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`faq-item border border-border-light rounded-2xl overflow-hidden transition-all duration-300 ${
                        isOpen ? 'bg-white shadow-soft' : 'bg-brand-secondary/30'
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="faq-question w-full flex justify-between items-center p-6 md:p-8 text-left group cursor-pointer"
                      >
                        <span className="font-primary font-bold text-lg md:text-xl text-brand-primary">
                          {item.question}
                        </span>
                        <div className="faq-icon w-8 h-8 rounded-full border border-border-light flex items-center justify-center flex-shrink-0 ml-4 group-hover:bg-brand-primary group-hover:border-brand-primary transition-all duration-300">
                          <i
                            className={`ph ph-plus text-brand-primary group-hover:text-white transition-transform duration-300 ${
                              isOpen ? 'rotate-45' : 'rotate-0'
                            }`}
                          ></i>
                        </div>
                      </button>
                      <div
                        className={`faq-answer overflow-hidden transition-all duration-500 ease-in-out ${
                          isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <p className="px-6 md:px-8 pb-8 text-text-secondary leading-relaxed max-w-2xl">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 bg-brand-secondary">
          <div className="max-w-4xl mx-auto px-6 text-center" data-animation-on-scroll="">
            <AnimatedWords
              as="h2"
              text="Command Your Space."
              className="font-primary text-5xl md:text-7xl font-bold mb-10 text-brand-primary"
            />
            <AnimatedWords
              as="p"
              text="Experience lighting that unites Afro-modernist architectural grandeur with warm, uninterrupted serenity."
              className="text-xl text-text-secondary mb-12"
            />
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a
                href="#collections"
                onClick={() => setShowShowroomGrid(true)}
                className="bg-brand-primary text-white px-12 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-brand-accent transition-all shadow-xl"
              >
                Shop The Collection
              </a>
              <button
                onClick={() => {
                  setCatalogModalOpen(true);
                  setCatalogSubmitted(false);
                }}
                className="border border-brand-primary/20 text-brand-primary px-12 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-white transition-all cursor-pointer"
              >
                Request Spec Monograph
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-primary pt-24 text-white relative overflow-hidden border-t border-white-10">
        {/* Footer Top / Testimonial Area */}
        <div className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-12 items-center relative z-10">
          <div data-animation-on-scroll="">
            <span className="text-brand-accent text-5xl font-primary leading-none">"</span>
            <AnimatedWords
              as="h3"
              text="Crafting contemporary Nigerian heirlooms in solid bronze and light"
              className="font-primary text-3xl md:text-4xl leading-snug mt-2"
            />

            <div className="mt-8 bg-brand-accent p-4 inline-block text-brand-primary rounded-lg">
              <i className="ph ph-lightbulb-filament text-3xl"></i>
            </div>
          </div>

          <div className="flex justify-center relative" data-animation-on-scroll="">
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white-10 relative">
              <SafeImage
                src="https://images.pexels.com/photos/36279913/pexels-photo-36279913.jpeg?w=600&h=600&fit=crop"
                fallbackSrc="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Lead Designer"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => setFilmModalOpen(true)}
              aria-label="Watch Lead Designer Film"
              className="absolute bottom-0 right-0 md:right-10 bg-brand-accent hover:bg-white rounded-full p-6 text-brand-primary font-bold text-xs uppercase tracking-widest flex flex-col items-center justify-center w-24 h-24 rotate-12 shadow-lg transform translate-y-4 transition-colors cursor-pointer"
            >
              <span>View</span>
              <i className="ph-fill ph-play mt-1 text-sm"></i>
            </button>
          </div>

          <div className="text-left md:text-right" data-animation-on-scroll="">
            <p className="font-primary italic text-brand-accent text-lg mb-4">Our Philosophy</p>
            <AnimatedWords
              as="h3"
              text="Honoring West African metallurgy and timber to define modern luxury living."
              className="text-2xl font-light leading-relaxed"
            />
            <button
              onClick={() => setStoryModalOpen('journal')}
              className="inline-block mt-8 border border-white/30 px-6 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-white hover:text-brand-primary transition-colors duration-300 cursor-pointer"
            >
              Read Journal
            </button>
          </div>
        </div>

        {/* Footer Marquee */}
        <div className="py-6 border-y bg-black border-white-10 text-white-60 marquee-container flex items-center">
          <div className="marquee-content font-primary text-lg tracking-wider uppercase flex items-center gap-8">
            <span>Hand-Cast Bronze</span>{' '}
            <i className="ph-fill ph-sparkle text-brand-accent text-xs"></i>
            <span>Inverter &amp; Surge Protected</span>{' '}
            <i className="ph-fill ph-sparkle text-brand-accent text-xs"></i>
            <span>Kiln-Dried Nigerian Iroko</span>{' '}
            <i className="ph-fill ph-sparkle text-brand-accent text-xs"></i>
            <span>White-Glove Lagos &amp; Abuja Rigging</span>{' '}
            <i className="ph-fill ph-sparkle text-brand-accent text-xs"></i>
            <span>5-Year Voltage Warranty</span>{' '}
            <i className="ph-fill ph-sparkle text-brand-accent text-xs"></i>
            <span>Hand-Cast Bronze</span>{' '}
            <i className="ph-fill ph-sparkle text-brand-accent text-xs"></i>
            <span>Inverter &amp; Surge Protected</span>{' '}
            <i className="ph-fill ph-sparkle text-brand-accent text-xs"></i>
            <span>Kiln-Dried Nigerian Iroko</span>{' '}
            <i className="ph-fill ph-sparkle text-brand-accent text-xs"></i>
            <span>White-Glove Lagos &amp; Abuja Rigging</span>{' '}
            <i className="ph-fill ph-sparkle text-brand-accent text-xs"></i>
            <span>5-Year Voltage Warranty</span>{' '}
            <i className="ph-fill ph-sparkle text-brand-accent text-xs"></i>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="bg-brand-primary py-16 px-6 md:px-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white-10 pb-12">
            <div>
              <p className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-6">
                Showrooms
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                {Object.keys(ATELIERS_INFO).map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedAtelier(city)}
                    className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase transition cursor-pointer ${
                      selectedAtelier === city
                        ? 'bg-brand-accent text-brand-primary'
                        : 'border border-white-20 text-white hover:bg-white-10'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
              <div className="text-xs text-white/60 space-y-1">
                <p className="text-white font-medium">{ATELIERS_INFO[selectedAtelier].city}</p>
                <p>{ATELIERS_INFO[selectedAtelier].address}</p>
                <p>{ATELIERS_INFO[selectedAtelier].hours}</p>
                <p className="text-brand-accent pt-1">{ATELIERS_INFO[selectedAtelier].phone}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-6">
                Connect
              </p>
              <div className="flex gap-4 mb-4">
                <a
                  href="#collections"
                  aria-label="Instagram"
                  className="border border-white-20 text-white rounded-full p-2.5 hover:bg-white-10 cursor-pointer transition"
                >
                  <i className="ph ph-instagram-logo text-lg"></i>
                </a>
                <a
                  href="#collections"
                  aria-label="Pinterest"
                  className="border border-white-20 text-white rounded-full p-2.5 hover:bg-white-10 cursor-pointer transition"
                >
                  <i className="ph ph-pinterest-logo text-lg"></i>
                </a>
                <button
                  onClick={() => {
                    setStoryModalOpen('concierge');
                    setConciergeSubmitted(false);
                  }}
                  aria-label="WhatsApp Concierge"
                  className="border border-white-20 text-white rounded-full p-2.5 hover:bg-brand-accent hover:text-brand-primary cursor-pointer transition"
                >
                  <i className="ph ph-whatsapp-logo text-lg"></i>
                </button>
              </div>
              <p className="text-xs text-white/50">
                Private consultations available in Ikoyi, VI, Lekki &amp; Maitama.
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-6">
                The Collector’s Dispatch
              </p>
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex border-b border-white-20 pb-2"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Receive invitations to private Lagos & Abuja viewings..."
                  className="bg-transparent w-full outline-none text-white placeholder-white-40 font-light text-sm"
                />
                <button
                  type="submit"
                  className="text-xs font-bold uppercase hover:text-brand-accent transition tracking-widest cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
              {newsletterStatus && (
                <p className="mt-3 text-xs text-brand-accent">{newsletterStatus}</p>
              )}
            </div>
          </div>

          <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-white-40 uppercase tracking-widest">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <i className="ph-fill ph-lamp text-brand-accent text-sm"></i>
              <span className="text-white font-bold">
                Lumina Architectural Lighting · Lagos &amp; Abuja
              </span>
            </div>
            <p>© 2026 Lumina Nigeria. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Product Detail Quick-View Modal */}
      {activeProductModal && (
        <div
          onClick={() => setActiveProductModal(null)}
          className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-brand-primary rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 relative"
          >
            <button
              onClick={() => setActiveProductModal(null)}
              aria-label="Close product modal"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-brand-primary hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <i className="ph ph-x text-lg"></i>
            </button>

            <div className="h-80 md:h-full bg-brand-secondary relative">
              <SafeImage
                src={activeProductModal.image}
                fallbackSrc={activeProductModal.fallbackImage}
                alt={activeProductModal.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8 md:p-10 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-2">
                  {activeProductModal.series} · {activeProductModal.category}
                </p>
                <h3 className="font-primary text-3xl font-bold text-brand-primary mb-2">
                  {activeProductModal.name}
                </h3>
                <p className="text-2xl font-medium text-brand-primary tabular-nums mb-6">
                  {formatPrice(activeProductModal, currency)}
                </p>
                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                  {activeProductModal.description}
                </p>

                <div className="mb-6">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-text-secondary mb-2">
                    Select Artisan Finish
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {activeProductModal.finishOptions.map((finish) => (
                      <button
                        key={finish}
                        onClick={() => setSelectedFinish(finish)}
                        className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                          selectedFinish === finish
                            ? 'border-brand-primary bg-brand-primary text-white'
                            : 'border-border-light bg-brand-secondary text-text-primary hover:border-brand-accent'
                        }`}
                      >
                        {finish}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border-light pt-4 space-y-2 text-xs text-text-secondary mb-8">
                  <div className="flex justify-between">
                    <span className="font-bold uppercase tracking-wider">Dimensions</span>
                    <span>{activeProductModal.dimensions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold uppercase tracking-wider">Power Protection</span>
                    <span>{activeProductModal.voltageSpec}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold uppercase tracking-wider">Dispatch &amp; Rigging</span>
                    <span>{activeProductModal.leadTime}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => addToCart(activeProductModal, selectedFinish)}
                  className="w-full bg-brand-primary hover:bg-brand-accent text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-colors shadow-lg cursor-pointer"
                >
                  Add to Atelier Bag — {formatPrice(activeProductModal, currency)}
                </button>
                <button
                  onClick={() => {
                    setActiveProductModal(null);
                    setStoryModalOpen('concierge');
                    setConciergeSubmitted(false);
                  }}
                  className="w-full border border-border-light hover:border-brand-primary text-brand-primary py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i className="ph ph-whatsapp-logo text-base text-brand-accent"></i>
                  <span>Inquire with Victoria Island Concierge</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Atelier Bag Slide-Over Drawer */}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          className="fixed inset-0 z-[75] bg-black/60 backdrop-blur-xs flex justify-end"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-brand-primary w-full max-w-md h-full flex flex-col justify-between p-8 shadow-2xl overflow-y-auto"
          >
            <div>
              <div className="flex items-center justify-between border-b border-border-light pb-6 mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">
                    Lumina Victoria Island &amp; Maitama
                  </p>
                  <h3 className="font-primary text-2xl font-bold">Your Selection ({cartCount})</h3>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  aria-label="Close bag"
                  className="p-2 hover:bg-brand-secondary rounded-full transition-colors cursor-pointer"
                >
                  <i className="ph ph-x text-xl"></i>
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-16 text-center">
                  <i className="ph ph-lamp text-4xl text-brand-accent mb-3 inline-block"></i>
                  <p className="text-text-secondary text-sm mb-6">
                    Your Atelier Bag is currently empty.
                  </p>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      setShowShowroomGrid(true);
                    }}
                    className="bg-brand-primary text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer"
                  >
                    Explore Collections
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item, idx) => (
                    <div
                      key={`${item.product.id}-${item.finish}`}
                      className="flex gap-4 pb-6 border-b border-border-light"
                    >
                      <SafeImage
                        src={item.product.image}
                        fallbackSrc={item.product.fallbackImage}
                        alt={item.product.name}
                        className="w-20 h-24 rounded-xl object-cover shrink-0 bg-brand-secondary"
                      />
                      <div className="flex-1">
                        <h4 className="font-primary font-bold text-base">{item.product.name}</h4>
                        <p className="text-xs text-text-secondary mb-2">{item.finish}</p>
                        <p className="text-sm font-medium tabular-nums mb-3">
                          {formatPrice(item.product, currency, item.quantity)}
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateCartQuantity(idx, -1)}
                            className="w-7 h-7 rounded-full border border-border-light flex items-center justify-center hover:bg-brand-secondary cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold tabular-nums">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(idx, 1)}
                            className="w-7 h-7 rounded-full border border-border-light flex items-center justify-center hover:bg-brand-secondary cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {checkoutSuccess && (
                <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs leading-relaxed">
                  {checkoutSuccess}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-6 border-t border-border-light">
                <div className="flex justify-between text-xs text-text-secondary mb-2">
                  <span>White-Glove Lagos / Abuja Delivery</span>
                  <span>Complimentary</span>
                </div>
                <div className="flex justify-between text-xs text-text-secondary mb-3">
                  <span>160V–260V Surge Driver Warranty</span>
                  <span>5 Years Included</span>
                </div>
                <div className="flex justify-between text-lg font-primary font-bold mb-6">
                  <span>Total</span>
                  <span className="tabular-nums">
                    {currency === 'NGN'
                      ? `₦${cartSubtotalNGN.toLocaleString()}`
                      : `$${cartSubtotalUSD.toLocaleString()}`}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setCheckoutSuccess(
                      `Commission #LUM-NG-${Math.floor(
                        1000 + Math.random() * 9000
                      )} Reserved — Our Victoria Island Private Client Desk has generated your pro-forma invoice (Paystack / Corporate Transfer) and scheduled your installation engineer.`
                    );
                  }}
                  className="w-full bg-brand-primary hover:bg-brand-accent text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-colors shadow-lg cursor-pointer"
                >
                  Confirm Commission &amp; Dispatch
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Atelier Film Modal */}
      {filmModalOpen && (
        <div
          onClick={() => setFilmModalOpen(false)}
          className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-md flex items-center justify-center p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-brand-primary border border-white/15 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl text-white"
          >
            <div className="relative h-80 md:h-96 overflow-hidden">
              <SafeImage
                src="https://images.pexels.com/photos/7439756/pexels-photo-7439756.jpeg?w=1200&h=800&fit=crop"
                alt="The Benin Bronze Pour"
                className="w-full h-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/30 to-transparent flex flex-col justify-end p-8">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-2">
                  Lagos &amp; Benin Foundry Monograph · 04:18
                </span>
                <h3 className="font-primary text-3xl md:text-4xl font-bold">
                  The Benin Bronze Pour: Heritage Metallurgy Meets Architectural Light
                </h3>
              </div>
              <button
                onClick={() => setFilmModalOpen(false)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/60 hover:bg-brand-accent text-white hover:text-brand-primary flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ph ph-x text-lg"></i>
              </button>
            </div>
            <div className="p-8 space-y-4 text-white/80 text-sm leading-relaxed">
              <p>
                Filmed across our Lagos studio and partner bronze casters trained in the centuries-old
                Igun Street guild tradition, this short film follows a single Eko Solstice counterweight
                from molten 1,050°C bronze poured into earth molds to its integration with surge-stabilized
                warm LED optics.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-center">
                <div>
                  <p className="font-primary text-xl text-brand-accent font-bold">1,050°C</p>
                  <p className="text-[11px] uppercase tracking-widest text-white/50">
                    Molten Bronze Pour
                  </p>
                </div>
                <div>
                  <p className="font-primary text-xl text-brand-accent font-bold">160V–260V</p>
                  <p className="text-[11px] uppercase tracking-widest text-white/50">
                    Surge &amp; Inverter Guard
                  </p>
                </div>
                <div>
                  <p className="font-primary text-xl text-brand-accent font-bold">2700K</p>
                  <p className="text-[11px] uppercase tracking-widest text-white/50">
                    CRI 97+ Warmth
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Community Stories / Projects / Journal / Concierge Modal */}
      {storyModalOpen && (
        <div
          onClick={() => setStoryModalOpen(null)}
          className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-brand-secondary text-brand-primary rounded-3xl max-w-2xl w-full p-8 md:p-12 relative shadow-2xl"
          >
            <button
              onClick={() => setStoryModalOpen(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white border border-border-light flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors cursor-pointer"
            >
              <i className="ph ph-x text-lg"></i>
            </button>

            {storyModalOpen === 'bakare' && (
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-2">
                  Architect Dossier · Ikoyi, Lagos
                </p>
                <h3 className="font-primary text-3xl font-bold mb-4">
                  Studio Bakare: Illuminating a 6-Metre Banana Island Void
                </h3>
                <p className="text-text-secondary leading-relaxed mb-4">
                  For a private waterfront residence on Banana Island, principal architect Tunde Bakare
                  commissioned the Ikoyi Void Cascade Chandelier alongside fourteen Eko Solstice and
                  Maitama Bronze Sconces to anchor the travertine and Iroko living gallery.
                </p>
                <p className="text-text-secondary leading-relaxed mb-6">
                  "Most imported European fixtures fail within eighteen months of Lagos coastal air and
                  grid fluctuations. Lumina gives our clients museum-grade Nigerian bronze craft that
                  transitions across inverter and generator power without a single flicker."
                </p>
                <button
                  onClick={() => {
                    setStoryModalOpen(null);
                    openProductDetail(PRODUCTS[1]);
                  }}
                  className="bg-brand-primary text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-accent transition-colors cursor-pointer"
                >
                  Inspect Ikoyi Void Chandelier
                </button>
              </div>
            )}

            {storyModalOpen === 'projects' && (
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-2">
                  Nigerian &amp; West African Archive
                </p>
                <h3 className="font-primary text-3xl font-bold mb-6">
                  Selected Residential &amp; Hospitality Commissions
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-white rounded-2xl border border-border-light flex justify-between items-center">
                    <div>
                      <h4 className="font-primary font-bold text-lg">
                        01. Banana Island Waterfront Villa
                      </h4>
                      <p className="text-xs text-text-secondary">
                        Studio Bakare · Ikoyi, Lagos · Ikoyi Void Chandelier &amp; Eko Solstice
                      </p>
                    </div>
                    <span className="text-xs font-bold text-brand-accent">2026</span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-border-light flex justify-between items-center">
                    <div>
                      <h4 className="font-primary font-bold text-lg">
                        02. Maitama Diplomatic Residence
                      </h4>
                      <p className="text-xs text-text-secondary">
                        Atelier North · Maitama, Abuja · Zuma Pendants &amp; Fluted Bronze Sconces
                      </p>
                    </div>
                    <span className="text-xs font-bold text-brand-accent">2025</span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-border-light flex justify-between items-center">
                    <div>
                      <h4 className="font-primary font-bold text-lg">
                        03. Eko Atlantic Sky Penthouse
                      </h4>
                      <p className="text-xs text-text-secondary">
                        Koko Interiors · Victoria Island, Lagos · Bourdillon Monolith No. 04
                      </p>
                    </div>
                    <span className="text-xs font-bold text-brand-accent">2025</span>
                  </div>
                </div>
              </div>
            )}

            {storyModalOpen === 'journal' && (
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-2">
                  The Lumina Monograph · Issue No. 09
                </p>
                <h3 className="font-primary text-3xl font-bold mb-4">
                  Why Nigerian Luxury Homes Deserve 2700K Warmth
                </h3>
                <p className="text-text-secondary leading-relaxed mb-4">
                  For decades, residential builds across Lagos and Abuja defaulted to harsh, clinical
                  6000K white fluorescent tubes that flatten the richness of Nigerian hardwood, art, and
                  marble.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  At Lumina, every fixture is calibrated to 2400K–2700K with a Color Rendering Index
                  above 97—bringing out the deep amber grain of Iroko timber, the warmth of bronze art,
                  and a serene hotel-grade atmosphere after dusk.
                </p>
              </div>
            )}

            {storyModalOpen === 'concierge' && (
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-2">
                  Victoria Island &amp; Maitama Private Desk
                </p>
                <h3 className="font-primary text-3xl font-bold mb-3">
                  Book a Private Consultation or Site Visit
                </h3>
                <p className="text-sm text-text-secondary mb-6">
                  Speak directly with our lighting architects in Lagos or Abuja for duplex void sizing,
                  finish samples, or full-home lighting schedules.
                </p>

                {conciergeSubmitted ? (
                  <div className="p-6 rounded-2xl bg-white border border-border-light text-center">
                    <i className="ph-fill ph-check-circle text-3xl text-brand-accent mb-2 inline-block"></i>
                    <h4 className="font-primary font-bold text-xl mb-1">
                      Concierge Request Logged
                    </h4>
                    <p className="text-xs text-text-secondary">
                      Our Senior Lighting Architect at Adeola Odeku (VI) will reach out via WhatsApp and
                      phone within 30 minutes.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setConciergeSubmitted(true);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Chief / Arc. / Mrs. Adeyemi"
                        className="w-full px-4 py-3 rounded-xl border border-border-light bg-white outline-none focus:border-brand-accent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                        WhatsApp / Mobile Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+234 803 000 0000"
                        className="w-full px-4 py-3 rounded-xl border border-border-light bg-white outline-none focus:border-brand-accent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                        Project Location &amp; Scope
                      </label>
                      <select className="w-full px-4 py-3 rounded-xl border border-border-light bg-white outline-none focus:border-brand-accent text-sm">
                        <option>Lagos (Ikoyi / VI / Banana Island / Lekki)</option>
                        <option>Abuja (Maitama / Asokoro / Guzape)</option>
                        <option>Port Harcourt / Enugu / Other Nigerian City</option>
                        <option>International / Diaspora Export</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-brand-primary hover:bg-brand-accent text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-colors shadow-lg cursor-pointer"
                    >
                      Request WhatsApp &amp; Site Consultation
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Request a Catalog Modal */}
      {catalogModalOpen && (
        <div
          onClick={() => setCatalogModalOpen(false)}
          className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm flex items-center justify-center p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-brand-primary rounded-3xl max-w-lg w-full p-8 md:p-10 relative shadow-2xl"
          >
            <button
              onClick={() => setCatalogModalOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors cursor-pointer"
            >
              <i className="ph ph-x text-lg"></i>
            </button>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent mb-2">
              2026 Nigerian Architectural Monograph
            </p>
            <h3 className="font-primary text-3xl font-bold mb-3">
              Request the Lumina Spec Book
            </h3>
            <p className="text-sm text-text-secondary mb-6">
              Receive our 160-page lookbook with Naira &amp; USD trade pricing, duplex void sizing
              guides, and 3D BIM/CAD files delivered to your inbox or Lagos/Abuja office.
            </p>

            {catalogSubmitted ? (
              <div className="p-6 rounded-2xl bg-brand-secondary border border-border-light text-center">
                <i className="ph-fill ph-check-circle text-3xl text-brand-accent mb-2 inline-block"></i>
                <h4 className="font-primary font-bold text-xl mb-1">Monograph Dispatched</h4>
                <p className="text-xs text-text-secondary">
                  Your digital specification pack has been sent to your email, and our Victoria Island
                  dispatch desk has logged your print copy request.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setCatalogSubmitted(true);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Arc. Tunde Bakare"
                    className="w-full px-4 py-3 rounded-xl border border-border-light bg-brand-secondary/50 outline-none focus:border-brand-accent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="tunde@studiobakare.ng"
                    className="w-full px-4 py-3 rounded-xl border border-border-light bg-brand-secondary/50 outline-none focus:border-brand-accent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                    Practice / Residence Profile
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border border-border-light bg-brand-secondary/50 outline-none focus:border-brand-accent text-sm">
                    <option>Private Homeowner (Lagos / Abuja / PH)</option>
                    <option>Architecture / Interior Design Practice</option>
                    <option>Luxury Real Estate &amp; Short-Let Developer</option>
                    <option>Diaspora Collector</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-primary hover:bg-brand-accent text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-colors shadow-lg cursor-pointer mt-2"
                >
                  Download &amp; Request Print Copy
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
