import React from 'react';
import {RefreshControl,Button,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View, Touchable} from 'react-native';
import { ListItem } from 'react-native-elements'

export default class TransporteScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props){ 
    super(props)
    this.state = {
      transporte: [],
      lastRefresh: Date(Date.now()).toString(),
      refreshing: false,
    }
   }

   componentDidMount(){
    this._fetchRoutesAsync()
    this._fetchTransportesAsync()
    this._fetchPropietarioAsync()
   }

  AgregarTransporte = () => {

    this.props.navigation.navigate('FormCT', this.state.routes) 
  }

  _fetchPropietarioAsync = async () => {
    try {
      let response = await fetch('http://192.168.1.106:3000/api/propietario',{
        method: 'GET'});
      let result = await response.json();
      this.setState({propietario: result.conductor});

    } catch(e) {
      this.setState({propietario: e});
    }
  }

  _fetchRoutesAsync = async () => {
    try {
      let response = await fetch('http://192.168.1.106:3000/api/ruta',{
        method: 'GET'});
      let result = await response.json();
      this.setState({routes: result.route});

    } catch(e) {
      this.setState({routes: e});
    }
  } 

  _fetchTransportesAsync = async () => {
    try {
      let response = await fetch('http://192.168.1.106:3000/api/transporte',{
        method: 'GET'});
      let result = await response.json();
      this.setState({transporte: result.transporte});

    } catch(e) {
      this.setState({transporte: e});
    }
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

  obtainOwner(idOwner){
    var owner;
    for(var i =0 ; i < this.state.propietario.length; i++){
        if(this.state.propietario[i]._id == idOwner){
          owner = this.state.propietario[i]
        }

    }
    return owner
  }
  obtainSchedule(schedule){
    var finalSchedule = [];
     //(schedule)
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

  verDetallado = (transporte) => {
    //var routes = this.obtainRoutes(transporte);
    var owner = this.obtainOwner(transporte.owner);
    if(transporte.schedule){
       //(transporte.schedule)
      var schedule = this.obtainSchedule(transporte.schedule)
    }
    //  //('OWNER OBTENIDO',owner)

    this.props.navigation.navigate('DetailedTransport', {
      transporte: transporte,
      //routes: routes,
      allRoutes: this.state.routes,
      owner: owner,
      schedule: schedule
    });
  }

  // refreshScreen = () => {
  //   this.setState({ lastRefresh: Date(Date.now()).toString() })
    
  // }

  _onRefresh() {
    this.setState({refreshing: true});
    this._fetchRoutesAsync()
    this._fetchPropietarioAsync()
    this._fetchTransportesAsync().then(() => {
      this.setState({refreshing: false});
    });
  }

  render() {

    
    return (
      <View style={styles.container}>
         <ScrollView  refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        } >
            
            <View style={styles.container}>
                  <Text style={styles.tituloPrincipal}>    
                  Transportes
                  </Text>
              </View>
              
        <View style={styles.listContainer}>
            { !this.state.transporte ? <View style={styles.container}>
                                <Text style={styles.getStartedText}>    
                                LOADING!
                                </Text>
                            </View>
                            :
              
                this.state.transporte.map((el,i) => 
                  <ListItem
                  key={i}
                  
                  title={el.model+' - '+el.number}
                  subtitle={el.licPlate}
                  onPress={this.verDetallado.bind(this,el)}
                />
              )
              
          
        } </View>
           <View style={styles.addNew}>
            <Button
              
              onPress={this.AgregarTransporte}
              title="Agregar un transporte"
              color="#000"
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
  buttonStyle:{
    textAlign: 'left',
  flex:1 
},

  buttonContainer:{
    height: 45,
    marginTop:10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: 'grey',
  },
  listContainer:{
   
    marginTop: 20,
    borderBottomWidth: 0.5,
    borderTopWidth: 1,
    borderColor: 'grey',
    marginLeft: 10,
    marginRight: 10
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
    margin: 40,
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