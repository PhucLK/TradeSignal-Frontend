import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, Platform, StatusBar as RNStatusBar, SafeAreaView, TouchableOpacity, Animated, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen, RegisterScreen } from '../screens/AuthScreens';
import { fetchCryptoData } from '../services/CryptoService';
import { calculateRSI, calculateMACD } from '../utils/IndicatorUtils';
import axios from 'axios';

const Stack = createStackNavigator();

export default function App() {
  const [cryptoData, setCryptoData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [watchList, setWatchList] = useState([]);

  useEffect(() => {
    const mainCoins = ['BTC', 'ETH', 'SOL', 'DOT', 'LINK', 'ROSE', 'DOGE', 'ADA'];

    const fetchMainCoins = async () => {
      try {
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price');
        const filteredCoins = response.data.filter((item) =>
          mainCoins.includes(item.symbol.replace('USDT', ''))
        );
        const formattedData = filteredCoins.map((item) => ({
          id: item.symbol,
          name: item.symbol.replace('USDT', ''),
          current_price: parseFloat(item.price),
        }));
        setCryptoData(formattedData);
      } catch (error) {
        console.error('Error fetching main coins:', error);
      }
    };

    fetchMainCoins();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get('https://api.binance.com/api/v3/ticker/price');
      const filteredResults = response.data.filter((item) =>
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching for coins:', error);
    }
  };

  function toggleFavorite(item) {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.id === item.id)) {
        return prevFavorites.filter((fav) => fav.id !== item.id);
      } else {
        return [...prevFavorites, item];
      }
    });
  }

  const toggleWatchList = (item) => {
    setWatchList((prevWatchList) => {
      if (prevWatchList.some((coin) => coin.id === item.id)) {
        return prevWatchList.filter((coin) => coin.id !== item.id);
      } else {
        return [...prevWatchList, item];
      }
    });
  };

  function HomeScreen({ navigation }) {
    const [animationValues, setAnimationValues] = useState({});

    const toggleFavorite = (item) => {
      setFavorites((prevFavorites) => {
        const isFavorite = prevFavorites.some((fav) => fav.id === item.id);

        // Initialize animation value for the specific item if not already set
        if (!animationValues[item.id]) {
          setAnimationValues((prev) => ({ ...prev, [item.id]: new Animated.Value(1) }));
        }

        // Trigger animation for the specific item
        Animated.sequence([
          Animated.timing(animationValues[item.id] || new Animated.Value(1), {
            toValue: 1.5,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(animationValues[item.id] || new Animated.Value(1), {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();

        if (isFavorite) {
          return prevFavorites.filter((fav) => fav.id !== item.id);
        } else {
          return [...prevFavorites, item];
        }
      });
    };

    const sortedData = [
      ...cryptoData.filter((item) => favorites.some((fav) => fav.id === item.id)), // Favorites first
      ...cryptoData.filter((item) => !favorites.some((fav) => fav.id === item.id)), // Non-favorites
    ];

    return (
      <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Crypto Signal Tracker</Text>
      <TextInput
      style={styles.searchInput}
      placeholder="Search for a coin"
      value={searchQuery}
      onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
      data={searchResults.length > 0 ? searchResults : sortedData} // Use sorted data
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
      <View style={styles.cryptoItem}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={styles.cryptoName}>{item.name}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => toggleFavorite(item)}>
        <Animated.Text
          style={{
            color: favorites.some((fav) => fav.id === item.id) ? 'red' : 'gray',
            transform: [{ scale: animationValues[item.id] || 1 }],
          }}
        >
          {favorites.some((fav) => fav.id === item.id) ? '❤️' : '🤍'}
        </Animated.Text>
      </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => toggleWatchList(item)} style={{ marginLeft: 10 }}>
            <Text style={{ color: watchList.some((coin) => coin.id === item.id) ? 'blue' : 'gray' }}>
        📌
            </Text>
            </TouchableOpacity> */}
      </View>
      </View>
      <Text style={styles.cryptoPrice}>Price: ${item.current_price}</Text>
      <Text style={styles.cryptoIndicator}>{calculateRSI(item.sparkline_in_7d?.price || [])}</Text>
      <Text style={styles.cryptoIndicator}>{calculateMACD(item.sparkline_in_7d?.price || [])}</Text>
      </View>
      )}
      />
      <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  function ProfileScreen({ navigation, setIsLoggedIn }) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>User Profile</Text>
        <Text>Welcome to your profile!</Text>
        <Text style={styles.header}>Favorites</Text>
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cryptoItem}>
              <Text style={styles.cryptoName}>{item.name}</Text>
              <Text style={styles.cryptoPrice}>Price: ${item.current_price}</Text>
            </View>
          )}
        />
        <TouchableOpacity
          onPress={() => {
            setIsLoggedIn(false); // Log out the user
            navigation.navigate('Login'); // Navigate back to the Login screen
          }}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate(isLoggedIn ? 'Profile' : 'Login')}
                style={{ marginRight: 15 }}
              >
                <Text style={{ color: '#000080', fontWeight: 'bold' }}>{isLoggedIn ? 'Profile' : 'Login'}</Text>
              </TouchableOpacity>
            ),
            headerLeft: () => null, // Remove the back symbol after login
            headerShown: isLoggedIn, // Hide the header when logged out
          })}
        />
        <Stack.Screen 
          name="Login" 
          component={(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />} 
          options={{ headerShown: false }} // Hide header for Login screen
        />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Profile" component={(props) => <ProfileScreen {...props} setIsLoggedIn={setIsLoggedIn} />} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Light blue background
    padding: 25,
    paddingTop: Platform.OS === 'ios' ? RNStatusBar.currentHeight || 44 : RNStatusBar.currentHeight,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000080', // Navy blue text for header
  },
  cryptoItem: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#ADD8E6', // Lighter blue for items
  },
  cryptoName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00008B', // Dark blue for coin names
  },
  cryptoPrice: {
    color: '#4682B4', // Steel blue for prices
  },
  cryptoIndicator: {
    color: '#5F9EA0', // Cadet blue for indicators (RSI, MACD)
  },
  loginButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20, // Adjust for iOS status bar
    right: 20,
    backgroundColor: '#000080', // Navy blue background for visibility
    padding: 10,
    borderRadius: 5,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF', // White text for contrast
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#FF4500', // Red-Orange background for logout
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF', // White text for contrast
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF', // White background for search input
  },
});