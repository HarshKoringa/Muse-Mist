import PolicyLayout, { PolicySection, PolicyList } from '@/components/PolicyLayout'

export default function RefundsPage() {
  return (
    <PolicyLayout
      title="Refund Policy"
      subtitle="Honest, transparent, and fair."
      lastUpdated="April 2026"
    >

      <PolicySection title="When Refunds Are Authorized">
        <p>Returns and refunds will only be authorized for products that
        have sustained damage during transit, possess physical manufacturing
        defects, or in the event an incorrect product has been dispatched.</p>
        <p>To initiate a request, an email containing a mandatory unboxing
        video of the damaged or incorrect product must be submitted to{' '}
        <a href="mailto:support@museandmist.com" className="text-[#1A237E] underline underline-offset-2">support@museandmist.com</a>{' '}
        within 48 hours of delivery.</p>
      </PolicySection>

      <PolicySection title="Conditions for Rejection">
        <p>Returns will strictly not be accepted under the following conditions:</p>
        <PolicyList items={[
          'The product has been used or the safety seal has been broken.',
          'The serial number or batch code has been tampered with or is missing.',
          'The request is based on a change of mind rather than a physical defect or error.',
        ]} />
        <p>Upon receipt of the returned item, HRK Wellness LLP will conduct
        a formal inspection to validate the claim.</p>
      </PolicySection>

      <PolicySection title="Refund Timelines">
        <PolicyList items={[
          'Approved Returns: Once a return is approved as an eligible claim, a replacement will be issued.',
          'Ineligible Returns: If a product is determined to be ineligible for return following inspection, the item will be couriered back to the customer at their own expense.',
          'Online Payments (Prepaid): For approved refunds on prepaid orders, the amount will be credited back to the original source — Debit/Credit Card, Bank, or Wallet — within 7 working days of approval.',
          'COD Orders: For Cash on Delivery orders, refunds will be processed via bank transfer to your provided account details within 14 working days of refund request approval.',
        ]} />
      </PolicySection>

      <PolicySection title="Loss, Spillage, and Physical Damage">
        <PolicyList items={[
          'Total Loss: In instances of verified product loss such as significant spillage or breakage of the container, Muse & Mist will facilitate a product replacement.',
          'Cosmetic Damage: Minor physical damage to external packaging that does not affect the integrity or safety of the product inside — such as a dent, scratch, or minor scuff — will not be eligible for return or refund.',
        ]} />
      </PolicySection>

      <PolicySection title="Pre-Purchase Advice">
        <p>For any queries regarding product specifications, usage instructions,
        or suitability, we strongly advise consulting our expert team via
        Instagram (@museandmist.skin) or email (support@museandmist.com)
        prior to placing an order.</p>
        <p>Muse &amp; Mist does not offer refunds for products that do not meet
        personal subjective expectations if the product matches the description
        provided on our website.</p>
      </PolicySection>

      <PolicySection title="Ingredient Safety & Medical Disclaimer">
        <p>HRK Wellness LLP is not responsible for individual physiological
        reactions to any specific ingredient. Every product description
        includes a comprehensive ingredient list. Individuals with known
        sensitivities or allergies to any listed component should refrain
        from use. Always perform an allergy patch test. If irritation occurs,
        discontinue use immediately and consult a physician.</p>
      </PolicySection>

    </PolicyLayout>
  )
}
