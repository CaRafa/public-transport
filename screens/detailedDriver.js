import React from 'react';
import {Button,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,} from 'react-native';
import {
  Separator
} from 'react-native-form-generator';
import { ListItem } from 'react-native-elements'

export default class DetailedDriver extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){ 
    super(props)
    const {state} = props.navigation;
    this.object = state.params.cond;
    this.trans = state.params.trans
    this.allTrans = state.params.allTrans

   }
   componentDidMount(){
    this._fetchRoutesAsync();
   } 

   _fetchRoutesAsync = async () => {
    try {
      let response = await fetch('http://192.168.137.1:3000/api/ruta',{
        method: 'GET'});
      let result = await response.json();
      this.setState({routes: result.route});

    } catch(e) {
      this.setState({routes: e});
    }
  };

  obtainRoutes(obj){

    var aux = [];
    for(var i = 0; i < obj.route.length ; i++){
      for(var j = 0; j < this.state.routes.length; j++){
          if(obj.route[i] == this.state.routes[j]._id){
            aux.push(this.state.routes[j]);
          }

      }

    }
    return aux
  }

   verAutobus(obj){
       var routes = this.obtainRoutes(obj);
    this.props.navigation.navigate('DetailedTransport', {
      transporte: obj,
      routes: routes
    });

   }

   updateInfo = () => {

     this.props.navigation.navigate('updateC',{transportes: this.allTrans, id: this.object._id});
   }

   crearHorario = () =>{
    this.props.navigation.navigate('FormCH',{transportes: this.trans, id: this.object._id, horario: this.object.horario});
   }

  render() {
    return (
      <View style={styles.container}>
          <ScrollView>

            <Text style={styles.perfilTitle}>
              Perfil de {this.object.name}, {this.object.lastName}
            </Text>
            <Text style={styles.getStartedText}>
              CI: {this.object.ci} ,{"\n"}  Telefono: {this.object.tel}
            </Text>
            { this.object.status == true? <Text style={styles.getStartedText}>
              conductor activo
            </Text>: 
            <Text style={styles.getStartedText}>
              conductor inactivo
            </Text>
            }

            
            <Text style={styles.perfilTitle}>
              Transportes Asignados
            </Text>
            <View style={styles.listContainer}>
              {
                this.trans.map((el,i) => 
                
                <ListItem
                key={i}
                  
                  title={el.modelo+' - '+el.numero}
                  subtitle={el.placa}
                onPress={this.verAutobus.bind(this,el)}
              />
              )
              }</View>

          
          {this.object.horario? <View style={styles.seeMore}>
            <Button
              
              onPress={this.crearHorario}
              title="Ver Horario"
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
              
              onPress={this.updateInfo}
              title="Modificar datos"
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
