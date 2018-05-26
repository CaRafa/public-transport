import React from 'react';
import { Image, Button, Platform, ScrollView,  StyleSheet,Text,TouchableOpacity, View,} from 'react-native';
import { findNodeHandle, NativeModules } from 'react-native';
import * as THREE from 'three';
import ExpoTHREE from 'expo-three';
import myObject from './../assets/object/myObject';
import GooglePoly from './../api/GooglePoly';
import { Ionicons } from '@expo/vector-icons';
import {Location, Permissions } from 'expo';
console.disableYellowBox = true;

export default class ParadaSetScreen extends React.Component {

  constructor(props){ 
    super(props)
    
    this.state = { 
    object: false    
    }
   
   }

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
                    {this.state.object == true? 
                     <Ionicons name="ios-checkmark" size={90}  backgroundColor="transparent" onPress={this.GuardarParada}/>
                       : null}
                    
                    <Ionicons name="ios-close"  size={70} backgroundColor="transparent" onPress={this.onRemoveObjectPress  }/>
                </View>
            </View>

        </View>  

    );
  }

  

  getLocationAsync = async () =>  {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    

      if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({
            enableHighAccuracy: true,
          });

          //this.CreateParadaAsync(location).then(function(res){
          this.props.navigation.navigate('FormCP', location);
          
         // });

      }
  }

  GuardarParada = () => {

    this.getLocationAsync().then(function(response){
    });
    

  }

  onRemoveObjectPress = () => {
    if (this.threeModel) {
      this.scene.remove(this.threeModel);
      this.noObject = false;
      this.threeModel = null;
      this.setState({ object: false })
    }
  }

  fixLocation = () =>{    
    
    this.onRemoveObjectPress();
    GooglePoly.GetThreeModel(myObject, function(object){
        this.threeModel = object;
        this.fixLocationPress = true;
        ExpoTHREE.utils.scaleLongestSideToSize(object, 1.5);
        object.position.z = -0.4;
        object.position.y = -1; 
        this.scene.add(object); 
        this.noObject = true;
        this.setState({ object: true })

    }.bind(this), function(error){
         //(error);
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
    

    //Rotating cube
    // const cube = new THREE.Mesh(
    //   new THREE.BoxGeometry(0.08, 0.08, 0.08),
    // );
    // cube.position.z = -0.4;
    // scene.add(cube);

    // Main loop
    const render = () => {
      // Rotate cube
     //cube.rotation.y += 0.04;
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