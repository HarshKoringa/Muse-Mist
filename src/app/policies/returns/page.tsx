import PolicyLayout, { PolicySection, PolicyList } from '@/components/PolicyLayout'

export default function ReturnsPage() {
  return (
    <PolicyLayout
      title="Return & Replacement Policy"
      subtitle="We stand behind every product we ship."
      lastUpdated="April 2026"
    >

      <PolicySection title="Cancellation Policy">
        <p>Your order cannot be cancelled once placed and processed.
        Muse &amp; Mist does not accommodate cancellations or refunds based
        on a change of mind once the order has entered the processing or
        shipment phase.</p>
        <p>If you require a change in shipping address or contact information
        post-purchase, you must notify us at{' '}
        <a href="mailto:support@museandmist.com" className="text-[#1A237E] underline underline-offset-2">support@museandmist.com</a>.
        These modifications can only be accommodated within 48 hours of
        order placement or prior to dispatch, whichever occurs earlier.
        Once an order has been dispatched, no further modifications can
        be executed.</p>
      </PolicySection>

      <PolicySection title="Return & Replacement Eligibility">
        <p>Products purchased from Muse &amp; Mist (an HRK Wellness LLP brand)
        are eligible for return, replacement, or exchange within the
        applicable window if the item is received in a physically damaged
        condition or differs significantly from the product description.</p>
        <p>A request for return or replacement must be submitted in writing
        within <strong>48 hours of delivery</strong>, subject to the
        following conditions:</p>
        <PolicyList items={[
          'It is verified that the product sustained damage during transit or the delivery process.',
          "The product is returned in its original condition, including the brand/manufacturer's box, original sales receipt, and all associated accessories.",
        ]} />
      </PolicySection>

      <PolicySection title="How to Submit a Return Request">
        <p>An email must be sent from your registered email ID to{' '}
        <a href="mailto:support@museandmist.com" className="text-[#1A237E] underline underline-offset-2">support@museandmist.com</a>{' '}
        referencing your Invoice Number and including:</p>
        <PolicyList items={[
          'Clear photographic and video evidence of the damaged product, including any leakage or spillage, the mono-carton, and outer packaging. A continuous unboxing video is mandatory to evidence damage, leakage, or spillage.',
          'In cases of missing products, incorrect deliveries, or weight discrepancies, clear unboxing video clippings and images of the open package and all received contents are required.',
          'Following receipt of these details, a minimum of 5 working days is required for internal investigation and resolution.',
          'Approvals for returns are at the sole discretion of the Muse & Mist team based on the evidence provided.',
          'Approved exchanges must be returned in the identical condition and packaging as received.',
          'Upon receipt at our warehouse, a quality and weight validation check will be conducted. Replacements or exchanges will be processed within 48–72 hours of successful validation, and new tracking details will be provided via email.',
        ]} />
      </PolicySection>

      <PolicySection title="Ingredient & Safety Disclaimer">
        <p>HRK Wellness LLP is not liable for individual physiological
        reactions to specific ingredients. Each product description on our
        website includes a comprehensive list of key ingredients. Individuals
        with known sensitivities or allergies to any listed ingredient should
        refrain from use.</p>
        <p>We strongly advise conducting an allergy patch test prior to use.
        If irritation occurs, discontinue use immediately and consult a physician.</p>
      </PolicySection>

    </PolicyLayout>
  )
}
