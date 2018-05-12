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
    this.comDis = 0;
    this.pointsToCompare = []
    this.states = {
        latitude: null,
        longitude: null,
        error:null,
        coords: [],
    };
   }

    distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
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
        var dis = 0;
        for(var i=0; i< coords.length-1 ; i++ ){
            dis = dis + this.distance(coords[i].latitude, coords[i].longitude, coords[i+1].latitude,coords[i+1].longitude, "K")
          }
        if(dis*1000 > 200){

            this.comDis = this.comDis + (dis*1000)
            console.log('total de distancia', this.comDis);
            this.verify(true);
            this.state.coordsArray[this.Npolyline] = coords;
            this.Npolyline = this.Npolyline + 1;
            this.setState({ coordsArray: this.state.coordsArray })
            this.agregarTramo = true;
            return true
        }
        else{
            alert('Este tramo de la ruta es menor a 200 mts, elija otros puntos.');
            this.verify(false);
            return false
        }
        
    } catch(error) {
        alert(error)
        return error
    }
}

verify(response){

    if(response == true){
        
            
        if(this.state.pointArray.length != 0){
            for(var i=0; i < this.pointsToCompare.length; i++){
                var find = false;
                console.log('length del pointarray', this.state.pointArray.length);
                for(var j=0; j < this.state.pointArray.length; j ++){
                    console.log('compare if', this.pointsToCompare[i] , this.state.pointArray[j]);
                    if(this.pointsToCompare[i]._id == this.state.pointArray[j]){
                        find = true;
                    }
                }
                if(find == true){

                } else{
                    this.state.pointArray.push(this.pointsToCompare[i]._id);
                }
            }
            }else{
                this.state.pointArray.push(this.pointsToCompare[0]._id);
                this.state.pointArray.push(this.pointsToCompare[1]._id);
            }
        
        this.pointsToCompare.splice(0,2)
    }else{
        console.log('no se agregaran estas paradas');
        this.pointsToCompare.splice(0,2)
    }

    console.log('Resultados del verify', this.state.pointArray, 'activos', this.pointsToCompare  );
}
   
   setPolyline = (point) => {

        this.pointsToCompare.push(point);
        if(point.coordenadas){
            this.polyline[this.Nparada] = point.coordenadas.latitude+','+point.coordenadas.longitude; 
        }else{
            this.polyline[this.Nparada] = point.coordinates.latitude+','+point.coordinates.longitude; 
        }

        this.Nparada = this.Nparada + 1 ;
         


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
    this.props.navigation.navigate('FormCR', {cord:this.state.coordsArray,par: this.state.pointArray, dis: this.comDis});

   }
 
   CreateRutaAsync = async () => {
    try {
      let response = await fetch('http://192.168.1.106:3000/api/ruta',{
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
              coordinate={{latitude: el.coordinates.latitude,
              longitude: el.coordinates.longitude}}
              onPress={this.setPolyline.bind(this,el)}
              pinColor={'black'}
              /> : 
              el.density == "D1"?
              <MapView.Marker
              coordinate={{latitude: el.coordinates.latitude,
              longitude: el.coordinates.longitude}}
              onPress={this.setPolyline.bind(this,el)}
              pinColor={'red'}
             />  
             : 
              el.density == "D2"?
              <MapView.Marker
              coordinate={{latitude: el.coordinates.latitude,
              longitude: el.coordinates.longitude}}
              onPress={this.setPolyline.bind(this,el)}
              pinColor={'orange'}
             />  
             : 
              el.density == "D3"?
              <MapView.Marker
              coordinate={{latitude: el.coordinates.latitude,
              longitude: el.coordinates.longitude}}
              onPress={this.setPolyline.bind(this,el)}
              pinColor={'yellow'}
             />  
             : 
              el.density == "D4"?
              <MapView.Marker
              coordinate={{latitude: el.coordinates.latitude,
              longitude: el.coordinates.longitude}}
              onPress={this.setPolyline.bind(this,el)}
              pinColor={'green'}
             />  
             : 
              el.density == "D5"?
              <MapView.Marker
              coordinate={{latitude: el.coordinates.latitude,
              longitude: el.coordinates.longitude}}
              onPress={this.setPolyline.bind(this,el)}
              pinColor={'blue'}
             />  
             : 
             <MapView.Marker
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