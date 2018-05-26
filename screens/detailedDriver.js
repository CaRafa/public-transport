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
    this.state = { 
      object: false    
      }

    //this.allTrans = state.params.allTrans

   }
   componentDidMount(){
    this._fetchRoutesAsync();
    this._fetchTransportesAsync()
    

   } 

   _fetchTransportesAsync = async () => {
    try {
      let response = await fetch('http://192.168.1.108:3000/api/transporte',{
        method: 'GET'});
      let result = await response.json();
      this.setState({transporte: result.transporte});
      

      if(this.trans){
        console.log('llego por propietarios')
        this.setState({object: this.trans});
      }else{
        console.log('llego por transportes')
        this.trans = this.obtainTransports(result.transporte)
        this.setState({object: this.trans});
      }


    } catch(e) {
      this.setState({transporte: e});
    }
  } 


   _fetchRoutesAsync = async () => {
    try {
      let response = await fetch('http://192.168.1.108:3000/api/ruta',{
        method: 'GET'});
      let result = await response.json();
      this.setState({routes: result.route});

    } catch(e) {
      this.setState({routes: e});
    }
  }

  obtainTransports = (allTrans) =>{
    console.log('Se llama a la funcion')
    var trans = [];
    console.log(allTrans)
    for(var i = 0; i< allTrans.length; i++){
      if(this.object._id == allTrans[i].owner){
        console.log('dueño conseguido');
        trans.push(allTrans[i])
      }


    }


    return trans
  }

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


  obtainSchedule(schedule){
    var finalSchedule = [];
    console.log(schedule)
    schedule.forEach(element => {
      if(element.asig !== 'descanso'){
        this.state.routes.forEach(route => {
          if(route._id == element.asig){
            finalSchedule.push(
              {asig:route,
               dia: element.dia}
              )
          }
          
        })

        
      }else{
        finalSchedule.push(
          element
          )
      }


    });

    return finalSchedule
  }

   verAutobus(obj){
       var routes = this.obtainRoutes(obj);
       if(obj.schedule){
        console.log(obj.schedule)
        var schedule = this.obtainSchedule(obj.schedule)
      }

    this.props.navigation.navigate('DetailedTransport', {
      transporte: obj,
      routes: routes,
      owner: this.object,
      schedule: schedule,
      allRoutes: this.state.routes,
    });

   }

   updateInfo = () => {

     this.props.navigation.navigate('updateC',{transportes: this.state.transporte, id: this.object._id, status: this.object.status});
   }

   crearHorario = () =>{
    this.props.navigation.navigate('FormCH',{transportes: this.trans, id: this.object._id, horario: this.object.schedule});
   }

  render() {
    return (
      <View style={styles.container}>
          <ScrollView>

            <Text style={styles.perfilTitle}>
              Perfil de {this.object.name}, {this.object.lastName}
            </Text>
            <Text style={styles.getStartedText}>
              CI: {this.object.ci} ,{"\n"}  Telefono: {this.object.cell}
            </Text>
            

            
            <Text style={styles.perfilTitle}>
              Transportes
            </Text>
            <View style={styles.listContainer}>
              {this.state.object?
                this.state.object.map((el,i) => 
                
                <ListItem
                key={i}
                  
                  title={el.model+' - '+el.number}
                  subtitle={el.licPlate}
                onPress={this.verAutobus.bind(this,el)}
              />
              )
              : null}</View>

          
          {/* {this.object.schedule? <View style={styles.seeMore}>
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

          } */}
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
