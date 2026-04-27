export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  let number = digits
  if (digits.length === 12 && digits.startsWith('91')) {
    number = digits.slice(2)
  } else if (digits.length === 11 && digits.startsWith('0')) {
    number = digits.slice(1)
  }
  if (number.length === 10) {
    return `+91 ${number.slice(0, 5)} ${number.slice(5)}`
  }
  return `+91 ${number}`
}
