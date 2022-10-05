function formatNumber(number) {
  return number.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })
}

module.exports = formatNumber;