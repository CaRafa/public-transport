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
    // this.routes = state.params.routes;
    this.owner = state.params.owner;
    this.schedule = state.params.schedule
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
     
     //('FLAG', flag)
    this.getLocationAsync(flag).then(function(response){
    }).catch(function(e) {
       //(e); // "Uh-oh!"
    });

  }
  updateTransporte = () => {

    this.props.navigation.navigate('updateT',{routes:this.allRoutes, trans: this.object})

  }

  verRutas = (ruta) => {

    this.rutaToSee = ruta;
    this.ObtenerUbicacion(true)
  }

  crearHorario = () =>{
    this.props.navigation.navigate('FormCH',{rutas: this.allRoutes, id: this.object._id, horario: this.object.schedule});
   }

   descanso = () => {
      //('descanso');
   }

   verOwner = (owner) => {
      //('ver owner',owner);
     this.props.navigation.navigate('DetailedDriver',{cond:owner})
   
    }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
            <Text style={styles.getStartedTexthead}>
              Informacion del transporte {this.object.number}
            </Text>
            <Text style={styles.getStartedText}>
             Placa:{this.object.licPlate} {"\n"}Marca: {this.object.model}, Color: {this.object.color}{"\n"}
             Puestos:{this.object.seats} ,Año: {this.object.year}{"\n"}
             Tipo de transporte:  
             {this.object.vehType == "TransP"? 'Transporte Pequeño': this.object.vehType == "TransG" ? "Transporte Grande": this.object.vehType == "Mt"? "Moto taxi" : this.object.vehType } 
             {"\n"}
             Informacion relevante: {this.object.description}
            </Text>
            <View>
            { this.object.active == true? 
            <Text style={styles.active}>
              - Transporte en servicio </Text>
            : 
            <Text style={styles.outOfService}>
               - Transporte fuera de servicio
           
             </Text>}
            </View>

            {this.owner? 
              <View>
                <Text style={styles.getStartedTextSubtitle}>
                      Dueño de la unidad:
                    </Text>
                <Separator/> 
                 
                    <ListItem
                    key={this.owner._id}
                    title={this.owner.lastName+' , '+ this.owner.name}
                    subtitle={'C.I: '+this.owner.ci}
                    onPress={this.verOwner.bind(this,this.owner)}
                     />    
              </View>
            : null

            }
            {  this.schedule?
            
            
            <Text style={styles.getStartedTextSubtitle}>
            Rutas que cubre:
            </Text>
              : null
            }
           
            {  this.schedule?
            
            
            <View style={styles.listContainer}>
            
              {  this.schedule.map((el,i) =>
                <ListItem
                key={i}
                title={el.dia+' - '+ (el.asig == "descanso"? "Descanso" : el.asig.title)}
                subtitle={(el.asig == "descanso"? "": Math.round(el.asig.distance)/1000+"km")}
                onPress={(el.asig == "descanso"? this.descanso: this.verRutas.bind(this,el.asig))}
              />
              )}
              </View>
              : null
            }
           

            {  this.schedule? <View style={styles.seeMore}>
            <Button
              
              onPress={this.crearHorario}
              title="Actualizar Horario"
              color="#000"
              />
            </View>: <View style={styles.addNew}>
            <Button
              
              onPress={this.crearHorario}
              title="Asignar Horario"
              color="#000"
              />
            </View>

          }

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
  seeMore:{
    backgroundColor: '#f4f8ff',
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
    margin: 15,
  },
  active: {
    fontSize: 17,
    color: 'green',
    lineHeight: 24,
    textAlign: 'center'
  },
  outOfService: {
    fontSize: 17,
    color: 'red',
    lineHeight: 24,
    textAlign: 'center'
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
