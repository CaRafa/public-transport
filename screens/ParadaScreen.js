import React from 'react';
import { Image, Button, Platform, ScrollView,  StyleSheet,Text,TouchableOpacity, View,} from 'react-native';
import { Expo } from 'expo';
import ExpoTHREE,{ THREE } from 'expo-three';
import ExpoGraphics from 'expo-graphics';
import GooglePoly from './../api/GooglePoly';

import myObject from './../assets/object/myObject';

export default class ParadaScreen extends React.Component {

    static navigationOptions = {
    header:null,
  };

  constructor(props){
    super(props);
    // GooglePoly.obtainImage(ApiKeys.GooglePoly).then(function(assets){
    //     var aux = JSON.stringify(assets);    
    //     console.log(aux); 
       
    // });

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

    //initialize lighting
    // var ambientLight = new THREE.ambientLight(0xaaaaaa);
    // this.scene.add(ambientLight);
  }

  onRender = (delta) => {
    this.renderer.render(this.scene, this.camera);
  }

  fixLocation = () =>{

    
    GooglePoly.GetThreeModel(myObject, function(object){

        console.log('entre aqui')
        console.log(object);
        ExpoTHREE.utils.scaleLongestSideToSize(object, 0,75);
       // object.position.z = -3;
        this.scene.add(object);  
    }.bind(this), function(error){
        console.log(error);
    });

        // GooglePoly.GetThreeModel(myObject, function(object){     


    
    // Console.log('Object created');    
        
    // //ExpoTHREE.utils.scaleLongestSideToSize(object, 0,75);
    // object.position.z = -3;
    // this.scene.add(object);    

    // }.bind(this) , function(error){
    //     console.log('HUBO UN ERROR');
    //     console.log(error);
    // });

  }

  render() {
    return (

     <View style={{flex:1}}>   

      <ExpoGraphics.View
      style={{flex:1}}
      onContextCreate={this.onContextCreate}
      onRender={this.onRender}
      arEnabled={true} 
      />
        <Button title="fijar posicion" onPress={this.fixLocation} />
      </View>  

    )
  }

  
}

const styles = StyleSheet.create({
 
});
