import React from 'react';
import {Button,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View
} from 'react-native';
import { MapView  } from 'expo';
import Polyline from '@mapbox/polyline';
import { Ionicons } from '@expo/vector-icons';

export default class RouteCreation extends React.Component {

  
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  constructor(props){ 
    super(props)
    const {state} = props.navigation;
    this.coordenadas = state.params;

    this.actual = this.coordenadas.actual;
    this.paradas = this.coordenadas.points;
    this.polyline = []
    this.Nparada = 0;
    this.state = { coordsArray: [],
    pointArray:[] }
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
        console.log('Info de la API', points);
        let coords = points.map((point, index) => {
            return  {
                latitude : point[0],
                longitude : point[1]
            }
        })

        this.state.coordsArray[this.Npolyline] = coords;
        this.Npolyline = this.Npolyline + 1;
        this.setState({ coordsArray: this.state.coordsArray })

        return coords
    } catch(error) {
        alert(error)
        return error
    }
}


   
   setPolyline = (point) => {

        
        if(point.coordenadas){
            this.polyline[this.Nparada] = point.coordenadas.latitude+','+point.coordenadas.longitude; 
        }else{
            this.polyline[this.Nparada] = point.coordinates.latitude+','+point.coordinates.longitude; 
        }

        this.Nparada = this.Nparada + 1 ;
         if(point.name){
             console.log('parada elegida', point.name);
         }else{
             console.log('parada elegida', point.title)
         }


        if(this.Nparada == 2){
            this.getDirections(this.polyline[0],this.polyline[1]).then(function(response){
            

            }).catch(function(e){
                console.log(e);
            })
            this.Nparada = 0;
            }
        
        }    

   GuardarRuta = () => {

    console.log('GUARDAR PARADA');
    //this.CreateRutaAsync();
    this.props.navigation.navigate('FormCR', this.state.coordsArray);

   }
 
   CreateRutaAsync = async () => {
    try {
      let response = await fetch('http://192.168.1.108:3000/api/ruta',{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: this.state.coordsArray,
          title: 'Ruta x' 
        })
       });

      let result = await response.json();
      this.setState({result: result.par});

    } catch(e) {
      this.setState({result: e});
    }
  };

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

             {
              this.paradas.map(el => 
                el.type == true ? <MapView.Marker
                    key={el._id}
                    coordinate={{latitude: el.coordinates.latitude,
                    longitude: el.coordinates.longitude}}
                    onPress={this.setPolyline.bind(this,el) }
                    pinColor={'blue'}
                 /> : <MapView.Marker
                 key={el._id}
                 coordinate={{latitude: el.coordinates.latitude,
                 longitude: el.coordinates.longitude}}
                 onPress={this.setPolyline.bind(this,el)}
                /> 
            
                
                
            )
            }
         

            {this.state.coordsArray.map((ele,index) => (    
                <MapView.Polyline
                key={index}
                coordinates={ele}
                strokeColor="#000"
                fillColor="rgba(255,0,0,0.5)"
                strokeWidth={2}/>
            ))}

         <View style={styles.buttonRow}>
            <View style={styles.button}>
                <Ionicons name="ios-checkmark" size={70}  backgroundColor="transparent" onPress={this.GuardarRuta}/>
            </View>
       </View>

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