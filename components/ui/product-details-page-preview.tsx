import { CampaignBannerBlockFE } from '@/components/block/campaign-banner-block'
import ProductDetailsBlock from '@/components/block/product-details'

export function ProductDetailsPagePreview() {
  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <CampaignBannerBlockFE
        title="Krungthai Thanawat Loan"
        subtitle="Enjoy high limits and zero collateral with interest calculated on your actual usage."
        desktopImageSrc="/assets/images/PDP_campaign_banner_desktop_v1.png"
        mobileImageSrc="/assets/images/PDP_campaign_banner_mobile_v1.png"
      />
      <ProductDetailsBlock />
    </main>
  )
}
