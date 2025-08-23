import {AppRegistry} from 'react-native';
import App from './App';
import mobileAds from 'react-native-google-mobile-ads';
import {name as appName} from './app.json';

mobileAds().initialize();

AppRegistry.registerComponent(appName, () => App);
