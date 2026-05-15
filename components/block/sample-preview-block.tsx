import { Breadcrumb } from '@/components/ui/breadcrumb'
import { HeroBannerBlockFE } from './hero-banner-block'
import BannerStripBlock from './banner-strip-block'
import { CampaignBannerBlockFE } from './campaign-banner-block'
import { QuickLinkBlockFE } from './quick-link-block'
import { CtaSectionBlockFE } from './cta-section-block'
import { KeyFeatureBlockFE } from './key-feature-block'
import { StepsSectionView } from './steps-section-block'
import FaqSectionBlock from './faq-section-block'
import FeatureProductCarouselBlock from './feature-product-carousel-block'
import ArticleCarouselBlock from './article-carousel-block'
import { RecommendedCarouselView } from './recommended-carousel-block'
import { PromoHighlightsBlockFE } from './promo-highlights-block'
import ProductListingBlock from './product-listing-block'

export type SamplePreviewBlockProps = {
  title: string
  description?: string
  ctaLabel?: string
}

export default function SamplePreviewBlock({}: SamplePreviewBlockProps) {
  const stepsItems3 = [
    {
      description: 'Visit any Krungthai Bank branch to begin your application.',
    },
    {
      description:
        'Present your Thai ID or Passport and your KTB Bank Passbook.',
    },
    {
      description:
        'Receive and activate your new debit card instantly on-site.',
    },
  ]

  const stepsItems2 = [
    {
      description: 'Visit any Krungthai Bank branch to begin your application.',
    },
    {
      description: 'Visit any Krungthai Bank branch to begin your application.',
    },
  ]

  const stepsItems4 = [
    {
      description: 'Visit any Krungthai Bank branch to begin your application.',
    },
    {
      description: 'Visit any Krungthai Bank branch to begin your application.',
    },
    {
      description: 'Visit any Krungthai Bank branch to begin your application.',
    },
    {
      description: 'Visit any Krungthai Bank branch to begin your application.',
    },
  ]

  const featuredProductItems = [
    {
      id: 'product-1',
      category: 'Accounts',
      title: 'Savings Green Deposit',
      description:
        'A savings deposit account designed for all financial activities, supporting the creation of a sustainable world.',
      imageSrc: '/assets/FeatureProduct/p1.jpg',
      badgeLabel: 'New',
      badgeVariant: 'primary' as const,
    },
    {
      id: 'product-2',
      category: 'Cards',
      title: 'KTB Travel Premium Card',
      description:
        'Earn miles on every purchase, free lounge access, travel insurance included.',
      imageSrc: '/assets/FeatureProduct/p2.jpg',
      badgeLabel: 'Hot Deal',
      badgeVariant: 'highlight' as const,
    },
    {
      id: 'product-3',
      category: 'Investment',
      title: 'Buy/Sell Currency Exchange',
      description:
        'Confident good rate with Krungthai Bank at 35 participating branches. Order or call to enquire.',
      imageSrc: '/assets/FeatureProduct/p3.jpg',
    },
    {
      id: 'product-4',
      category: 'Loans',
      title: 'Krungthai NEXT Savings',
      description:
        'Open an account conveniently, easily and safely via mobile app.',
      imageSrc: '/assets/FeatureProduct/p4.jpg',
    },
    {
      id: 'product-5',
      category: 'Property',
      title: 'Property Valuation Plus',
      description:
        'Get an instant valuation estimate and compare available financing options.',
      imageSrc: '/assets/FeatureProduct/p2.jpg',
    },
    {
      id: 'product-6',
      category: 'Property',
      title: 'Krungthai NEXT Savings',
      description:
        'Open an account conveniently, easily and safely via mobile app.',
      imageSrc: '/assets/FeatureProduct/p2.jpg',
    },
    {
      id: 'product-7',
      category: 'Property',
      title: 'Krungthai NEXT Savings',
      description:
        'Open an account conveniently, easily and safely via mobile app.',
      imageSrc: '/assets/FeatureProduct/p3.jpg',
    },
    {
      id: 'product-8',
      category: 'Property',
      title: 'Krungthai NEXT Savings',
      description:
        'Open an account conveniently, easily and safely via mobile app.',
      imageSrc: '/assets/FeatureProduct/p2.jpg',
    },
  ]

  const articleItems = [
    {
      id: 'article-1',
      badgeLabel: 'Announcement',
      date: '8 Apr 2026',
      title: 'Temporary bank closure',
      description:
        'The bank is temporarily closed from April 13, 2026, at 9:00AM onwards and will reopen as usual on April 16, 2026, at 9:00AM.',
      imageSrc: '/assets/articleCarousel/card1.png',
    },
    {
      id: 'article-2',
      badgeLabel: 'News',
      date: '1 Apr 2026',
      title: '“US Dollar Bond Wallet” launch on Paotang app',
      description:
        'Enabling Investment in Digital USD Debentures; PTTEP to Pilot Issuance Expected in Q2/2026.',
      imageSrc: '/assets/articleCarousel/card2.png',
    },
    {
      id: 'article-3',
      badgeLabel: 'News',
      date: '26 Jan 2026',
      title: 'Advance FX Risk Management Program',
      description:
        'Krungthai and IRPC Advance FX Risk Management Program through an Integrated ESG...',
      imageSrc: '/assets/articleCarousel/card3.png',
    },
    {
      id: 'article-4',
      badgeLabel: 'Hot Deal',
      date: '6 Jan 2026',
      title: '60th Anniversary Celebration',
      description:
        'Krungthai Celebrates Its 60th Anniversary with 100 Awards, Reinforcing Its Sustainable Leadership in Finance',
      imageSrc: '/assets/articleCarousel/card4.png',
    },
    {
      id: 'article-5',
      badgeLabel: 'New',
      date: '6 Jan 2026',
      title: 'Krungthai NEXT Savings',
      description:
        'Krungthai Celebrates Its 60th Anniversary with 100 Awards, Reinforcing Its Sustainable Leadership in Finance',
      imageSrc: '/assets/articleCarousel/card1.png',
    },
  ]

  const recommendedItems = [
    {
      id: 'recommended-1',
      badgeLabel: 'New',
      badgeVariant: 'primary' as const,
      title: 'Savings Green Deposit',
      description:
        'A savings deposit account designed for all financial activities, supporting the creation of a sustainable world.',
      imageSrc: '/assets/FeatureProduct/p1.jpg',
      ctaLabel: 'Read more',
      ctaHref: '#',
    },
    {
      id: 'recommended-2',
      badgeLabel: 'Hot Deal',
      badgeVariant: 'highlight' as const,
      title: 'KTB Travel Premium Card',
      description:
        'Earn miles on every purchase, free lounge access, travel insurance included.',
      imageSrc: '/assets/FeatureProduct/p2.jpg',
      ctaLabel: 'Read more',
      ctaHref: '#',
    },
    {
      id: 'recommended-3',
      title: 'Buy/Sell Currency Exchange',
      description:
        'Confident good rate with Krungthai Bank at 35 participating branches. Order or call to enquire.',
      imageSrc: '/assets/FeatureProduct/p3.jpg',
      ctaLabel: 'Read more',
      ctaHref: '#',
    },
    {
      id: 'recommended-4',
      title: 'Krungthai NEXT Savings',
      description:
        'Open an account conveniently, easily and safely via mobile app.',
      imageSrc: '/assets/FeatureProduct/p4.jpg',
    },
    {
      id: 'recommended-5',
      title: 'Property Valuation Plus',
      description:
        'Open an account conveniently, easily and safely via mobile app.',
      imageSrc: '/assets/FeatureProduct/p1.jpg',
      ctaLabel: 'Read more',
      ctaHref: '#',
    },
  ]

  const promoExchangeRates = [
    {
      code: 'USD',
      buy: '31.56',
      sell: '32.35',
      flagSrc: '/assets/promo-highlights/flag-us.png',
    },
    {
      code: 'EUR',
      buy: '36.75',
      sell: '37.89',
      flagSrc: '/assets/promo-highlights/flag-eu.png',
    },
    {
      code: 'GBP',
      buy: '41.99',
      sell: '43.32',
      flagSrc: '/assets/promo-highlights/flag-gbp.png',
    },
    {
      code: 'JPY',
      buy: '0.195',
      sell: '0.205',
      flagSrc: '/assets/promo-highlights/flag-jpy.png',
    },
    {
      code: 'HKD',
      buy: '3.98',
      sell: '4.17',
      flagSrc: '/assets/promo-highlights/flag-hkd.png',
    },
  ]

  const promoInterestRates = [
    {
      id: 'promo-rate-loan',
      title: 'Loan Interest Rates',
      description:
        'Transparent and competitive rates for personal, home, and business loans.',
      imageSrc: '/assets/promo-highlights/rate-loan.png',
      ctaLabel: 'View Rates',
      ctaHref: '#',
    },
    {
      id: 'promo-rate-deposit',
      title: 'Deposit Interest Rates',
      description:
        'Compare interest rates across our range of savings and investment accounts.',
      imageSrc: '/assets/promo-highlights/rate-deposit.png',
      ctaLabel: 'View Rates',
      ctaHref: '#',
    },
  ]

  return (
    <>
      <BannerStripBlock />

      <Breadcrumb
        items={[
          { label: 'Home', href: '#' },
          { label: 'Level 1', href: '#' },
          { label: 'Level 2' },
        ]}
      />

      {/* hero banner block */}
      <HeroBannerBlockFE
        activeDotIndex={0}
        items={[
          {
            badgeLabel: 'Personal Loan',
            title: 'Banking that works for you',
            subtitle:
              'Tailored financial solutions for every life stage — from your first home to your future investments.',
            primaryCtaLabel: 'Request information',
            primaryCtaHref: '#',
            secondaryCtaLabel: 'Download brochure',
            secondaryCtaHref: '#',
            desktopImageSrc: '/assets/images/Home-hero-banner-desktop.png',
            mobileImageSrc: '/assets/images/Home-hero-banner-mobile.png',
          },
          {
            badgeLabel: 'Home Loan 2026',
            title: 'Special Promotion 2026',
            subtitle:
              'Apply for a home loan before 30 June  ·  Interest rate from 2.99% p.a.',
            primaryCtaLabel: 'Apply now',
            primaryCtaHref: '#',
            secondaryCtaLabel: 'View details',
            secondaryCtaHref: '#',
            desktopImageSrc: '/assets/images/Home-hero-banner-desktop-2.png',
            mobileImageSrc: '/assets/images/Home-hero-banner-mobile-2.png',
          },
        ]}
      />

      {/* campaign banner block */}
      <CampaignBannerBlockFE
        title="Secure Payments for Every Thai Lifestyle"
        subtitle="Discover a range of debit and credit cards designed to provide convenience and security wherever you go."
        desktopImageSrc="/assets/images/PLP-campaign-banner-desktop.png"
        mobileImageSrc="/assets/images/PLP-campaign-banner-mobile.png"
      />

      {/* campaign banner block */}
      <CampaignBannerBlockFE
        title="Krungthai Thanawat Loan"
        subtitle="Enjoy high limits and zero collateral with interest calculated on your actual usage."
        desktopImageSrc="/assets/images/PDP_campaign_banner_desktop_v1.png"
        mobileImageSrc="/assets/images/PDP_campaign_banner_mobile_v1.png"
      />

      

      {/* campaign banner block can pass any color to the title and subtitle base on the image background*/}
      <CampaignBannerBlockFE
        badgeLabel="Promotion"
        title="Krungthai Travel Premium Mastercard Debit"
        subtitle="Good exchange rates, interest-free transactions, and cashback up to 10,000 baht per year."
        desktopImageSrc="/assets/images/Microsite-campaign-banner-desktop.png"
        mobileImageSrc="/assets/images/Microsite-campaign-banner-mobile.png"
        titleColor="var(--base-white, #ffffff)"
        subtitleColor="var(--base-white, #ffffff)"
      />

      <ProductListingBlock />

      <QuickLinkBlockFE />
      <KeyFeatureBlockFE />
      <StepsSectionView
        title="Debit Card Application Process"
        items={stepsItems3}
        desktopColumns={3}
        backgroundColor="var(--bg-bg-1, #e6f4fa)"
      />
      <StepsSectionView
        title="Debit Card Application Process"
        items={stepsItems4}
        desktopColumns={4}
        backgroundColor="var(--bg-bg-2, #c0e4f2)"
      />
      <StepsSectionView
        title="Debit Card Application Process"
        items={stepsItems2}
        desktopColumns={2}
        backgroundColor="var(--bg-bg-1, #e6f4fa)"
      />
      <FeatureProductCarouselBlock
        items={featuredProductItems}
        backgroundColor="var(--neutral-050, #f7f7f7)"
      />
      <RecommendedCarouselView
        items={recommendedItems}
        backgroundColor="var(--bg-bg-1, #e6f4fa)"
      />
      <ArticleCarouselBlock
        items={articleItems}
        backgroundColor="var(--neutral-050, #f7f7f7)"
      />

      <PromoHighlightsBlockFE
        exchangeRates={promoExchangeRates}
        interestRates={promoInterestRates}
        backgroundColor="var(--bg-bg-1, #e6f4fa)"
      />

      <FaqSectionBlock />

      <CtaSectionBlockFE />
    </>
  )
}
