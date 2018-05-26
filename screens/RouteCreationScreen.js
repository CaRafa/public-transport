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
    this.update = this.coordenadas.update;
    if(this.coordenadas.id){
        this.id = this.coordenadas.id
    }
    this.polyline = []
    this.Nparada = 0;
    this.state = { coordsArray: [],
    pointArray:[],
    ready: false    
    }
    this.Npolyline = 0;
    this.comDis = 0;
    this.pointsToCompare = []
    this.states = {
        latitude: null,
        longitude: null,
        error:null,
        coords: [],
        polyline: []
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
            this.verify(true);
            this.state.coordsArray[this.Npolyline] = coords;
            this.setState({ ready: true })
            this.Npolyline = this.Npolyline + 1;
            this.setState({ coordsArray: this.state.coordsArray })
            this.agregarTramo = true;
            var aux = {add:true , num: this.Npolyline}
            this.checkSelectedPoints(aux)
            return true
        }
        else{
            alert('Este tramo de la ruta es menor a 200 mts, elija otros puntos.');
            this.agregarTramo = false;
            this.verify(false);
            var aux = {add:false , num: this.Npolyline}
            this.checkSelectedPoints(aux)
            return false
        }
        
    } catch(error) {
        alert(error)
        return error
    }
}

verify(response){

    if(response == true ){
        
            
         if(this.state.pointArray.length != 0){
            // for(var i=0; i < this.pointsToCompare.length; i++){
            //     var find = false;
            //     for(var j=0; j < this.state.pointArray.length; j ++){
            //         if(this.pointsToCompare[i]._id == this.state.pointArray[j]){
            //             find = true;
            //         }
            //     }
            //     if(find == true){

            //     } else{
                this.state.pointArray.push(this.pointsToCompare[1]._id);
            //     }
            }
            else{
                this.state.pointArray.push(this.pointsToCompare[0]._id);
                this.state.pointArray.push(this.pointsToCompare[1]._id);
            }
         //('se agregara este tramo');
        this.pointsToCompare.splice(0,1)
         //(this.pointsToCompare);

    }else if( this.Npolyline > 0 && response == false ){
         //('existe la ruta 1 y no se agregara este punto');
        this.pointsToCompare.splice(1,1)
    }
    else{
         //('no existe la ruta 1 y no se agregara este tramo');
        this.pointsToCompare.splice(0,2)
    }

}

checkSelectedPoints(response){
    if(response.add && response.num >= 0 ){
         //(this.state.polyline)
         //('Se agrego tramo y existe posicion 1 entonces se limpia solo primera pos');
        this.polyline.splice(0,1)
         //(this.polyline)
        this.Nparada = 1;
    }
    else if( response.add == false && response.num == 0 ){
         //('no se agrego tramo y no existe posicion 1 entonces se limpia ambas pos');
        this.polyline.splice(0,2)
         //(this.polyline)
        this.Nparada = 0;
    }
    else if( response.add == false && response.num > 0 ){
         //('no se agrego tramo y  existe posicion 1 entonces se limpia primera pos');
        this.polyline.splice(0,1)
         //(this.polyline)
        this.Nparada = 1;

    }else{
         //('caso no reconocido');
    }
}
   
   setPolyline = (point) => {
        alert('Parada elegida: '+ point.title);
        this.pointsToCompare.push(point);
        this.polyline[this.Nparada] = point.coordinates.latitude+','+point.coordinates.longitude; 
        
        this.Nparada = this.Nparada + 1 ;
         
        if(this.Nparada == 2){
            this.setState({ polyline: this.polyline })

            this.getDirections(this.polyline[0],this.polyline[1]).then(function(response ){
                
                
            }).catch(function(e){
                 //(e);
            })

            

            
            }
        
        }    

   GuardarRuta = () => {

    //this.CreateRutaAsync();
    if(this.update == false){
        this.props.navigation.navigate('FormCR', {cord:this.state.coordsArray,par: this.state.pointArray, dis: this.comDis});

    }
    else{
        this.props.navigation.navigate('updateR', {cord:this.state.coordsArray,par: this.state.pointArray, dis: this.comDis
        , id: this.id});
    }
   }

   backProgress = () =>{
    
    //posible funcion para devolver el progreso de la ruta que se esta creando
    }

 
//    CreateRutaAsync = async () => {
//     try {
//       let response = await fetch('http://192.168.1.108:3000/api/ruta',{
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           route: this.state.coordsArray,
//           title: 'Ruta x' 
//         })
//        });

//       let result = await response.json();
//       this.setState({result: result.par});

//     } catch(e) {
//       this.setState({result: e});
//     }
//   };

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

        {this.state.ready == true? 
            <MapView.Callout>
            <View style={styles.buttonRow}>
                <View style={styles.button}>
                    <Ionicons name="ios-checkbox" size={60} style={{marginLeft:30}}  backgroundColor="transparent" onPress={this.GuardarRuta}/>
                    {/* 
                        //posible funcion para devolver el progreso de la ruta que se esta creando

                    <Ionicons name="ios-undo" size={60} style={{marginLeft:30}} backgroundColor="transparent" onPress={this.backProgress}/> */}
                </View>
            </View>
        </MapView.Callout>
            
            
            : null   }
         
             {
              this.paradas.map((el,index) => 
                el.terminal == true ? <MapView.Marker
                key={index}
              coordinate={{latitude: el.coordinates.latitude,
              longitude: el.coordinates.longitude}}
              onPress={this.setPolyline.bind(this,el)}
              pinColor={'black'}
              /> : 
              el.density == "D1"?
              <MapView.Marker
              key={index}
              coordinate={{latitude: el.coordinates.latitude,
              longitude: el.coordinates.longitude}}
              onPress={this.setPolyline.bind(this,el)}
              pinColor={'red'}
             />  
             : 
              el.density == "D2"?
              <MapView.Marker
              key={index}
              coordinate={{latitude: el.coordinates.latitude,
              longitude: el.coordinates.longitude}}
              onPress={this.setPolyline.bind(this,el)}
              pinColor={'orange'}
             />  
             : 
              el.density == "D3"?
              <MapView.Marker
              key={index}
              coordinate={{latitude: el.coordinates.latitude,
              longitude: el.coordinates.longitude}}
              onPress={this.setPolyline.bind(this,el)}
              pinColor={'yellow'}
             />  
             : 
              el.density == "D4"?
              <MapView.Marker
              key={index}
              coordinate={{latitude: el.coordinates.latitude,
              longitude: el.coordinates.longitude}}
              onPress={this.setPolyline.bind(this,el)}
              pinColor={'green'}
             />  
             : 
              el.density == "D5"?
              <MapView.Marker
              key={index}
              coordinate={{latitude: el.coordinates.latitude,
              longitude: el.coordinates.longitude}}
              onPress={this.setPolyline.bind(this,el)}
              pinColor={'blue'}
             />  
             : 
             <MapView.Marker
             key={index}
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