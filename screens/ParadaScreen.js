import React from 'react';
import { Image, Button, Platform, ScrollView,  StyleSheet,Text,TouchableOpacity, View,} from 'react-native';
import { Expo, Location, Permissions } from 'expo';
import ExpoTHREE,{ THREE } from 'expo-three';
import ExpoGraphics from 'expo-graphics';
import GooglePoly from './../api/GooglePoly';

import myObject from './../assets/object/myObject';

console.disableYellowBox = true;


export default class ParadaScreen extends React.Component {

    static navigationOptions = {
    header:null,
  };

  constructor(props){
    super(props);
    this.googlePoly = new GooglePoly('AIzaSyAIugyzGEWDCzvhIRlK6WAvYHlb1dKvHbQ');
    this.googlePoly.obtainImage().then( function(asset){

    });
    

  }

  onContextCreate = async ({gl, scale, width, height, arSession}) => 
  {
    //initialize renderer 
    this.renderer = ExpoTHREE.createRenderer({gl});
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);

    //initialize scene
    this.scene = new THREE.Scene();
    this.scene.background = ExpoTHREE.createARBackgroundTexture(arSession, this.renderer);

    //initialize camera
    this.camera = ExpoTHREE.createARCamera(arSession, width / scale, height / scale , 0.01, 1000);

    // Initialize lighting...
    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    this.scene.add(ambientLight);
  }

  onRender = (delta) => {

    // Rotate the object...
    if (this.threeModel) {
      this.threeModel.rotation.y += 2 * delta;
    }

    this.renderer.render(this.scene, this.camera);
  }

  fixLocation = () =>{

    // Remove the current object...
    this.onRemoveObjectPress();


    GooglePoly.GetThreeModel(myObject, function(object){
        this.threeModel = object;
        this.fixLocationPress = true;
        ExpoTHREE.utils.scaleLongestSideToSize(object, 2);
        object.position.z = -2;
        object.position.y = -2; 
        this.scene.add(object);  
        this.forceUpdate();
    }.bind(this), function(error){
        console.log(error);
    });


  }

  getLocationAsync = async () =>  {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    

      if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({
            enableHighAccuracy: true,
          });
          return location;
      }
  }

  GuardarParada = () => {
    this.getLocationAsync().then(function(response){
      console.log(response);  
    });

    this.props.navigation.navigate('Rutas');
2
    

  }


  onRemoveObjectPress = () => {
    if (this.threeModel) {
      this.scene.remove(this.threeModel);
    }
  }


  render() {
    return (


      
      
     <View style={{flex:1}}>   

        {this.threeModel ? 
        <Button style={styles.buttonSave} title="Guardar Parada" onPress={this.GuardarParada} /> 
        : null  }
  
      <ExpoGraphics.View
      style={{flex:1}}
      onContextCreate={this.onContextCreate}
      onRender={this.onRender}
      arEnabled={true} 
      />
        <Button title="Fijar posicion" onPress={this.fixLocation} />
      </View>  

    )
  }

  
}

const styles = StyleSheet.create({

  buttonSave:{
    margin:30,
  }
 
});
