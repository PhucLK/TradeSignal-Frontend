import axios from 'axios';

export const fetchCryptoData = async (setCryptoData) => {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/price'); // Fetch current prices for all symbols
    const formattedData = response.data
      .map((item) => ({
        id: item.symbol,
        name: item.symbol,
        current_price: parseFloat(item.price),
      }))
      .sort((a, b) => b.current_price - a.current_price); // Sort by price descending
    setCryptoData(formattedData);
  } catch (error) {
    console.error('Error fetching crypto data from Binance:', error);
  }
};