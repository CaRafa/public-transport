import React from 'react';
import {Button,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View
} from 'react-native';
import { MapView  } from 'expo';
import Polyline from '@mapbox/polyline';

export default class RouteCreation extends React.Component {

  
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  constructor(props){ 
    super(props)
    const {state} = props.navigation;
    this.coordenadas = state.params;
    this.polyline = []
    this.Nparada = 0;
    this.state = { coordsArray: [] }
    this.Npolyline = 0;

    this.states = {
        latitude: null,
        longitude: null,
        error:null,
        coords: [],
    };
   }

   async getDirections(startLoc, destinationLoc) {

    try {
        let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=AIzaSyA69jKIH6tGGGn7yyQC0HRvrfUt5ojRMlw`)
        let respJson = await resp.json();
        let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
        let coords = points.map((point, index) => {
            return  {
                latitude : point[0],
                longitude : point[1]
            }
        })

        this.state.coordsArray[this.Npolyline] = coords;
        this.Npolyline = this.Npolyline + 1;
        this.setState({ coordsArray: this.state.coordsArray })
        console.log('Array actualizado', this.state.coordsArray)
       
        return coords
    } catch(error) {
        alert(error)
        return error
    }
}


   
   setPolyline = (point) => {
       this.polyline[this.Nparada] = point.coordenadas.latitude+','+point.coordenadas.longitude;     
        this.Nparada = this.Nparada + 1 ;
        console.log('parada elegida', point.name);
        if(this.Nparada == 2){
            this.getDirections(this.polyline[0],this.polyline[1]).then(function(response){
            

            }).catch(function(e){
                console.log(e);
            })
            this.Nparada = 0;
            }
        
        }    

   
 

  render() {

    // var coordinates =    
    // [{ route: [  {latitude:10.360309547211214, longitude:-66.97492910203451 }, 
    //     {latitude:10.358797 , longitude:-66.976382}, 
    //     {latitude:10.359547, longitude:-66.974177}],
    // },
    // { route: [ 
    //     {latitude:10.358797 , longitude:-66.976382}, 
    //     {latitude:10.357772, longitude:-66.976943}],
    // }
    // ]
    

    var Ubicacion = [
        {name:'Parada 1', key:'1' ,coordenadas:{latitude:10.360309547211214,longitude:-66.97492910203451 }},
        {name:'Parada 2', key:'2', coordenadas:{latitude:10.358797 ,longitude:-66.976382 }},
        {name:'Parada 3', key:'3',coordenadas:{latitude:10.359547,longitude:-66.974177 }},
        {name:'Parada 4', key:'4',coordenadas:{latitude:10.357772,longitude:-66.976943 }},
      ]
        
    

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

         {
              Ubicacion.map(el => 
                <MapView.Marker
                key={el.key}
                coordinate={{latitude: el.coordenadas.latitude,
                longitude: el.coordenadas.longitude}}
                onPress={this.setPolyline.bind(this,el)}
             /> 
            )
            }
            
            {/* {coordinates.map((ele,index) => (    
                <MapView.Polyline
                key={index}
                coordinates={ele.route}
                strokeColor="#000"
                fillColor="rgba(255,0,0,0.5)"
                strokeWidth={1}/>
            ))} */}

            {this.state.coordsArray.map((ele,index) => (    
                console.log('POLYLINE A CARGAR',ele , index),
                <MapView.Polyline
                key={index}
                coordinates={ele}
                strokeColor="#000"
                fillColor="rgba(255,0,0,0.5)"
                strokeWidth={2}/>
            ))}
         

        </MapView>
    );
  }

}

const styles = StyleSheet.create({
 
});