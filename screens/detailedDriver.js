import React from 'react';
import {Button,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,} from 'react-native';


export default class DetailedDriver extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){ 
    super(props)
    const {state} = props.navigation;
    this.object = state.params.cond;
    this.trans = state.params.trans
    console.log('parada que llega en mapreview', this.object , this.trans);

   }
   
   verAutobus(obj){
       console.log(obj);
   }

   crearHorario = () =>{
    console.log('asignar horario');

    this.props.navigation.navigate('FormCH',{transportes: this.trans, id: this.object._id});
   }

  render() {
    return (
      <View style={styles.container}>


            <Text style={styles.getStartedTexthead}>
              Perfil de {this.object.name}, {this.object.lastName}
            </Text>
            <Text style={styles.getStartedText}>
              CI: {this.object.ci}
            </Text>
            { this.object.status == true? <Text style={styles.getStartedText}>
              conduntor activo!
            </Text>: 
            <Text style={styles.getStartedText}>
              conduntor inactivo!
            </Text>
            }
            <Text style={styles.getStartedText}>
              Telefono: {this.object.tel}
            </Text>

            <View style={styles.addNew}>
            <Button
              
              onPress={this.crearHorario}
              title="Asignar Horario"
              color="#000"
              />
            </View>

            <ScrollView>
              {
                this.trans.map(el => 
                <View style={styles.buttonContainer}>
                <Button title={parseInt(el.numero)+" - "+el.modelo} key={el._id} onPress={this.verAutobus.bind(this,el)} />
                </View>
              )
              }
            </ScrollView>

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
    color: 'black',
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 30,
  },
  getStartedTexthead: {
    fontSize: 17,
    color: 'black',
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 70,
  }
});
