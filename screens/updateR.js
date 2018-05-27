import React from 'react';
import {TouchableWithoutFeedback,Keyboard,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,Button} from 'react-native';
import { Form,
    Separator,InputField, LinkField,
    SwitchField, PickerField,DatePickerField,TimePickerField
  } from 'react-native-form-generator';

export default class updateR extends React.Component {
    static navigationOptions = {
        header: true,
        title: 'Update ruta'
      };
      constructor(props){
        super(props);
        const {state} = props.navigation;
        this.object = state.params; 
        
        this.state = {
          formData:{}
        }
    
      }

      handleFormChange(formData){ 
        this.setState({formData:formData})
        this.props.onFormChange && this.props.onFormChange(formData);
      }

      handleFormFocus(e, component){
      }
    
    
      UpdateRutaAsync = async () => {
        try {
          let response = await fetch('http://192.168.1.106:3000/api/ruta/'+this.object.id ,{
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: this.state.formData.nombre,
                route: this.object.cord,
                description: this.state.formData.des,
                type: this.state.formData.type,
                distance: this.object.dis,
                paradas: this.object.par
            })
           });
    
          let result = await response.json();
          this.setState({result: result.par});
    
        } catch(e) {
          this.setState({result: e});
           //(this.state.result)
        }
      }
    
      actualizarRuta = () => {
          
          this.UpdateRutaAsync();
          this.props.navigation.navigate('Rutas');
      }
      
      render() {
        return (
    
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView keyboardShouldPersistTaps="always" style={{paddingLeft:10,paddingRight:10, height:200}}>
            <View style={styles.container}>
                <Text style={styles.getStartedText}>
                  Editar datos de la ruta
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
                placeholder='Nombre de la ruta' />
              
              <Separator />
              <InputField
                multiline={true}
                ref='des'
                placeholder='descripción'
                helpText='Algun comentario sobre esta ruta' 
                style={{ height: 200} }/>
              <Separator />
            
              
              <PickerField ref='type'
                label='Tipo de ruta'
                options={{
                  "": '',
                  subUrb: 'Sub urbano',
                  Urb: 'Urbano',
                  Int:'Inter Urbano'
                }}/>
                
              </Form>

              <View style={styles.addNew}>
                    <Button title={'Actualizar'} color="black" onPress={this.actualizarRuta } />
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