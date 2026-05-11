import type { CardListingChipFilter, CardListingItem } from '@/components/block/card-listing-block'

/** Figma node 235:5789 — Credit cards chip filters */
export const PRODUCT_LISTING_CREDIT_CHIP_FILTERS: CardListingChipFilter[] = [
  { id: 'general', label: 'General' },
  { id: 'digital', label: 'Digital' },
  { id: 'travel', label: 'Travel' },
  { id: 'loyalty', label: 'Loyalty' },
  { id: 'lounge', label: 'Lounge' },
  { id: 'refund', label: 'Refund' },
  { id: 'fuel_car', label: 'Fuel & Car' },
  { id: 'cobranded', label: 'Co-branded' },
  { id: 'others', label: 'Others' },
]

const CREDIT_PAGE1: CardListingItem[] = [
  {
    id: 'credit-ktc-x-visa-signature',
    chipId: 'general',
    title: 'KTC X Visa Signature',
    description: 'Income: ≥ 50,000 baht/month',
    imageSrc: '/assets/card-listing/01-ktc-x-visa-signature.png',
    imageFit: 'contain',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
  {
    id: 'credit-ktc-digital-visa-signature',
    chipId: 'digital',
    title: 'KTC Digital Visa Signature',
    description: 'Income: ≥ 50,000 baht/month',
    imageSrc: '/assets/card-listing/02-ktc-digital-visa-signature.png',
    imageFit: 'contain',
    badgeLabel: 'New',
    badgeVariant: 'primary',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
  {
    id: 'credit-ktc-visa-signature',
    chipId: 'general',
    title: 'KTC Visa Signature',
    description: 'Income: ≥ 50,000 baht/month',
    imageSrc: '/assets/card-listing/03-ktc-visa-signature.png',
    imageFit: 'contain',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
  {
    id: 'credit-ktc-card',
    chipId: 'general',
    title: 'KTC',
    description: 'Income: ≥ 50,000 baht/month',
    imageSrc: '/assets/card-listing/04-ktc-card.png',
    imageFit: 'contain',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
  {
    id: 'credit-ktc-digital-world-rewards-mc',
    chipId: 'digital',
    title: 'KTC Digital World Rewards Mastercard',
    description: 'Income: ≥ 50,000 baht/month',
    imageSrc: '/assets/card-listing/05-ktc-digital-world-rewards-mastercard.png',
    imageFit: 'contain',
    badgeLabel: 'New',
    badgeVariant: 'primary',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
  {
    id: 'credit-ktc-world-rewards-mc',
    chipId: 'loyalty',
    title: 'KTC World Rewards Mastercard',
    description: 'Income: ≥ 50,000 baht/month',
    imageSrc: '/assets/card-listing/06-ktc-world-rewards-mastercard.png',
    imageFit: 'contain',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
  {
    id: 'credit-ktc-jcb-ultimate',
    chipId: 'travel',
    title: 'KTC JCB Ultimate',
    description: 'Income: ≥ 50,000 baht/month',
    imageSrc: '/assets/card-listing/07-ktc-jcb-ultimate.png',
    imageFit: 'contain',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
  {
    id: 'credit-ktc-unionpay-diamond',
    chipId: 'cobranded',
    title: 'KTC UnionPay Diamond',
    description: 'Income: ≥ 50,000 baht/month',
    imageSrc: '/assets/card-listing/08-ktc-unionpay-diamond.png',
    imageFit: 'contain',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
  {
    id: 'credit-ktc-digital-platinum-visa',
    chipId: 'digital',
    title: 'KTC Digital Platinum Visa',
    description: 'Income: ≥ 50,000 baht/month',
    imageSrc: '/assets/card-listing/09-ktc-digital-platinum-visa.png',
    imageFit: 'contain',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
  {
    id: 'credit-ktc-visa-platinum',
    chipId: 'general',
    title: 'KTC Visa Platinum',
    description: 'Income: ≥ 50,000 baht/month',
    imageSrc: '/assets/card-listing/10-ktc-visa-platinum.png',
    imageFit: 'contain',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
  {
    id: 'credit-ktc-digital-platinum-mc',
    chipId: 'digital',
    title: 'KTC Digital Platinum Mastercard',
    description: 'Income: ≥ 50,000 baht/month',
    imageSrc: '/assets/card-listing/11-ktc-digital-platinum-mastercard.png',
    imageFit: 'contain',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
  {
    id: 'credit-ktc-platinum-mc',
    chipId: 'general',
    title: 'KTC Platinum Mastercard',
    description: 'Income: ≥ 50,000 baht/month',
    imageSrc: '/assets/card-listing/12-ktc-platinum-mastercard.png',
    imageFit: 'contain',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
]

const CREDIT_PAGE2: CardListingItem[] = CREDIT_PAGE1.map((item) => ({
  ...item,
  id: `${item.id}-p2`,
  description: 'Income: ≥ 80,000 baht/month',
}))

/** Figma 235:5789 — Credit cards */
export const PRODUCT_LISTING_CREDIT_ITEMS: CardListingItem[] = [
  ...CREDIT_PAGE1,
  ...CREDIT_PAGE2,
]

/** Figma 235:6160 — Debit cards (assets exported via Figma MCP). */
export const PRODUCT_LISTING_DEBIT_ITEMS: CardListingItem[] = [
  {
    id: 'debit-ktc-x-visa-signature',
    title: 'KTC X Visa Signature',
    imageSrc:
      '/assets/product-listing/debit/e3d7188ed07ce27add7fda67ca6e68b501e59416.png',
    imageFit: 'contain',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
  {
    id: 'debit-ktc-digital-visa-signature',
    title: 'KTC Digital Visa Signature',
    imageSrc:
      '/assets/product-listing/debit/9fecd76d79e249f4916dd2bce919c9754b7c2a24.png',
    imageFit: 'contain',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
  {
    id: 'debit-ktc-visa-signature',
    title: 'KTC Visa Signature',
    imageSrc:
      '/assets/product-listing/debit/55980577522f9332b62f3473a1384b60afe4fd59.png',
    imageFit: 'contain',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
  {
    id: 'debit-ktc',
    title: 'KTC',
    imageSrc:
      '/assets/product-listing/debit/272244b7d5b4614fa325bf10612fcc40fad4c441.png',
    imageFit: 'contain',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
  {
    id: 'debit-ktc-digital-world-rewards-mc',
    title: 'KTC Digital World Rewards Mastercard',
    imageSrc:
      '/assets/product-listing/debit/4e009c6a49096180a8f69c71fe72bdd875796745.png',
    imageFit: 'contain',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
  {
    id: 'debit-ktc-world-rewards-mc',
    title: 'KTC World Rewards Mastercard',
    imageSrc:
      '/assets/product-listing/debit/9b6e38e347433311f18b713e62123c5c85f5e34b.png',
    imageFit: 'contain',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
]

/** Figma 648:8831 — Prepaid and Cash Cards */
export const PRODUCT_LISTING_PREPAID_ITEMS: CardListingItem[] = [
  {
    id: 'prepaid-play-card',
    title: 'Play Card',
    imageSrc:
      '/assets/product-listing/prepaid/9836525c95cb50fbd9605b2524ef3630f7f547c8.png',
    imageFit: 'contain',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
  {
    id: 'prepaid-mangmoon-emv',
    title: 'Mangmoon EMV Card',
    imageSrc:
      '/assets/product-listing/prepaid/b9bec734b90bc82d70531ff66ed2595165e89f66.png',
    imageFit: 'contain',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
  {
    id: 'prepaid-m-pass',
    title: 'M-Pass Card',
    imageSrc:
      '/assets/product-listing/prepaid/d41f9e27bf9bd2af26992373c12384548c243467.png',
    imageFit: 'contain',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
  {
    id: 'prepaid-hop-card',
    title: 'Hop Card',
    imageSrc:
      '/assets/product-listing/prepaid/206064564a0561da8bf18632984a441e21bdc51c.png',
    imageFit: 'contain',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
  {
    id: 'prepaid-fuel-cash',
    title: 'Fuel Cash Card',
    imageSrc:
      '/assets/product-listing/prepaid/b80745c903215f5cb27be6e5089cc5cd3b654943.png',
    imageFit: 'contain',
    linkLabel: 'Card Details',
    linkHref: '#',
  },
]

/** Figma 648:9165 — Promotions */
export const PRODUCT_LISTING_PROMOTIONS_ITEMS: CardListingItem[] = [
  {
    id: 'promo-dairy-queen',
    title: 'FREE Dairy Queen® discount coupon',
    imageSrc:
      '/assets/product-listing/promotions/a352c458cb39aafba6fbe0ec089180128df13be7.png',
    imageFit: 'cover',
    imageFlush: true,
    linkLabel: 'View Details',
    linkHref: '#',
  },
  {
    id: 'promo-ramayana',
    title: 'Ramayana Water Park tickets discount',
    imageSrc:
      '/assets/product-listing/promotions/c9219f429eab3ff9e4d13133baa40285fb517864.png',
    imageFit: 'cover',
    imageFlush: true,
    linkLabel: 'View Details',
    linkHref: '#',
  },
  {
    id: 'promo-gowabi',
    title: 'Shopping discount with GoWabi app',
    imageSrc:
      '/assets/product-listing/promotions/628252419708b9aab760dc8187ec68240fb7fc76.png',
    imageFit: 'cover',
    imageFlush: true,
    linkLabel: 'View Details',
    linkHref: '#',
  },
  {
    id: 'promo-fitness24',
    title: 'Fitness24Seven: Free 500 THB processing fee.',
    imageSrc:
      '/assets/product-listing/promotions/1aced8b90103018e8b9ba1e274f20c445c093485.png',
    imageFit: 'cover',
    imageFlush: true,
    linkLabel: 'View Details',
    linkHref: '#',
  },
  {
    id: 'promo-chic-car',
    title: 'Chic Car Rent special rate',
    imageSrc:
      '/assets/product-listing/promotions/774efcbf87f7c65bae3283f1d06bfe4cf322f9b9.png',
    imageFit: 'cover',
    imageFlush: true,
    linkLabel: 'View Details',
    linkHref: '#',
  },
  {
    id: 'promo-potico',
    title: 'Potico app discount',
    imageSrc:
      '/assets/product-listing/promotions/b512247c82b3bcb322d04a2f57da68557779a625.png',
    imageFit: 'cover',
    imageFlush: true,
    linkLabel: 'View Details',
    linkHref: '#',
  },
  {
    id: 'promo-shopeefood',
    title: 'ShopeeFood: 90% OFF',
    imageSrc:
      '/assets/product-listing/promotions/bb29c93f5699f30b44197d6c3eb7d947bc8ba304.png',
    imageFit: 'cover',
    imageFlush: true,
    linkLabel: 'View Details',
    linkHref: '#',
  },
  {
    id: 'promo-kkday',
    title: 'KKday: Up to 12% OFF',
    imageSrc:
      '/assets/product-listing/promotions/643b5be3c998b9f800e2abfe28a4053481469574.png',
    imageFit: 'cover',
    imageFlush: true,
    linkLabel: 'View Details',
    linkHref: '#',
  },
  {
    id: 'promo-banana',
    title: 'Shop for IT products at BaNANA',
    imageSrc:
      '/assets/product-listing/promotions/ea478796a6bb7fc82c23b19b524f89eb4ae8f998.png',
    imageFit: 'cover',
    imageFlush: true,
    linkLabel: 'View Details',
    linkHref: '#',
  },
  {
    id: 'promo-a-ramen',
    title: 'A RAMEN dining discount',
    imageSrc:
      '/assets/product-listing/promotions/8a081dcf2dab68dfea5b4666fbe3fc332e0e1d5c.png',
    imageFit: 'cover',
    imageFlush: true,
    linkLabel: 'View Details',
    linkHref: '#',
  },
  {
    id: 'promo-studio7',
    title: 'Studio 7 Exclusive deals on Apple products',
    imageSrc:
      '/assets/product-listing/promotions/fdb4fa30e6da0fc11e2534d535e393486b904e1a.png',
    imageFit: 'cover',
    imageFlush: true,
    linkLabel: 'View Details',
    linkHref: '#',
  },
  {
    id: 'promo-monde-eyewear',
    title: 'Monde Eyewear: 50% OFF',
    imageSrc:
      '/assets/product-listing/promotions/9e64a696358c13731c9b74a221b5eab20301662c.png',
    imageFit: 'cover',
    imageFlush: true,
    linkLabel: 'View Details',
    linkHref: '#',
  },
]
