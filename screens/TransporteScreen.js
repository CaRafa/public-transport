import React from 'react';
import {Button,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,} from 'react-native';


export default class TransporteScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props){ 
    super(props)
    this.state = {
      transporte: []
    }
   }

   componentDidMount(){
    this._fetchRoutesAsync()
    this._fetchTransportesAsync()
   }

  AgregarTransporte = () => {

    this.props.navigation.navigate('FormCT', this.state.routes) 
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
      console.log('RESULTADO FETCH',result.transporte);
      this.setState({transporte: result.transporte});

    } catch(e) {
      this.setState({transporte: e});
    }
  } 

  obtainRoutes(obj){

    var aux = [];
    console.log('tamanos de los vectores', obj.route.length , this.state.routes.length)
    for(var i = 0; i < obj.route.length ; i++){
      for(var j = 0; j < this.state.routes.length; j++){
        console.log('comparacion',obj.route[i] , this.state.routes[j]._id );
          if(obj.route[i] == this.state.routes[j]._id){
            aux.push(this.state.routes[j]);
          }

      }

    }
    console.log('Resultado', aux);
    return aux
  }

  verDetallado = (transporte) => {
    console.log('Seleccionado', transporte);
    var routes = this.obtainRoutes(transporte);
    this.props.navigation.navigate('DetailedTransport', {
      transporte: transporte,
      routes: routes
    });
  }

  render() {
    return (
      <View style={styles.container}>
  
            <View style={styles.addNew}>
            <Button
              
              onPress={this.AgregarTransporte}
              title="Agregar un transporte!"
              color="#000"
              />
            </View>
          
            { !this.state.transporte ? <View style={styles.container}>
                                <Text style={styles.getStartedText}>    
                                LOADING!
                                </Text>
                            </View>
                            :
              <ScrollView>
              {
                this.state.transporte.map(el => 
                <View style={styles.buttonContainer}>
                <Button title={el.modelo} key={el._id} onPress={this.verDetallado.bind(this,el)} />
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