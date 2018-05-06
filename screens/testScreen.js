import React from 'react';
import { Image, Button, Platform, ScrollView,  StyleSheet,Text,TouchableOpacity, View,} from 'react-native';
import { findNodeHandle, NativeModules } from 'react-native';
import * as THREE from 'three';
import ExpoTHREE from 'expo-three';
import myObject from './../assets/object/myObject';
import GooglePoly from './../api/GooglePoly';
import { Ionicons } from '@expo/vector-icons';
import {Location, Permissions } from 'expo';

export default class testScreen extends React.Component {

    static navigationOptions = {
        header:null,
        tabBarVisible: false,
    
      };

      componentDidMount(){
        this.noObject = false;
       } 

  render() {
    return (
    
        <View style={{flex:1}}>   

            <Expo.GLView
                    nativeRef_EXPERIMENTAL={this._setNativeGLView}
                    style={{ flex: 1 }}
                    onContextCreate={this._onGLContextCreate}
                />

            <View style={styles.buttonRow}>
                <View style={styles.button}>
                    <Ionicons name="ios-locate" size={70} backgroundColor="transparent" onPress={this.fixLocation}/>
                    <Ionicons name="ios-checkmark" size={100}  backgroundColor="transparent" onPress={this.GuardarParada}/>
                    <Ionicons name="ios-close"  size={70} backgroundColor="transparent" onPress={this.onRemoveObjectPress  }/>
                </View>
            </View>

        </View>  

    );
  }

  CreateParadaAsync = async (location) => {
    try {
      let response = await fetch('http://192.168.1.108:3000/api/parada',{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          coordinates: location.coords,
          title: 'parada x' 
        })
       });

      let result = await response.json();
      this.setState({result: result.par});
      this.infoLoaded = true;
      console.log(this.state.result, this.infoLoaded);

    } catch(e) {
      this.setState({result: e});
      console.log(this.state.result)
    }
  };

  getLocationAsync = async () =>  {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    

      if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({
            enableHighAccuracy: true,
          });

          this.CreateParadaAsync(location).then(function(res){
          console.log('RESPUESTA DE Get',res);
          return res;
          });

      }
  }

  GuardarParada = () => {

    let response = this.getLocationAsync().then(function(response){
    this.respuesta = response; 
    });
    this.props.navigation.navigate('Rutas', this.respuesta);

  }

  onRemoveObjectPress = () => {
    if (this.threeModel) {
      this.scene.remove(this.threeModel);
      this.noObject = false;

    }
  }

  fixLocation = () =>{    
    
    this.onRemoveObjectPress();
    GooglePoly.GetThreeModel(myObject, function(object){
        this.threeModel = object;
        this.fixLocationPress = true;
        ExpoTHREE.utils.scaleLongestSideToSize(object, 1);
        object.position.z = -0.4;
        object.position.y = -0.2; 
        this.scene.add(object); 
        this.noObject = true;

    }.bind(this), function(error){
        console.log(error);
    });
  }

  _setNativeGLView = ref => {
    this._nativeGLView = ref;
  };

  _onGLContextCreate = async gl => {
    // Start AR session
    const arSession = await NativeModules.ExponentGLViewManager.startARSessionAsync(
      findNodeHandle(this._nativeGLView)
    );

    // Initialize renderer, scene, camera
    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x000000, 1);
    this.scene = new THREE.Scene();
    this.scene.background = ExpoTHREE.createARBackgroundTexture(arSession, renderer);
    const camera = ExpoTHREE.createARCamera(
      arSession,
      gl.drawingBufferWidth,
      gl.drawingBufferHeight,
      0.01,
      1000
    );
    // Initialize lighting...
    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    this.scene.add(ambientLight);
    

    // Rotating cube
    // const cube = new THREE.Mesh(
    //   new THREE.BoxGeometry(0.08, 1.6, 0.08),
    // );
    // cube.position.z = -0.6;
    // scene.add(cube);




    // Main loop
    const render = () => {
      // Rotate cube
    //   cube.rotation.y += 0.04;
      if (this.threeModel) {
        this.threeModel.rotation.y += 0.04;
      }
      // Render scene!
      renderer.render(this.scene, camera);

      // End and schedule another frame
      gl.endFrameEXP();
      requestAnimationFrame(render);
    };

    render();
  };
}

const styles = StyleSheet.create({

    buttonRow:{
      position:"absolute", bottom: 0, flex: 1, flexDirection: "row"
    },
  
    button:{
       margin:20 ,flex:1, flexDirection: "row", justifyContent: "space-between"
    }
   
  });