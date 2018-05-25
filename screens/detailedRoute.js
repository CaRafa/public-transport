import React from 'react';
import {Button,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,} from 'react-native';
import {
  Separator
} from 'react-native-form-generator';
import { ListItem } from 'react-native-elements'


export default class DetailedRoute extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){ 
    super(props)
    const {state} = props.navigation;
    this.route = state.params.route
    this.paradas = state.params.paradas
    this.actual = state.params.actual

   }
   
   componentDidMount(){
    this._fetchParadasAsync();
   } 


   _fetchParadasAsync = async () => {
    try {
      let response = await fetch('http://192.168.1.6:3000/api/parada',{
        method: 'GET'});
      let result = await response.json();
      this.setState({points: result.par});

    } catch(e) {
      this.setState({result: e});
    }
  }


   updateRoute = () => {
    this.props.navigation.navigate('CreateRoute', {
        actual: this.actual, points: this.state.points, update: true, id: this.route._id
      }); 
   }

   verParada = (object) => {
    var aux = this.regionFrom( object.coordinates.latitude, object.coordinates.longitude, object.coordinates.accuracy );    
    this.props.navigation.navigate('MapPreview', {terminal: object.terminal, coords: aux, density: object.density});



}
    verRuta = () => {
        
        this.props.navigation.navigate('detailedRouteMap', {
                actual: this.actual, polylines: this.route, paradas: this.paradas}); 
            
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

  render() {
    return (
      <View style={styles.container}>
          <ScrollView>

            <Text style={styles.perfilTitle}>
              Ruta: {this.route.title}
            </Text>
            <Text style={styles.getStartedText}>
              {this.route.description}
            </Text>
            { this.route.type == 'Urb'? <Text style={styles.getStartedText}>
              Ruta tipo Urbana
            </Text>: this.route.type == 'subUrb'?
            <Text style={styles.getStartedText}>
              Ruta tipo Sub Urbana
            </Text>:
            <Text style={styles.getStartedText}>
              Ruta tipo Inter Urbana
             </Text>
            }
            <Text style={styles.getStartedText}>
             Distancia aproximada: {Math.round(this.route.distance)/1000} km
            </Text>

            
            <Text style={styles.perfilTitle}>
              Trayectoria de la ruta:
            </Text>
            <View style={styles.listContainer}>
              {
                this.paradas.map((el,i) => 
                
                <ListItem
                   key={i}
                  title={el.title+"-"+(i+1)}
                  subtitle={el.terminal == true? 'Terminal' : 'Toque y despegue'}
                  onPress={this.verParada.bind(this,el)}
              />
              )
              }</View>

          <View style={styles.seeMore}>
            <Button
              
              onPress={this.verRuta}
              title="Ver en mapa "
              color="black"
              />
          </View>

            <View style={styles.addNew}>
            <Button
              
              onPress={this.updateRoute}
              title="Modificar ruta"
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
  getStartedText: {
    fontSize: 17,
    color: 'black',
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 30,
  },
  getStartedTexthead: {
    fontSize: 17,
    color: 'black',
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 70,
  },
  listContainer:{
   
    marginTop: 20,
    borderBottomWidth: 0.5,
    borderTopWidth: 1,
    borderColor: 'grey',
    marginLeft: 10,
    marginRight: 10
  },
  perfilTitle:{
    fontSize: 24,
    color: 'black',
    lineHeight: 26,
    textAlign: 'center',
    marginTop: 70,
  }
});
