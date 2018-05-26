
import React from 'react';
import {RefreshControl,Button,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,} from 'react-native';
import { ListItem } from 'react-native-elements'


export default class ConductorScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props){ 
    super(props)
    this.state = {
      transporte: [],
      conductor:[],
      lastRefresh: Date(Date.now()).toString(),
      refreshing: false,
    }
    
  
   }

   componentDidMount(){
    this._fetchTransportesAsync()
    this._fetchConductoresAsync()
   }

   AgregarConductor = () => {

    this.props.navigation.navigate('FormCC', this.state.transporte) 
  }

  _fetchTransportesAsync = async () => {
    try {
      let response = await fetch('http://192.168.1.108:3000/api/transporte',{
        method: 'GET'});
      let result = await response.json();
      this.setState({transporte: result.transporte}); 

    } catch(e) {
      this.setState({transporte: e});
    }
  }
  
  _fetchConductoresAsync = async () => {
    try {
      let response = await fetch('http://192.168.1.108:3000/api/propietario',{
        method: 'GET'});
      let result = await response.json();
      this.setState({conductor: result.conductor});

    } catch(e) {
      this.setState({conductor: e});
    }
  } 

  
  verDetallado = (conductor) => {
    
    var taux = conductor.transports;  
    var transSend = [];
    if(taux !== 'none'){
      taux.map(el => {
        for(var i=0; i < this.state.transporte.length; i++){
          if(this.state.transporte[i]._id == el){
            transSend.push(this.state.transporte[i]);
          }

        }
      }
    )
    }
    

    this.props.navigation.navigate('DetailedDriver',{cond:conductor, trans: transSend});
  }
  

  _onRefresh() {
    this.setState({refreshing: true});
    this._fetchTransportesAsync()
    this._fetchConductoresAsync().then(() => {
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
                  Propietarios
                  </Text>
              </View>
              <View style={styles.listContainer}>
              { !this.state.conductor ? <View style={styles.container}>
                                <Text style={styles.getStartedText}>    
                                LOADING!
                                </Text>
                            </View>
                            :
              
                this.state.conductor.map((el,i) => 
                
                <ListItem
                key={i}
                title={el.lastName+','+el.name}
                subtitle={"Cedula: "+el.ci}
                onPress={this.verDetallado.bind(this,el)}
              />
              )
            
          
        } </View>
            <View style={styles.addNew}>
            <Button
              
              onPress={this.AgregarConductor}
              title="Agregar un Propietario"
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