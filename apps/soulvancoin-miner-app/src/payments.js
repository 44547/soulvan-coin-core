/**
 * Build swap links for crypto exchanges
 * @param {Object} options - Swap options
 * @param {string} options.from - Source coin symbol (default: 'btc')
 * @param {string} options.to - Destination coin symbol (default: 'ton')
 * @param {string} options.amount - Amount to swap (optional)
 * @param {string} options.toAddress - Destination address for the swap
 * @param {string} options.refundAddress - Refund address (optional)
 * @returns {Array} Array of swap link objects
 */
function buildSwapLinks({ from = 'btc', to = 'ton', amount = '', toAddress, refundAddress = '' }) {
  const links = [];

  // ChangeNOW widget URL
  const changeNowUrl = new URL('https://changenow.io/embeds/exchange-widget/v2/widget.html');
  changeNowUrl.searchParams.set('from', from.toLowerCase());
  changeNowUrl.searchParams.set('to', to.toLowerCase());
  changeNowUrl.searchParams.set('toAddress', toAddress);
  if (amount) {
    changeNowUrl.searchParams.set('amount', amount);
  }
  if (refundAddress) {
    changeNowUrl.searchParams.set('refundAddress', refundAddress);
  }
  links.push({
    name: 'ChangeNOW',
    url: changeNowUrl.toString()
  });

  // SimpleSwap URL
  const simpleSwapUrl = new URL('https://simpleswap.io/');
  const simpleSwapParams = {
    from: from.toLowerCase(),
    to: to.toLowerCase(),
    address: toAddress
  };
  if (amount) {
    simpleSwapParams.amount = amount;
  }
  // Build query string manually for SimpleSwap
  const simpleSwapQuery = Object.entries(simpleSwapParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  links.push({
    name: 'SimpleSwap',
    url: `https://simpleswap.io/?${simpleSwapQuery}`
  });

  // SideShift URL
  const sideShiftUrl = new URL('https://sideshift.ai/');
  const sideShiftParams = {
    from: from.toLowerCase(),
    to: to.toLowerCase(),
    settleAddress: toAddress
  };
  if (amount) {
    sideShiftParams.depositAmount = amount;
  }
  if (refundAddress) {
    sideShiftParams.refundAddress = refundAddress;
  }
  const sideShiftQuery = Object.entries(sideShiftParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  links.push({
    name: 'SideShift',
    url: `https://sideshift.ai/?${sideShiftQuery}`
  });

  return links;
}

module.exports = { buildSwapLinks };
