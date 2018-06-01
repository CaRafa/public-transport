import React from 'react';
import {TouchableWithoutFeedback,Keyboard,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,Button} from 'react-native';
import { Form,
    Separator,InputField, LinkField,
    SwitchField, PickerField,DatePickerField,TimePickerField
  } from 'react-native-form-generator';

export default class FormCP extends React.Component {
  static navigationOptions = {
    header: true,
    title: 'Crear parada'
  };
  constructor(props){
    super(props);
    const {state} = props.navigation;
    this.coordinates = state.params;
    this.state = {
      formData:{
        type: false
      }
    }

  }
  handleFormChange(formData){ 
    this.setState({formData:formData})
    this.props.onFormChange && this.props.onFormChange(formData);
  }
  handleFormFocus(e, component){
  }
  
  guardarParada = () => {
    
    this.CreateParadaAsync(this.coordinates, this.state.formData)
    this.UpdateEstadisticaAsync();
    this.props.navigation.navigate('Rutas');


  }

  UpdateEstadisticaAsync = async () => {
    try {
      let response = await fetch('http://192.168.137.1:3000/api/estadistica/5b0abe2379be3b1284a1c3f9' ,{
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nParadas:1,
        })
       });

      let result = await response.json();
      this.setState({result: result.par});

    } catch(e) {
      this.setState({result: e});
       //(this.state.result)
    }
  }

  CreateParadaAsync = async (location, info) => {
    try {
      let response = await fetch('http://192.168.137.1:3000/api/parada',{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: info.nombre,
          coordinates : location.coords,
          description : info.direccion,
          type: info.type,
          // density: info.density
        })
       });

      let result = await response.json();
    } catch(e) {
      this.setState({result: e});
    }
  };

  render() {
    return (

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView keyboardShouldPersistTaps="always" style={{paddingLeft:10,paddingRight:10, height:200}}>
        <View style={styles.container}>
            <Text style={styles.getStartedText}>
              Informacion de la parada
            </Text>
        </View>
        <Form
          ref='registrationForm'
          onFocus={this.handleFormFocus.bind(this)}
          onChange={this.handleFormChange.bind(this)}
          >
          <Separator />
          <InputField
            ref='nombre'
            label='Nombre'
            placeholder='Nombre de la parada'
            helpText={((self)=>{
  
              if(Object.keys(self.refs).length !== 0){
                if(!self.refs.registrationForm.refs.nombre.valid){
                  return self.refs.registrationForm.refs.nombre.validationErrors.join("\n");
                }
  
              }
              
            })(this)}
            validationFunction={[(value)=>{
              /*
              you can have multiple validators in a single function or an array of functions
               */
  
              if(value == '') return "Required";
              //Initial state is null/undefined
              if(!value) return true;
              // Check if First Name Contains Numbers
              // var matches = value.match(/\d+/g);
              // if (matches != null) {
              //     return "First Name can't contain numbers";
              // }
  
              //return true;
            }, (value)=>{
              ///Initial state is null/undefined
              if(!value) return true;
              if(value.indexOf('4')!=-1){
                return "I can't stand number 4";
              }
              return true;
            }]}
            />
          {/* <InputField ref='last_name' placeholder='Last Name'/> */}
          <Separator />
          <InputField
            multiline={true}
            ref='direccion'
            placeholder='Direccion'
            style={{ height: 200} }/>

          <Separator />
          <SwitchField label='Parada tipo terminal'
            ref="type"
            helpText='Si esta seleccionado la parada es de tipo terminal'/>

            {/* {this.state.formData.type == false? <PickerField ref='density'
            label='Densidad poblacional'
            options={{
              D1: '0-20%',
              D2: '20%-40%',
              D3:'40%-60%',
              D4:'60%-80%',
              D5:'80%-100%'
            }}/> : null} */}

          </Form>
          <View style={styles.addNew}>
                <Button title={'Guardar'} color="black" onPress={this.guardarParada } />
          </View>
        </ScrollView>
        </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  addNew:{
    backgroundColor: '#dde9ff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'grey',
    marginTop: 35,
    marginLeft: 60,
    marginRight: 60,
    marginBottom:30
  },
  container: {
    flex: 1,
  },
  getStartedText: {
    fontSize: 25,
    color: 'black',
    lineHeight: 24,
    textAlign: 'center',
    margin: 40,
  },
  buttonContainer:{
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'black',
    margin: 20,
  },
});