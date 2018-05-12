import React from 'react';
import {Button,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,} from 'react-native';
import { Expo, Location, Permissions } from 'expo';

export default class RutaScreen extends React.Component {

  
  static navigationOptions = {
    header: null,
  };

  constructor(props){ 
    super(props)
    const {state} = props.navigation;
    this.coordenadas = state.params;
    this.state = {
      paradas: []
    }
   }


   componentDidMount(){
    this._fetchParadasAsync();
    this._fetchRoutesAsync();
   } 


   _fetchParadasAsync = async () => {
    try {
      let response = await fetch('http://10.4.2.18:3000/api/parada',{
        method: 'GET'});
      let result = await response.json();
      this.setState({paradas: result.par});

    } catch(e) {
      this.setState({result: e});
      console.log(this.state.result)
    }
  };

   _fetchRoutesAsync = async () => {
    try {
      let response = await fetch('http://10.4.2.18:3000/api/ruta',{
        method: 'GET'});
      let result = await response.json();
      this.setState({polylines: result.route});

    } catch(e) {
      this.setState({polylines: e});
      console.log(this.state.polylines)
    }
  };

  AgregarParada = () => {

    this.props.navigation.navigate('Parada');
  }



  regionFrom(lat, lon, distance) {
    console.log('Entre bien en region form', lat, lon, distance);
    distance = distance/2
    const circumference = 40075
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000
    const angularDistance = distance/circumference

    const latitudeDelta = distance / oneDegreeOfLatitudeInMeters
    const longitudeDelta = Math.abs(Math.atan2(
            Math.sin(angularDistance)*Math.cos(lat),
            Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)))
      console.log('Saldre bien de funcion');
    return result = {
        latitude: lat,
        longitude: lon,
        latitudeDelta,
        longitudeDelta,
    }
}


  verLocation = (object) => {

    var aux = this.regionFrom( object.coordinates.latitude, object.coordinates.longitude, object.coordinates.accuracy );    
    this.props.navigation.navigate('MapPreview', {type: object.type, coords: aux, density: object.density});

  }

  getLocationAsync = async (flag) =>  {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    

      if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({
            enableHighAccuracy: true,
          });

          var realLoc = this.regionFrom(location.coords.latitude, location.coords.longitude, location.coords.accuracy)
          console.log('FLAG ultimo nivel', flag)
          if(flag == true){
            this.props.navigation.navigate('mapRoutes', {
              actual: realLoc, polylines: this.state.polylines, paradas: this.state.paradas}); 
          }else{
            this.props.navigation.navigate('CreateRoute', {
              actual: realLoc, points: this.state.paradas
            }); 
          }
      
         
      }
  }

  ObtenerUbicacion = (flag) => {
     
    console.log('FLAG', flag)
    this.getLocationAsync(flag).then(function(response){
    }).catch(function(e) {
      console.log(e); // "Uh-oh!"
    });

  }

  verRutas = () => {
    this.ObtenerUbicacion(true)
  }

  crearRutas = () => {
    this.ObtenerUbicacion(false)
  }

  

  render() {

    var Ubicacion = [
      {name:'Parada 1', key:'1' ,coordenadas:{latitude:'10.360309547211214', longitude:'-66.97492910203451',accuracy: "48", }},
      {name:'Parada 2',key:'2', coordenadas:{latitude:'40.712784 ', longitude:'-74.00594130000002',accuracy: "10" }},
      {name:'Parada 3', key:'3',coordenadas:{latitude:'48.856614', longitude:'2.3522219000000177' ,accuracy: "10"}},
      {name:'Parada 4', key:'4',coordenadas:{latitude:'40.4167754', longitude:'-3.7037901999999576',accuracy: "10" }},
      {name:'Parada 5', key:'5',coordenadas:{latitude:'35.6894875', longitude:'139.69170639999993',accuracy: "10" }},
      {name:'Parada 6',key:'6', coordenadas:{latitude:'1.1200', longitude:'60.22222',accuracy: "48" }},
      {name:'Parada 7',key:'7', coordenadas:{latitude:'1.1200', longitude:'60.22222',accuracy: "48" }},
    ]
      
      return (
        <View style={styles.container}>
  
            <View style={styles.addNew}>
            <Button
              
              onPress={this.AgregarParada}
              title="Agregar una parada!"
              color="#841584"
              />
          </View>
          
          <View style={styles.addNew}>
            <Button
              
              onPress={this.verRutas}
              title="Ver todas las rutas!"
              color="#40c0ce"
              />
          </View>
            <View style={styles.addNew}>
            <Button
              onPress={this.crearRutas}
              title="Crear una ruta!"
              color="#841584"
              />
          </View>
  
        { !this.state.paradas ? <View style={styles.container}>
                                <Text style={styles.getStartedText}>    
                                LOADING!
                                </Text>
                            </View>
                            :
              <ScrollView>
              {
                this.state.paradas.map(el => 
                <View style={styles.buttonContainer}>
                <Button title={el.title} key={el._id} onPress={this.verLocation.bind(this,el)} />
                </View>
              )
              }
            </ScrollView>
          
        }
  
        </View>
      );
        
    
    


    
  }

}

const styles = StyleSheet.create({
  addNew:{
    backgroundColor: 'grey',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'blue',
    marginTop: 35,

  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer:{
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'black',
    margin: 20,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
    margin: 40,
  }
});