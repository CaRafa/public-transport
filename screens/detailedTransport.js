import React from 'react';
import {Button,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,} from 'react-native';


export default class DetailedTransport extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){ 
    super(props)
    const {state} = props.navigation;
    this.object = state.params.transporte;
    this.routes = state.params.routes;
    console.log('parada que llega en mapreview', this.object);

   }

   verRuta= (route) =>{
     console.log('Ver ruta');
   }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
            <Text style={styles.getStartedTexthead}>
              Informacion del tranporte {this.object.numero}, placa:{this.object.placa}
            </Text>
            <Text style={styles.getStartedText}>
              Marca: {this.object.modelo}, Año: xxxx
            </Text>
            {this.routes?
              this.routes.map(el =>
                <View style={styles.buttonContainer}>
                 <Button title={el.title} key={el._id} onPress={this.verRuta.bind(this,el)} />
                </View>
              ): null
            }
          </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    color: 'black',
    lineHeight: 24,
    textAlign: 'center',
    margin: 40,
  },
  getStartedTexthead: {
    fontSize: 17,
    color: 'black',
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 70,
  }
});
