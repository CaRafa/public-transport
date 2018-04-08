import React from 'react';
import {Button,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,} from 'react-native';
import { MapView } from 'expo';


export default class MapPreview extends React.Component {

  
  static navigationOptions = {
    header: null,
  };

  constructor(props){ 
    super(props)
    const {state} = props.navigation;
    this.coordenadas = state.params;

    this.markers = [
        {
            latitude: this.coordenadas.latitude,
            longitude:this.coordenadas.longitude,
            title: 'Parada 1',
            subtitle: ' casa'
        }
    ]

   }
   
 
 

  render() {

    

    return (
        <MapView
        style={{ flex: 1 }}
        initialRegion={{
            latitude: this.coordenadas.latitude,
            longitude: this.coordenadas.longitude,
            latitudeDelta: this.coordenadas.latitudeDelta,
            longitudeDelta: this.coordenadas.longitudeDelta,
          }}
        
        annotations={this.markers}

        >
         <MapView.Marker
            coordinate={{latitude: this.coordenadas.latitude,
            longitude: this.coordenadas.longitude}}
            title={"Parada 1"}
            description={"casa"}
         /> 

        </MapView>
    );
  }

}

const styles = StyleSheet.create({
 
});