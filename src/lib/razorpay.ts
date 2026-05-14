import Razorpay from 'razorpay'

export function getRazorpayInstance() {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    throw new Error(
      `Razorpay credentials missing. keyId: ${!!keyId}, secret: ${!!keySecret}`
    )
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  })
}
