import AssetExample from './components/HomeScreen.js';
import ListLectures from './components/ListLectures.js'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect } from 'react';
import {initDB} from './storage/storage.js'
import Icon from 'react-native-vector-icons/Ionicons';
import { store } from './storage/app/store.js'
import { Provider } from 'react-redux'
const Tab = createBottomTabNavigator();
export default function App() { 
  useEffect(() => {
    initDB();
  }, []);
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Cargar Datos') {
              iconName = 'cloud-download-outline';
            } else if (route.name === 'Tiempos de lectura') {
              iconName = 'search-outline';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Tiempos de lectura" component={ListLectures} />
        <Tab.Screen name="Cargar Datos" component={AssetExample} />
      </Tab.Navigator>
    </NavigationContainer>
    </Provider>
  );
}


