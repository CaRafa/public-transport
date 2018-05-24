import React from 'react';
import {Button,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,} from 'react-native';
import { ListItem } from 'react-native-elements'
import { 
  Separator
 
} from 'react-native-form-generator';
import { Expo, Location, Permissions } from 'expo';

export default class DetailedTransport extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){ 
    super(props)
    const {state} = props.navigation;
    this.object = state.params.transporte;
    this.allRoutes = state.params.allRoutes
    this.routes = state.params.routes;

   }

   componentDidMount(){
    this._fetchParadasAsync();
   } 


   _fetchParadasAsync = async () => {
    try {
      let response = await fetch('http://192.168.1.106:3000/api/parada',{
        method: 'GET'});
      let result = await response.json();
      this.setState({paradas: result.par});

    } catch(e) {
      this.setState({paradas: e});
    }
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
          var paradas = this.obtenerParadas();

          
            // this.props.navigation.navigate('detailedRouteMap', {
            //   actual: realLoc, polylines: this.rutaToSee, paradas: paradas}); 
              this.props.navigation.navigate('detailedRoute', {
                actual: realLoc, route: this.rutaToSee, paradas: paradas}); 
      }
  }

  ObtenerUbicacion = (flag) => {
     
    console.log('FLAG', flag)
    this.getLocationAsync(flag).then(function(response){
    }).catch(function(e) {
      console.log(e); // "Uh-oh!"
    });

  }
  updateTransporte = () => {

    this.props.navigation.navigate('updateT',{routes:this.allRoutes, trans: this.object})

  }

  verRutas = (ruta) => {

    this.rutaToSee = ruta;
    this.ObtenerUbicacion(true)
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
            <Text style={styles.getStartedTexthead}>
              Informacion del transporte {this.object.numero}
            </Text>
            <Text style={styles.getStartedText}>
             Placa:{this.object.licPlate} {"\n"}Marca: {this.object.model}{"\n"}Año: {this.object.year}{"\n"}Informacion relevante: {this.object.description}{"\n"}Tipo de transporte: 
             {this.object.vehType == "TransP"? 'Transporte Pequeño': this.object.vehType == "TransG" ? "Transporte Grande": this.object.vehType == "Mt"? "Moto taxi" : this.object.vehType } 
             {"\n"} { this.object.active == true? 
              '- Transporte en servicio'
            : 
           
            ' - Transporte fuera de servicio'
           
            }
            </Text>
            
            <Separator/>
            <Text style={styles.getStartedTextSubtitle}>
              Rutas que cubre:
            </Text>
          
            <View style={styles.listContainer}>
            {this.routes?
              this.routes.map((el,i) =>
                <ListItem
                key={i}
                title={el.title}
                subtitle={Math.round(el.distance)/1000+"km"}
                onPress={this.verRutas.bind(this,el)}
              />
              ): null
            }
            </View>
            <View style={styles.addNew}>
            <Button
              
              onPress={this.updateTransporte}
              title="Modificar información"
              color="#000"
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
    marginRight: 60

  },
  buttonContainer:{
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'black',
    margin: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  getStartedText: {
    fontSize: 17,
    color: 'black',
    lineHeight: 24,
    textAlign: 'center',
    margin: 40,
  },
  getStartedTexthead: {
    fontSize: 26,
    color: 'black',
    lineHeight: 26,
    textAlign: 'center',
    marginTop: 70,
  },
  getStartedTextSubtitle: {
    fontSize: 22,
    color: 'black',
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 40,
  },
  listContainer:{
   
    marginTop: 20,
    borderBottomWidth: 0.5,
    borderTopWidth: 1,
    borderColor: 'grey',
    marginLeft: 10,
    marginRight: 10
  },
});
