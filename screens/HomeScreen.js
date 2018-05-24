import React from 'react';
import {Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,} from 'react-native';


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
         <ScrollView>   
            <View style={{ justifyContent: 'center',
            alignItems: 'center', marginTop:30}}>
            <Image 
            style={{width: 200, height: 200,}}
            source={
              require('./../assets/images/hatillo9.jpg')
              }
              
              
            />
              </View>
              <Text style={styles.getStartedTitle}>
              Bienvenido.
            </Text>
              <Text style={styles.getStartedText}>
              - Esta herramienta esta dirigida para la administración de transportes publicos. En ella se encontrara 3 modulos diferentes divididos en:
              {"\n"} {"\n"}  1) Transportes
              {"\n"} 2) Rutas - Paradas
              {"\n"}  3) Conductores{"\n"}{"\n"}
              En estos modulos se daran opciones para ver, crear y editar cualquiera de los mencionados objetos.{"\n"}
              {"\n"}<Text style={styles.hint}>Si es tu primera vez quizas quieras comenzar dirigiendote a la tab de "Rutas" </Text>

            </Text>

            </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  getStartedTitle: {
    fontSize: 28,
    color: 'black',
    lineHeight: 30,
    textAlign: 'center',
    margin: 5,
  },
  getStartedText: {
    fontSize: 18,
    color: 'grey',
    lineHeight: 20,
    textAlign: 'center',
    margin: 5,
  },
  hint: {
    fontSize: 20,
    color: 'black',
    lineHeight: 20,
    textAlign: 'center'
  }
});
