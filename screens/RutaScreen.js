import React from 'react';
import {Button,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,} from 'react-native';


export default class RutaScreen extends React.Component {

  
  static navigationOptions = {
    header: null,
  };
  AgregarParada = () => {

    this.props.navigation.navigate('Parada');
  }



  regionFrom(lat, lon, distance) {
    distance = distance/2
    const circumference = 40075
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000
    const angularDistance = distance/circumference

    const latitudeDelta = distance / oneDegreeOfLatitudeInMeters
    const longitudeDelta = Math.abs(Math.atan2(
            Math.sin(angularDistance)*Math.cos(lat),
            Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)))

    return result = {
        latitude: lat,
        longitude: lon,
        latitudeDelta,
        longitudeDelta,
    }
}


  verLocation = (coordenadas) => {
    var aux = this.regionFrom(coordenadas.latitude, coordenadas.longitude,coordenadas.accuracy );
    
    this.props.navigation.navigate('MapPreview', aux);

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

        
            {
              Ubicacion.map(el => 
              <View style={styles.buttonContainer}>
              <Button title={el.name} key={el.key} onPress={this.verLocation.bind(this,el.coordenadas)} />
              </View>
            )
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
    margin: 50,

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