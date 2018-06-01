import React from 'react';
import {Button,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,} from 'react-native';
import { Expo, Location, Permissions } from 'expo';
import { ListItem } from 'react-native-elements'

export default class paradasModule extends React.Component {

  
  static navigationOptions = {
    header: null,
  };

  constructor(props){ 
    super(props)
    
    this.state = {
      paradas: []
    }
   }


   componentDidMount(){
    this._fetchParadasAsync();
   } 


   _fetchParadasAsync = async () => {
    try {
      let response = await fetch('http://192.168.137.1:3000/api/parada',{
        method: 'GET'});
      let result = await response.json();
      this.setState({paradas: result.par});

    } catch(e) {
      this.setState({result: e});
    }
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


  verLocation = (object) => {

    var aux = this.regionFrom( object.coordinates.latitude, object.coordinates.longitude, object.coordinates.accuracy );    
    this.props.navigation.navigate('MapPreview', {terminal: object.terminal, coords: aux, density: object.density});

  }

  getLocationAsync = async (flag) =>  {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    

      if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({
            enableHighAccuracy: true,
          });

          var realLoc = this.regionFrom(location.coords.latitude, location.coords.longitude, location.coords.accuracy)
         
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
     
     //('FLAG', flag)
    this.getLocationAsync(flag).then(function(response){
    }).catch(function(e) {
       //(e); // "Uh-oh!"
    });

  }



  

  render() {

   
      
      return (
        <View style={styles.container}>
        <ScrollView>
            
            <View style={styles.container}>
                  <Text style={styles.tituloPrincipal}>    
                  Paradas
                  </Text>
              </View>
              <View style={styles.listContainer}>
        { !this.state.paradas ? <View style={styles.container}>
                                <Text style={styles.getStartedText}>    
                                LOADING!
                                </Text>
                            </View>
                            :
              
                this.state.paradas.map((el,index) => 
                <ListItem
                    key={index}
                    title={el.title}
                    subtitle={el.terminal? 'Terminal': 'Toque y despegue'}
                    onPress={this.verLocation.bind(this,el)}
              />
              )
              
          
        }</View>
  
         <View style={styles.addNew}>
            <Button
              
              onPress={this.AgregarParada}
              title="Agregar una parada"
              color="black"
              />
          </View>
          </ScrollView>
        </View>
      );
        
    
    


    
  }

}

const styles = StyleSheet.create({
  addNew:{
    backgroundColor: '#dde9ff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'grey',
    marginTop: 35,
    marginLeft: 60,
    marginRight: 60,
    marginBottom:30
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
  },
  listContainer:{
   
    marginTop: 20,
    borderBottomWidth: 0.5,
    borderTopWidth: 1,
    borderColor: 'grey',
    marginLeft: 10,
    marginRight: 10
  },
  tituloPrincipal:{
    fontSize: 30,
    color: 'black',
    lineHeight: 50,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10,
  }
});