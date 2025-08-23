import React from 'react';
import {View, Text} from 'react-native';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';

const Calculator = () => {
  return (
    <View style={{padding:16}}>
      <Text>Calculator UI</Text>
    </View>
  );
};

const App = () => {
  return (
    <View style={{flex:1}}>
      <BannerAd unitId="ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx" size={BannerAdSize.BANNER} />
      <Calculator />
    </View>
  );
};

export default App;
