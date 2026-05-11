export { default } from './product-details-block'
export { EligibilitySummaryBlockFE as EligibilitySummaryBlock } from './eligibility-summary-block'
export { ProductHighlightsBlockFE as ProductHighlightsBlock } from './product-highlights-block'
export { PersonalLoanCalculatorBlockFE as PersonalLoanCalculatorBlock } from './personal-loan-calculator-block'
export { LoanCalculationExamplesSectionFE as LoanCalculationExamplesSection } from './loan-calculation-examples-section'
export { LoanInterestGroupBlockFE as LoanInterestGroupBlock } from './loan-interest-group-block'
export { LoanInterestRatesSectionFE as LoanInterestRatesSection } from './loan-interest-rates-section'
export { LoanLimitGrantedSectionFE as LoanLimitGrantedSection } from './loan-limit-granted-section'
export { ProductDetailsConditionsBlockFE as ProductDetailsConditionsBlock } from './product-details-conditions-block'
export { DownloadSectionBlockFE as DownloadSectionBlock } from './download-section-block'
export { ProductFaqBlockFE as ProductFaqBlock } from './product-faq-block'
export { RequestInformationBlockFE as RequestInformationBlock } from './request-information-block'
export { StickySideBarBlockFE as StickySideBarBlock } from './sticky-side-bar-block'
export {
  LoanTermMediaGallerySectionFE as LoanTermMediaGallerySection,
  LOAN_TERM_GALLERY_DEFAULT_ITEMS,
} from './loan-term-media-gallery-section'
export type { LoanTermMediaGallerySectionProps } from './loan-term-media-gallery-section'
export type {
  LoanTermGalleryImageItem,
  LoanTermGalleryItem,
  LoanTermGalleryVideoItem,
  LoanTermGalleryYoutubeItem,
} from '@/lib/loan-term-gallery'
export {
  getYoutubeEmbedUrl,
  getYoutubeEmbedUrlAlternate,
  getYoutubeThumbnailUrl,
  getYoutubeWatchUrl,
  parseYoutubeVideoId,
} from '@/lib/loan-term-gallery'
export type {
  PersonalLoanCalculatorBlockProps,
  ProfessionOption,
} from './personal-loan-calculator-block'
export type { ProductDetailsConditionsBlockProps } from './product-details-conditions-block'
export type {
  DownloadResourceItem,
  DownloadSectionBlockProps,
} from './download-section-block'
export type { ProductFaqBlockProps, ProductFaqItem } from './product-faq-block'
export type {
  RequestInformationBlockProps,
  RequestInformationFormValues,
} from './request-information-block'
export type { StickySideBarBlockProps } from './sticky-side-bar-block'
export { computeMonthlyInstallment, formatBahtAmount } from './personal-loan-calculator-block'
export type {
  ProductDetailsAnchorSection,
  ProductDetailsBlockProps,
  ProductDetailsConditionsInput,
  ProductDetailsDownloadSectionInput,
  ProductDetailsEligibilitySummaryInput,
  ProductDetailsFaqInput,
  ProductDetailsLoanCalculatorInput,
  ProductDetailsProductHighlightsInput,
  ProductDetailsRequestInformationInput,
  ProductDetailsStickySideBarInput,
} from './product-details-block'
export type {
  EligibilitySummaryBlockProps,
  EligibilitySummaryBullet,
  EligibilitySummaryGroup,
} from './eligibility-summary-block'
export type {
  ProductHighlightIconLayer,
  ProductHighlightIconPreset,
  ProductHighlightRow,
  ProductHighlightTile,
  ProductHighlightsBlockProps,
} from './product-highlights-block'
