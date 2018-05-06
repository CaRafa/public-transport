import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';

import Colors from '../constants/Colors';

import HomeScreen from '../screens/HomeScreen';
import ParadaScreen from '../screens/ParadaScreen';
import RutaScreen from '../screens/RutaScreen';
import ConductorScreen from '../screens/ConductorScreen';
import TransporteScreen from '../screens/TransporteScreen';
import MapPreview from '../screens/MapPreview';
import CreateRoute from '../screens/RouteCreationScreen';
import mapRoutes from '../screens/mapRoutesScreen';
import testScreen from '../screens/testScreen';


export const RouteNavigator = StackNavigator({

  Rutas: {
    screen: RutaScreen,
  },
  Parada: {
    screen: testScreen,
  },
  MapPreview :{
    screen: MapPreview,

  },
  CreateRoute :{
    screen: CreateRoute,

  },
  mapRoutes :{
    screen: mapRoutes,

  },

})



export default TabNavigator(
  {
    Principal: {
      screen: HomeScreen,
    },
    Transportes: {
      screen: TransporteScreen,
    },
    Rutas: {
      screen: RouteNavigator,
    },
    Conductores: {
      screen: ConductorScreen,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Principal':
            iconName =
              Platform.OS === 'ios'
                ? `ios-clipboard${focused ? '' : '-outline'}`
                : 'md-clipboard';
            break;
            case 'Transportes':
            iconName =
              Platform.OS === 'ios'
                ? `ios-bus${focused ? '' : '-outline'}`
                : 'md-bus';
            break;
            case 'Rutas':
            iconName =
              Platform.OS === 'ios'
                ? `ios-navigate${focused ? '' : '-outline'}`
                : 'md-locate';
            break;

            case 'Conductores':
            iconName =
              Platform.OS === 'ios'
                ? `ios-man${focused ? '' : '-outline'}`
                : 'md-person';
            break;
          
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3, width: 25 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);
