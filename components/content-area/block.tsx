import dynamic from 'next/dynamic'
import blocksMapperFactory from '@/lib/utils/block-factory'

// Dynamically import each block
const AvailabilityBlock = dynamic(() => import('../block/availability-block'))
const BannerStripBlock = dynamic(() => import('../block/banner-strip-block'))
const CardListingBlock = dynamic(() => import('../block/card-listing-block'))
const CampaignBannerBlock = dynamic(() => import('../block/campaign-banner-block'))
const ContactBlock = dynamic(() => import('../block/contact-block'))
const HeroBlock = dynamic(() => import('../block/hero-block'))
const HeroBannerBlock = dynamic(() => import('../block/hero-banner-block'))
const KeyFeatureBlock = dynamic(() => import('../block/key-feature-block'))
const PromoHighlightsBlock = dynamic(() => import('../block/promo-highlights-block'))
const CtaSectionBlock = dynamic(() => import('../block/cta-section-block'))
const LogosBlock = dynamic(() => import('../block/logos-block'))
const PortfolioGridBlock = dynamic(
  () => import('../block/portfolio-grid-block')
)
const ProfileBlock = dynamic(() => import('../block/profile-block'))
const QuickLinkBlock = dynamic(() => import('../block/quick-link-block'))
const ServicesBlock = dynamic(() => import('../block/services-block'))
const StoryBlock = dynamic(() => import('../block/story-block'))
const TestimonialsBlock = dynamic(() => import('../block/testimonials-block'))
const OptiFormsContainerData = dynamic(() => import('../forms/form-renderer'))
const EligibilitySummaryBlock = dynamic(
  () => import('../block/product-details/eligibility-summary-block')
)
const ProductHighlightsBlock = dynamic(
  () => import('../block/product-details/product-highlights-block')
)
const PersonalLoanCalculatorBlock = dynamic(
  () => import('../block/product-details/personal-loan-calculator-block')
)
const LoanInterestRatesSectionBlock = dynamic(
  () => import('../block/product-details/loan-interest-rates-section')
)
const LoanLimitGrantedSectionBlock = dynamic(
  () => import('../block/product-details/loan-limit-granted-section')
)
const LoanCalculationExamplesSectionBlock = dynamic(
  () => import('../block/product-details/loan-calculation-examples-section')
)
const LoanTermMediaGallerySectionBlock = dynamic(
  () => import('../block/product-details/loan-term-media-gallery-section')
)
const LoanInterestGroupBlock = dynamic(
  () => import('../block/product-details/loan-interest-group-block')
)
const ProductDetailsConditionsBlock = dynamic(
  () => import('../block/product-details/product-details-conditions-block')
)
const DownloadSectionBlock = dynamic(
  () => import('../block/product-details/download-section-block')
)
const ProductFaqBlock = dynamic(
  () => import('../block/product-details/product-faq-block')
)
const RequestInformationBlock = dynamic(
  () => import('../block/product-details/request-information-block')
)
const StickySideBarBlock = dynamic(
  () => import('../block/product-details/sticky-side-bar-block')
)
const ProductDetailsAnchorTabsCmsBlock = dynamic(
  () => import('../block/product-details/product-details-anchor-tabs-cms-block')
)
const ProductDetailsPageBlock = dynamic(
  () => import('../block/product-details/product-details-page-block')
)

// Map the dynamically imported blocks
export const blocks = {
  AvailabilityBlock,
  BannerStripBlock,
  CampaignBannerBlock,
  CardListingBlock,
  ContactBlock,
  CtaSectionBlock,
  HeroBlock,
  HeroBannerBlock,
  KeyFeatureBlock,
  PromoHighlightsBlock,
  LogosBlock,
  PortfolioGridBlock,
  ProfileBlock,
  QuickLinkBlock,
  ServicesBlock,
  StoryBlock,
  TestimonialsBlock,
  OptiFormsContainerData,
  EligibilitySummaryBlock,
  ProductHighlightsBlock,
  PersonalLoanCalculatorBlock,
  LoanInterestRatesSectionBlock,
  LoanLimitGrantedSectionBlock,
  LoanCalculationExamplesSectionBlock,
  LoanTermMediaGallerySectionBlock,
  LoanInterestGroupBlock,
  ProductDetailsConditionsBlock,
  DownloadSectionBlock,
  ProductFaqBlock,
  RequestInformationBlock,
  StickySideBarBlock,
  ProductDetailsAnchorTabsBlock: ProductDetailsAnchorTabsCmsBlock,
  ProductDetailsPageBlock,
} as const

export type BlockTypeName = keyof typeof blocks

export default blocksMapperFactory(blocks)
