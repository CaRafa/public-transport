import React from 'react';
import {Button,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View
} from 'react-native';
import { MapView  } from 'expo';
import Polyline from '@mapbox/polyline';
import { Ionicons } from '@expo/vector-icons';

export default class mapRoutes extends React.Component {

  
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  constructor(props){ 
    super(props)
    const {state} = props.navigation;
    this.coordenadas = state.params;
    this.actual = this.coordenadas.actual;
    this.polylines = this.coordenadas.polylines;
    console.log('this.polyline', this.polylines);
    this.paradas = this.coordenadas.paradas;
   }

   
   
   
  render() {


    return (
        <MapView
        style={{ flex: 1 }}
        initialRegion={{
            latitude: this.actual.latitude,
            longitude: this.actual.longitude,
            latitudeDelta: this.actual.latitudeDelta,
            longitudeDelta: this.actual.longitudeDelta,
          }}
        
        annotations={this.markers}
        >
        
        { !this.polylines ? null
                        :
            <View>
            {
            this.polylines.map(el => 
              el.type == "Urb" ?el.route.map(ele =>           
                                <MapView.Polyline
                                key={el._id}
                                coordinates={ele}
                                strokeColor="#4286f4"
                                fillColor="rgba(255,0,0,0.5)"
                                strokeWidth={6}/>   
            ) : el.type == "subUrb" ?  el.route.map(ele =>           
                                    <MapView.Polyline
                                    key={el._id}
                                    coordinates={ele}
                                    strokeColor="#f4f141"
                                    fillColor="rgba(255,0,0,0.5)"
                                    strokeWidth={3}/>   ) :  
                        el.route.map(ele =>           
                        <MapView.Polyline
                        key={el._id}
                        coordinates={ele}
                        strokeColor="#d82b48"
                        fillColor="rgba(255,0,0,0.5)"
                        strokeWidth={1}/>   )
          
          )}
            </View>
            }
           {
              this.paradas.map(el => 
                el.type == true ? <MapView.Marker
                    key={el._id}
                    coordinate={{latitude: el.coordinates.latitude,
                    longitude: el.coordinates.longitude}}
                    pinColor={'black'}
                 /> : 
                 el.density == "D1"?
                 <MapView.Marker
                 key={el._id}
                 coordinate={{latitude: el.coordinates.latitude,
                 longitude: el.coordinates.longitude}}
                 pinColor={'red'}
                />  
                : 
                 el.density == "D2"?
                 <MapView.Marker
                 key={el._id}
                 coordinate={{latitude: el.coordinates.latitude,
                 longitude: el.coordinates.longitude}}
                 pinColor={'orange'}
                />  
                : 
                 el.density == "D3"?
                 <MapView.Marker
                 key={el._id}
                 coordinate={{latitude: el.coordinates.latitude,
                 longitude: el.coordinates.longitude}}
                 pinColor={'yellow'}
                />  
                : 
                 el.density == "D4"?
                 <MapView.Marker
                 key={el._id}
                 coordinate={{latitude: el.coordinates.latitude,
                 longitude: el.coordinates.longitude}}
                 pinColor={'green'}
                />  
                : 
                 el.density == "D5"?
                 <MapView.Marker
                 key={el._id}
                 coordinate={{latitude: el.coordinates.latitude,
                 longitude: el.coordinates.longitude}}
                 pinColor={'blue'}
                />  
                : 
                <MapView.Marker
                 key={el._id}
                 coordinate={{latitude: el.coordinates.latitude,
                 longitude: el.coordinates.longitude}}
                />  
             )
            }

         

        </MapView>
    );
  }

}

const styles = StyleSheet.create({
 buttonRow:{
    position:"absolute", bottom: 0, flex: 1, flexDirection: "row"
  },

  button:{
    alignSelf:"center", margin:20 ,flex:1, flexDirection: "row", justifyContent: "space-between"
  }
});