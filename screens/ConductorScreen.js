
import React from 'react';
import {Button,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,} from 'react-native';


export default class ConductorScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props){ 
    super(props)
    this.state = {
      transporte: [],
      conductor:[]
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
      let response = await fetch('http://192.168.1.106:3000/api/transporte',{
        method: 'GET'});
      let result = await response.json();
      console.log('RESULTADO FETCH',result.transporte);
      this.setState({transporte: result.transporte}); 

    } catch(e) {
      this.setState({transporte: e});
    }
  }
  
  _fetchConductoresAsync = async () => {
    try {
      let response = await fetch('http://192.168.1.106:3000/api/conductor',{
        method: 'GET'});
      let result = await response.json();
      console.log('RESULTADO FETCH',result.conductor);
      this.setState({conductor: result.conductor});

    } catch(e) {
      this.setState({conductor: e});
    }
  } 

  
  verDetallado = (conductor) => {
    
    var taux = conductor.transporte;  
    var transSend = [];
    taux.map(el => {
        for(var i=0; i < this.state.transporte.length; i++){
          if(this.state.transporte[i]._id == el){
            transSend.push(this.state.transporte[i]);
          }

        }
      }
    )

    this.props.navigation.navigate('DetailedDriver',{cond:conductor, trans: transSend});
  }

  render() {
    return (
      <View style={styles.container}>
  
            <View style={styles.addNew}>
            <Button
              
              onPress={this.AgregarConductor}
              title="Agregar un Conductor!"
              color="#000"
              />
            </View>
          
            { !this.state.conductor ? <View style={styles.container}>
                                <Text style={styles.getStartedText}>    
                                LOADING!
                                </Text>
                            </View>
                            :
              <ScrollView>
              {
                this.state.conductor.map(el => 
                <View style={styles.buttonContainer}>
                <Button title={el.name} key={el._id} onPress={this.verDetallado.bind(this,el)} />
                </View>
              )
              }
            </ScrollView>
          
        }
  

        </View>
    );
  }
}

const styles = StyleSheet.create({
  addNew:{
    backgroundColor: '#cafc80',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 35,

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
  }
});