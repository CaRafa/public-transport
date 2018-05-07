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
    this.object = state.params;
    console.log('parada que llega en mapreview', this.object);

   }
   
 
 

  render() {

    

    return (
        <MapView
        style={{ flex: 1 }}
        initialRegion={{
            latitude: this.object.coords.latitude,
            longitude: this.object.coords.longitude,
            latitudeDelta: this.object.coords.latitudeDelta,
            longitudeDelta: this.object.coords.longitudeDelta,
          }}
        
        annotations={this.markers}

        >
        
        {this.object.type == true ? <MapView.Marker
                    
                    coordinate={{latitude: this.object.coords.latitude,
                    longitude: this.object.coords.longitude}}
                    pinColor={'blue'}
                 /> : <MapView.Marker
                 
                 coordinate={{latitude: this.object.coords.latitude,
                 longitude: this.object.coords.longitude}}
                 />  }

        </MapView>
    );
  }

}

const styles = StyleSheet.create({
 
});