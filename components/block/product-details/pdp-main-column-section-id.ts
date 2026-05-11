/** First block with this anchor id wins (several loan blocks share `pdp-interest-rates`). */
export function pdpMainColumnSectionId(
  typename: string | null | undefined
): string | undefined {
  switch (typename) {
    case 'ProductHighlightsBlock':
      return 'pdp-highlights'
    case 'PersonalLoanCalculatorBlock':
      return 'pdp-loan-calculator'
    case 'LoanInterestRatesSectionBlock':
    case 'LoanLimitGrantedSectionBlock':
    case 'LoanCalculationExamplesSectionBlock':
    case 'LoanTermMediaGallerySectionBlock':
    case 'LoanInterestGroupBlock':
      return 'pdp-interest-rates'
    case 'ProductDetailsConditionsBlock':
      return 'pdp-protection-agreement'
    case 'DownloadSectionBlock':
      return 'pdp-download-resources'
    case 'ProductFaqBlock':
      return 'pdp-faq'
    default:
      return undefined
  }
}
