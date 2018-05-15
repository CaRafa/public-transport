import React from 'react';
import {Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,} from 'react-native';


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
            
            <View style={{ justifyContent: 'center',
            alignItems: 'center', marginTop:30}}>
            <Image 
            style={{width: 200, height: 200,}}
            source={
              require('./../assets/images/hatillo9.jpg')
              }
              
              
            />
              </View>
              <Text style={styles.getStartedText}>
              Bienvenido.
            </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  getStartedText: {
    fontSize: 28,
    color: 'black',
    lineHeight: 30,
    textAlign: 'center',
    margin: 5,
  }
});
