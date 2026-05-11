export const generateReferenceNumber = () => {
  const year = new Date().getFullYear()

  const random = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, '0')

  return `KTB-${year}-${random}`
}