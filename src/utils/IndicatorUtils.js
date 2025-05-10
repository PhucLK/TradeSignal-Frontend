export const calculateRSI = (prices, period = 14) => {
  if (prices.length < period) return 'Not enough data';

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 'RSI: 100';

  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);

  return `RSI: ${rsi.toFixed(2)}`;
};

export const calculateMACD = (prices, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) => {
  if (prices.length < longPeriod) return 'Not enough data';

  const calculateEMA = (data, period) => {
    const multiplier = 2 / (period + 1);
    return data.reduce((acc, price, index) => {
      if (index === 0) return price; // First EMA is the first price
      return price * multiplier + acc * (1 - multiplier);
    });
  };

  const shortEMA = calculateEMA(prices.slice(-shortPeriod), shortPeriod);
  const longEMA = calculateEMA(prices.slice(-longPeriod), longPeriod);
  const macd = shortEMA - longEMA;

  const signalLine = calculateEMA(prices.slice(-signalPeriod), signalPeriod);

  return `MACD: ${macd.toFixed(2)}, Signal: ${signalLine.toFixed(2)}`;
};