import { Button } from '@/components/ui/button'
import { GlobalIcon } from '@/components/ui/global-icon'
import { TextLink } from '@/components/ui/text-link'
import { Accordion } from '@/components/ui/accordion'
import { AnchorTabs, Tabs } from '@/components/ui/tabs'
import { PaginationPreviewDemos } from '@/components/ui/pagination-preview-demos'

type PreviewHierarchy = 'primary' | 'secondary'
type PreviewSize = 'lg' | 'sm'

function MatrixSection({
  title,
  hierarchy,
  inverse,
}: {
  title: string
  hierarchy: PreviewHierarchy
  inverse?: boolean
}) {
  const combos: Array<{ size: PreviewSize; withIcon: boolean; label: string }> = [
    { size: 'lg', withIcon: false, label: 'Large / text' },
    { size: 'lg', withIcon: true, label: 'Large / icon-right' },
    { size: 'sm', withIcon: false, label: 'Small / text' },
    { size: 'sm', withIcon: true, label: 'Small / icon-right' },
  ]

  return (
    <section className={inverse ? 'rounded-[var(--radius-lg,16px)] bg-[var(--brand-tertiary-1)] p-5' : ''}>
      <h3 className={`type-heading-h4 mb-4 ${inverse ? 'text-white' : ''}`}>{title}</h3>
      <div className="space-y-4">
        {combos.map((combo) => (
          <div key={combo.label}>
            <p className={`type-label-small-medium mb-2 ${inverse ? 'text-white' : 'text-neutral-500'}`}>
              {combo.label}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                hierarchy={hierarchy}
                inverse={inverse}
                size={combo.size}
                icon={
                  combo.withIcon ? (
                    <GlobalIcon type="arrow-right" size={combo.size === 'lg' ? 'L' : 'S'} />
                  ) : undefined
                }
                iconPosition="right"
              >
                Button
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function UiPreviewContent() {
  const textLinkStates = ['active', 'hover', 'pressed', 'disabled'] as const

  return (
    <main className="mx-auto max-w-7xl p-6 md:p-10">
      <section className="mb-10">
        <h1 className="type-heading-h1 mb-3">Global Base Components Preview</h1>
        <p className="type-body-base-regular text-neutral-500">
          This route is standalone and does not fetch CMS content.
        </p>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="type-heading-h3">Typography</h2>
        <p className="type-heading-display">Display Heading</p>
        <p className="type-heading-h2">Heading H2</p>
        <p className="type-body-large-regular">Body Large Regular text sample.</p>
        <p className="type-body-base-medium">Body Base Medium text sample.</p>
        <p className="type-label-default">Label Default sample.</p>
      </section>

      <section className="space-y-8">
        <h2 className="type-heading-h3">Buttons (Figma Matrix)</h2>
        <div className="grid gap-8">
          <MatrixSection title="Primary" hierarchy="primary" />
          <MatrixSection title="Primary Inverse" hierarchy="primary" inverse />
          <MatrixSection title="Secondary" hierarchy="secondary" />
          <MatrixSection title="Secondary Inverse" hierarchy="secondary" inverse />
        </div>
      </section>

      <section className="mt-12 space-y-6">
        <h2 className="type-heading-h3">Text Links (Figma Matrix)</h2>

        <div className="space-y-3">
          <h3 className="type-label-default">Small / Non-inverse</h3>
          <div className="flex flex-wrap gap-4">
            {textLinkStates.map((state) => (
              <TextLink
                key={`tl-s-r-${state}`}
                state={state}
                size="S"
                icon={<GlobalIcon type="arrow-right" size="S" />}
                iconPosition="right"
                href="#"
              >
                Text link
              </TextLink>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {textLinkStates.map((state) => (
              <TextLink
                key={`tl-s-l-${state}`}
                state={state}
                size="S"
                icon={<GlobalIcon type="arrow-right" size="S" />}
                iconPosition="left"
                href="#"
              >
                Text link
              </TextLink>
            ))}
          </div>
        </div>

        <div className="rounded-[var(--radius-lg,16px)] bg-[var(--brand-tertiary-1)] p-5 space-y-3">
          <h3 className="type-label-default text-white">Small / Inverse</h3>
          <div className="flex flex-wrap gap-4">
            {textLinkStates.map((state) => (
              <TextLink
                key={`tl-s-ri-${state}`}
                state={state}
                inverse
                size="S"
                icon={<GlobalIcon type="arrow-right" size="S" />}
                iconPosition="right"
                href="#"
              >
                Text link
              </TextLink>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {textLinkStates.map((state) => (
              <TextLink
                key={`tl-s-li-${state}`}
                state={state}
                inverse
                size="S"
                icon={<GlobalIcon type="arrow-right" size="S" />}
                iconPosition="left"
                href="#"
              >
                Text link
              </TextLink>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="type-label-default">Large / Non-inverse</h3>
          <div className="flex flex-wrap gap-4">
            {textLinkStates.map((state) => (
              <TextLink
                key={`tl-l-r-${state}`}
                state={state}
                size="L"
                icon={<GlobalIcon type="arrow-right" size="L" />}
                iconPosition="right"
                href="#"
              >
                Text link
              </TextLink>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {textLinkStates.map((state) => (
              <TextLink
                key={`tl-l-l-${state}`}
                state={state}
                size="L"
                icon={<GlobalIcon type="arrow-right" size="L" />}
                iconPosition="left"
                href="#"
              >
                Text link
              </TextLink>
            ))}
          </div>
        </div>

        <div className="rounded-[var(--radius-lg,16px)] bg-[var(--brand-tertiary-1)] p-5 space-y-3">
          <h3 className="type-label-default text-white">Large / Inverse</h3>
          <div className="flex flex-wrap gap-4">
            {textLinkStates.map((state) => (
              <TextLink
                key={`tl-l-ri-${state}`}
                state={state}
                inverse
                size="L"
                icon={<GlobalIcon type="arrow-right" size="L" />}
                iconPosition="right"
                href="#"
              >
                Text link
              </TextLink>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {textLinkStates.map((state) => (
              <TextLink
                key={`tl-l-li-${state}`}
                state={state}
                inverse
                size="L"
                icon={<GlobalIcon type="arrow-right" size="L" />}
                iconPosition="left"
                href="#"
              >
                Text link
              </TextLink>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 space-y-6">
        <h2 className="type-heading-h3">Accordion</h2>
        <Accordion
          items={[
            {
              id: 'collapsed',
              title: 'How do debit cards differ from credit cards?',
              content:
                'While both debit and credit cards can be used to purchase goods and services, they differ significantly in their payment methods.',
            },
            {
              id: 'expanded',
              title: 'How do debit cards differ from credit cards?',
              content: (
                <>
                  <p>
                    While both debit and credit cards can be used to purchase
                    goods and services, they differ significantly in their
                    payment methods. Debit cards deduct funds immediately from
                    the linked savings account, allowing you to spend only the
                    amount available in your account, making it easier to
                    control spending and avoid debt.
                  </p>
                  <p>
                    Credit cards, on the other hand, utilize a pre-approved
                    credit limit from the bank, payable in a later billing
                    cycle. Incomplete payments may incur interest. Therefore,
                    debit cards are suitable for those who prefer electronic
                    cash payments, while credit cards are ideal for those
                    seeking payment flexibility and additional benefits such as
                    installment plans or reward points.
                  </p>
                </>
              ),
            },
          ]}
          defaultOpenIds={['expanded']}
        />
      </section>

      <section className="mt-12 space-y-6">
        <h2 className="type-heading-h3">Tabs</h2>
        <p className="type-body-base-regular text-neutral-500 max-w-2xl">
          Tab rows use horizontal overflow with scrollbars hidden. On narrow viewports, drag the tab strip
          (pointer or touch) to reveal more tabs. Each example includes panels that swap with the active tab.
        </p>

        <div className="space-y-3">
          <h3 className="type-label-default">Product tabs (full width, mobile-first)</h3>
          <Tabs
            showPanels
            items={[
              {
                id: 'highlights',
                label: 'Highlights',
                content: (
                  <p>
                    Overview of this product: key benefits, eligibility, and how to get started in a few
                    steps.
                  </p>
                ),
              },
              {
                id: 'loan-calculator',
                label: 'Loan Calculator',
                content: (
                  <p>
                    Estimate monthly payments by adjusting amount, term, and rate. Results are illustrative
                    only.
                  </p>
                ),
              },
              {
                id: 'interest-rates',
                label: 'Interest Rates',
                content: (
                  <p>
                    Published reference rates and how they apply to this product. Rates may change without
                    notice.
                  </p>
                ),
              },
              {
                id: 'protection',
                label: 'Protection Agreement',
                content: (
                  <p>
                    Summary of optional protection coverage, exclusions, and how to file a claim.
                  </p>
                ),
              },
              {
                id: 'downloads',
                label: 'Download Resources',
                content: (
                  <p>
                    PDFs and forms related to this product, including terms and disclosure schedules.
                  </p>
                ),
              },
              {
                id: 'faq',
                label: 'FAQ',
                content: (
                  <p>
                    Common questions about fees, limits, and account servicing for this product line.
                  </p>
                ),
              },
            ]}
            defaultActiveId="highlights"
          />
        </div>

        <div className="space-y-3">
          <h3 className="type-label-default">Many tabs (overflow + drag on small screens)</h3>
          <Tabs
            showPanels
            items={[
              {
                id: 't1',
                label: 'Everyday Banking',
                content: <p>Accounts and transfers for day-to-day money movement.</p>,
              },
              {
                id: 't2',
                label: 'Savings & Goals',
                content: <p>Set savings targets and automated rules to reach them.</p>,
              },
              {
                id: 't3',
                label: 'Cards & Rewards',
                content: <p>Debit and credit cards, reward tiers, and redemption options.</p>,
              },
              {
                id: 't4',
                label: 'Loans & Mortgages',
                content: <p>Personal loans, home loans, and refinancing in one place.</p>,
              },
              {
                id: 't5',
                label: 'Investments',
                content: <p>Funds, portfolios, and risk profiles aligned to your horizon.</p>,
              },
              {
                id: 't6',
                label: 'Insurance & Protection',
                content: <p>Coverage types, premiums, and how claims are handled.</p>,
              },
              {
                id: 't7',
                label: 'Business Banking',
                content: <p>Payroll, invoicing, and credit lines for small businesses.</p>,
              },
              {
                id: 't8',
                label: 'International & FX',
                content: <p>Cross-border payments and foreign exchange tools.</p>,
              },
              {
                id: 't9',
                label: 'Security Center',
                content: <p>Alerts, device management, and fraud reporting.</p>,
              },
              {
                id: 't10',
                label: 'Support & Branches',
                content: <p>Contact options, hours, and branch locator.</p>,
              },
            ]}
            defaultActiveId="t1"
          />
        </div>
      </section>

      <section className="mt-12 space-y-6">
        <h2 className="type-heading-h3">Anchor tabs</h2>
        <p className="type-body-base-regular text-neutral-500 max-w-2xl">
          Same visual style as Tabs, but each control is a link to an in-page section. Clicking scrolls
          smoothly; the underline follows the section that is most in view while you scroll. Section{' '}
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-sm">id</code> values must match{' '}
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-sm">sectionId</code> on each item.
        </p>

        <AnchorTabs
          ariaLabel="Anchor tab demo sections"
          items={[
            { sectionId: 'preview-anchor-overview', label: 'Overview' },
            { sectionId: 'preview-anchor-details', label: 'Details' },
            { sectionId: 'preview-anchor-faq', label: 'FAQ' },
            { sectionId: 'preview-anchor-contact', label: 'Contact' },
          ]}
        />

        <div
          id="preview-anchor-overview"
          className="scroll-mt-28 min-h-[45vh] space-y-3 rounded-[var(--radius-lg,16px)] border border-neutral-200 bg-[var(--neutral-050,#f7f7f7)] p-6"
        >
          <h3 className="type-heading-h4">Overview</h3>
          <p className="type-body-base-regular text-neutral-600 max-w-prose">
            This block is the first scroll target. Use the strip above to jump here or to other sections.
            On small screens you can still drag the strip horizontally when labels overflow.
          </p>
        </div>

        <div
          id="preview-anchor-details"
          className="scroll-mt-28 space-y-3 rounded-[var(--radius-lg,16px)] border border-neutral-200 bg-white p-6 min-h-[45vh]"
        >
          <h3 className="type-heading-h4">Details</h3>
          <p className="type-body-base-regular text-neutral-600 max-w-prose">
            Second section. Anchor tabs update the URL hash (for example when you want shareable deep
            links) and keep the active tab aligned with what you are reading.
          </p>
        </div>

        <div
          id="preview-anchor-faq"
          className="scroll-mt-28 min-h-[45vh] space-y-3 rounded-[var(--radius-lg,16px)] border border-neutral-200 bg-[var(--neutral-050,#f7f7f7)] p-6"
        >
          <h3 className="type-heading-h4">FAQ</h3>
          <p className="type-body-base-regular text-neutral-600 max-w-prose">
            Third section. If you use a sticky site header, add <code className="rounded bg-neutral-100 px-1 py-0.5 text-sm">scroll-margin-top</code> on these targets (this demo uses Tailwind{' '}
            <code className="rounded bg-neutral-100 px-1 py-0.5 text-sm">scroll-mt-28</code>) so titles are not hidden under the bar.
          </p>
        </div>

        <div
          id="preview-anchor-contact"
          className="scroll-mt-28 space-y-3 rounded-[var(--radius-lg,16px)] border border-neutral-200 bg-white p-6 min-h-[35vh]"
        >
          <h3 className="type-heading-h4">Contact</h3>
          <p className="type-body-base-regular text-neutral-600 max-w-prose">
            Last demo section. Scroll back up: the anchor strip should highlight whichever block occupies the
            observer band in the viewport.
          </p>
        </div>
      </section>

      <PaginationPreviewDemos />
    </main>
  )
}

