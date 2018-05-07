import React from 'react';
import {Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,Button} from 'react-native';
import { Form,
    Separator,InputField, LinkField,
    SwitchField, PickerField,DatePickerField,TimePickerField
  } from 'react-native-form-generator';

export default class FormCT extends React.Component {
  static navigationOptions = {
    header: true,
    title: 'Crear ruta'
  };
  constructor(props){
    super(props);    
    const {state} = props.navigation;
    this.rutas = state.params; 
    this.state = {
      formData:{},
      paradas:[]
    }
    this.ready = false;
    this.obtainOptions();

  }

  componentDidMount(){
    
   }

   obtainOptions = () => {
    for(var i = 0; i < this.rutas.length; i++){
        var aux = JSON.stringify(this.rutas[i].title)
        this.state.paradas[i+1] = aux;
        console.log(this.state.paradas);
        this.setState({ paradas: this.state.paradas })
    }
    this.ready = true;
   }

  handleFormChange(formData){ 
    this.setState({formData:formData})
    this.props.onFormChange && this.props.onFormChange(formData);
  }
  handleFormFocus(e, component){
  }


  

  guardarRuta = () => {
      console.log('Guardar Ruta', this.state.formData);
      this.props.navigation.navigate('Transportes');
  }
  
  render() {
    return (

      
        <ScrollView keyboardShouldPersistTaps="always" style={{paddingLeft:10,paddingRight:10, height:200}}>
        <View style={styles.container}>
            <Text style={styles.getStartedText}>
              Agregar un transporte
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
            placeholder='Nombre de la ruta'
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
          <InputField ref='apellido' label='Apellido' placeholder='Apellido'/>
          <Separator />
          <DatePickerField ref='fnac'
            minimumDate={new Date('1/1/1900')}
            maximumDate={new Date('5/7/2000')}
            placeholder='fecha de nacimiento'/>
          <Separator />
          
          {this.ready === false ?
            null
            :  <PickerField ref='route'
            label='Rutas que cubre'
            options={this.state.paradas}/> }
          </Form>
          <Text>{JSON.stringify(this.state.formData)}</Text>
          <View style={styles.buttonContainer}>
                <Button title={'Guardar'} onPress={this.guardarRuta } />
          </View>
        </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
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