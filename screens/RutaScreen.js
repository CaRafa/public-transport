import React from 'react';
import {RefreshControl,Button,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,} from 'react-native';
import { Expo, Location, Permissions } from 'expo';
import { ListItem } from 'react-native-elements'

export default class RutaScreen extends React.Component {

  
  static navigationOptions = {
    header: null,
  };

  constructor(props){ 
    super(props)
    const {state} = props.navigation;
    this.coordenadas = state.params;
    this.state = {
      paradas: [],
      lastRefresh: Date(Date.now()).toString(),
      refreshing: false,
    }
   }


   componentDidMount(){
    this._fetchParadasAsync();
    this._fetchRoutesAsync();
   } 


   _fetchParadasAsync = async () => {
    try {
      let response = await fetch('http://192.168.1.6:3000/api/parada',{
        method: 'GET'});
      let result = await response.json();
      this.setState({paradas: result.par});

    } catch(e) {
      this.setState({result: e});
    }
  }

   _fetchRoutesAsync = async () => {
    try {
      let response = await fetch('http://192.168.1.6:3000/api/ruta',{
        method: 'GET'});
      let result = await response.json();
      this.setState({polylines: result.route});

    } catch(e) {
      this.setState({polylines: e});
    }
  };

  AgregarParada = () => {

    this.props.navigation.navigate('paradasModule');
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


  
verRuta = (ruta) => {

  this.rutaToSee = ruta;
  this.ObtenerUbicacion(3)
}

obtenerParadas = () => {

  var paradas = []

    for(var i=0; i < this.rutaToSee.stops.length; i++){

        for(var j=0 ; j< this.state.paradas.length; j++){
            if(this.state.paradas[j]._id == this.rutaToSee.stops[i]){
              paradas.push(this.state.paradas[j])
            }


        }


    }
    return paradas
}


  getLocationAsync = async (flag) =>  {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    

      if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({
            enableHighAccuracy: true,
          });

          var realLoc = this.regionFrom(location.coords.latitude, location.coords.longitude, location.coords.accuracy)
         
          if(flag == 1){
            this.props.navigation.navigate('mapRoutes', {
              actual: realLoc, polylines: this.state.polylines, paradas: this.state.paradas}); 
          }else if(flag == 2){
            this.props.navigation.navigate('CreateRoute', {
              actual: realLoc, points: this.state.paradas, update: false
            }); 
          }else{
            var paradas = this.obtenerParadas();
          
            this.props.navigation.navigate('detailedRoute', {
              actual: realLoc, route: this.rutaToSee, paradas: paradas}); 
          }
      
         
      }
  }

  ObtenerUbicacion = (flag) => {
     
    this.getLocationAsync(flag).then(function(response){
    }).catch(function(e) {
      console.log(e); // "Uh-oh!"
    });

  }

  verRutas = () => {
    this.ObtenerUbicacion(1)
  }

  crearRutas = () => {
    this.ObtenerUbicacion(2)
  }

  // refreshScreen = () => {
  //   this.setState({ lastRefresh: Date(Date.now()).toString() })
  //   this._fetchParadasAsync();
  //   this._fetchRoutesAsync();
  // }
  _onRefresh() {
    this.setState({refreshing: true});
    this._fetchParadasAsync();
    this._fetchRoutesAsync().then(() => {
      this.setState({refreshing: false});
    });
  }

  render() {

    
      return (
        <View style={styles.container}>
          <ScrollView refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        } >
              <View style={styles.container}>
                  <Text style={styles.tituloPrincipal}>    
                  Rutas
                  </Text>
              </View>

              <View style={styles.listContainer}>
              { !this.state.polylines ? <View style={styles.container}>
                                <Text style={styles.getStartedText}>    
                                   LOADING!
                                </Text>
                            </View>
                         :
             
              
                this.state.polylines.map((el,i) =>  
                
                <ListItem
                key={i}
                title={el.title }
                subtitle={(el.type == 'Urb'? 'Urbana' : el.type == 'subUrb'? 'Sub urbana': 'Inter Urbana')+' - '+Math.round(el.distance)/1000+"km" }
                onPress={this.verRuta.bind(this,el)}
              />
              )
              
            
          
            }</View>
            <View style={styles.seeMore}>
            <Button
              
              onPress={this.verRutas}
              title="Ver mapa "
              color="black"
              />
          </View>
            <View style={styles.seeMore}>
            <Button
              
              onPress={this.AgregarParada}
              title="Ver paradas"
              color="black"
              />
          </View>
          
          
            <View style={styles.addNew}>
            <Button
              onPress={this.crearRutas}
              title="Crear una ruta"
              color="black"
              />
          </View>
  
          {/* <View style={styles.addNew}>
               <Button onPress={this.refreshScreen} title="Recargar"  color="#000"  />
            </View> */}

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
    marginRight: 60
  },
  seeMore:{
    backgroundColor: '#f4f8ff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'grey',
    marginTop: 35,
    marginLeft: 60,
    marginRight: 60
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