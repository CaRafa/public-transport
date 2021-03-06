import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';

import Colors from '../constants/Colors';

import HomeScreen from '../screens/HomeScreen';
import RutaScreen from '../screens/RutaScreen';
import ConductorScreen from '../screens/ConductorScreen';
import TransporteScreen from '../screens/TransporteScreen';
import CreateRoute from '../screens/RouteCreationScreen';
import mapRoutes from '../screens/mapRoutesScreen';
import ParadaSetScreen from '../screens/ParadaSetScreen';
import paradasModule from '../screens/paradasModule';
import FormCP from '../screens/formCP';
import FormCR from '../screens/formCR';
import FormCT from '../screens/formCT';
import FormCC from '../screens/formCC';
import FormCH from '../screens/formCH';
import MapPreview from '../screens/MapPreview';
import DetailedTransport from '../screens/detailedTransport'
import DetailedDriver from '../screens/detailedDriver'
import detailedRouteMap from '../screens/detailedRouteMap'
import detailedRoute from '../screens/detailedRoute'
import updateC from '../screens/updateC'
import updateT from '../screens/updateT'
import updateR from '../screens/updateR'

export const RouteNavigator = StackNavigator({

  Rutas: {
    screen: RutaScreen,
  },
  paradasModule: {
    screen: paradasModule,
  },
  Parada: {
    screen: ParadaSetScreen,
  },
  MapPreview :{
    screen: MapPreview,
  },
  CreateRoute :{
    screen: CreateRoute,

  },
  detailedRouteMap :{
    screen: detailedRouteMap,

  },
  detailedRoute :{
    screen: detailedRoute,

  },
  mapRoutes :{
    screen: mapRoutes,

  },
  FormCP :{
    screen: FormCP,
  },
  FormCR :{
    screen: FormCR,
  },
  updateR: {
    screen: updateR,
  },

})
export const TransportNavigator = StackNavigator({

  Transportes: {
    screen: TransporteScreen,
  },
  FormCT: {
    screen: FormCT,
  },
  DetailedTransport: {
    screen: DetailedTransport,
  },
  FormCH: {
    screen: FormCH,
  },
  updateT: {
    screen: updateT,
  },
  
})
export const ConductorNavigator = StackNavigator({

  Conductores: {
    screen: ConductorScreen,
  },
  FormCC: {
    screen: FormCC,
  },
  
  DetailedDriver: {
    screen: DetailedDriver,
  },
  updateC: {
    screen: updateC,
  },
  
})



export default TabNavigator(
  {
    Principal: {
      screen: HomeScreen,
    },
    Transportes: {
      screen: TransportNavigator,
    },
    Rutas: {
      screen: RouteNavigator,
    },
    Propietarios: {
      screen: ConductorNavigator,
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

            case 'Propietarios':
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
