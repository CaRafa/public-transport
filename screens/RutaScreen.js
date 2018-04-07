import React from 'react';
import {Button,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,} from 'react-native';


export default class RutaScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  AgregarParada = () => {

    this.props.navigation.navigate('Parada');
  }

  render() {
    return (
      <View style={styles.container}>
          <View style={styles.buttonContainer}>
          <Button
            
            onPress={this.AgregarParada}
            title="Agregar una parada!"
            color="#841584"
            />
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer:{
    margin: 50,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
    margin: 40,
  }
});