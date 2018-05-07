import React from 'react';
import {Button,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,} from 'react-native';


export default class TransporteScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props){ 
    super(props)
    
   }

   componentDidMount(){
    this._fetchRoutesAsync()
   }

  AgregarTransporte = () => {

    this.props.navigation.navigate('FormCT', this.state.routes) 
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
  }; 

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