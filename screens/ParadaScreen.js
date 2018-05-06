import React from 'react';
import { Image, Button, Platform, ScrollView,  StyleSheet,Text,TouchableOpacity, View,} from 'react-native';
import { Expo, Location, Permissions } from 'expo';
import ExpoTHREE,{ THREE } from 'expo-three';
import ExpoGraphics from 'expo-graphics';
import GooglePoly from './../api/GooglePoly';
import { Ionicons } from '@expo/vector-icons';

import myObject from './../assets/object/myObject';

console.disableYellowBox = true;


export default class ParadaScreen extends React.Component {

    static navigationOptions = {
    header:null,
    tabBarVisible: false,

  };

  constructor(props){
    super(props);
  
  }

  componentDidMount(){
    this._fetchParadasAsync();
    this._fetchRoutesAsync();
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
    this.onRender();
    this.onRemoveObjectPress();
    
    GooglePoly.GetThreeModel(myObject, function(object){
        this.threeModel = object;
        this.fixLocationPress = true;
        ExpoTHREE.utils.scaleLongestSideToSize(object, 2);
        object.position.z = -3;
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

          this.CreateParadaAsync(location).then(function(res){
          console.log('RESPUESTA DE Get',res);
          return res;
          });

      }
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


  GuardarParada = () => {

    let response = this.getLocationAsync().then(function(response){
    this.respuesta = response; 
      


    });
    
    
    this.props.navigation.navigate('Rutas', this.respuesta);

  }


  onRemoveObjectPress = () => {
    if (this.threeModel) {
      this.scene.remove(this.threeModel);
    }
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

      <View style={styles.buttonRow}>
          <View style={styles.button}>
              <Ionicons name="ios-locate" size={60} backgroundColor="transparent" onPress={this.fixLocation}/>
              {this.threeModel ? 
              <Ionicons name="ios-checkmark" size={60}  backgroundColor="transparent" onPress={this.GuardarParada}/>
              : null  }
              <Ionicons name="ios-close"  size={60} backgroundColor="transparent" onPress={this.onRemoveObjectPress  }/>
          </View>
       </View>
      
      </View>  

    )
  } 
}

const styles = StyleSheet.create({

  buttonRow:{
    position:"absolute", bottom: 0, flex: 1, flexDirection: "row"
  },

  button:{
     margin:20 ,flex:1, flexDirection: "row", justifyContent: "space-between"
  }
 
});
