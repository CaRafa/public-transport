import React from 'react';
import {Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,Button} from 'react-native';
import { Form,
    Separator,InputField, LinkField,
    SwitchField, PickerField,DatePickerField,TimePickerField
  } from 'react-native-form-generator';

export default class FormCH extends React.Component {
  static navigationOptions = {
    header: true,
    title: 'Crear ruta'
  };
  constructor(props){
    super(props);    
    const {state} = props.navigation;
    this.transportes = state.params.transportes; 
    this.id = state.params.id
    this.horario = state.params.horario
    this.state = {
      formData:{},
      paradas:[]
    }
    this.transJson = []
    //this.ready = false;
   this.obtainOptions();

  }

  componentDidMount(){
    
   }

   obtainOptions = () => {
       
    for(var i = 0; i < this.transportes.length; i++){
        var number = this.transportes[i].numero
        this.transJson.push(this.transportes[i])
        var aux =  number+' - '+JSON.stringify(this.transportes[i].modelo)
        this.state.paradas[i+1] = aux;
        this.setState({ paradas: this.state.paradas })
    }
    this.transJson.push("descanso")
    this.state.paradas.push("descanso")
    this.ready = true;
   }

  handleFormChange(formData){ 
    this.setState({formData:formData})
    this.props.onFormChange && this.props.onFormChange(formData);
  }
  handleFormFocus(e, component){
  }

  UpdateHorarioAsync = async () => {
    try {
      let response = await fetch('http://192.168.137.1:3000/api/conductor/'+this.id,{
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          horario: this.horario,
          data: false

        })
       });

      let result = await response.json();
      this.setState({result: result.cond});
      this.infoLoaded = true;

    } catch(e) {
      this.setState({result: e});
    }
  }
  

 

  setHorario = () => {
    this.horario = []
    if(this.state.formData.lunes){
        var aux = {dia: 'lunes', asig: this.transJson[this.state.formData.lunes-1]}
        this.horario.push(aux);
    }
    if(this.state.formData.martes){
      var aux = {dia: 'martes', asig: this.transJson[this.state.formData.martes-1]}
        this.horario.push(aux);
    }
    if(this.state.formData.miercoles){
      var aux = {dia: 'miercoles', asig: this.transJson[this.state.formData.miercoles-1]}
        this.horario.push(aux);
    }
    if(this.state.formData.jueves){
      var aux = {dia: 'jueves', asig: this.transJson[this.state.formData.jueves-1]}
        this.horario.push(aux);
    }
    if(this.state.formData.viernes){
      var aux = {dia: 'viernes', asig: this.transJson[this.state.formData.viernes-1]}
        this.horario.push(aux);
    }
    if(this.state.formData.sabado){
      var aux = {dia: 'sabado', asig: this.transJson[this.state.formData.sabado-1]}
        this.horario.push(aux);
    }
    if(this.state.formData.domingo){
      var aux = {dia: 'domingo', asig: this.transJson[this.state.formData.domingo-1]}
        this.horario.push(aux);
    }

    this.UpdateHorarioAsync().then(function(res){
      
    })
    this.props.navigation.goBack(null)
  }
  
  render() {

    
      return (

        <ScrollView keyboardShouldPersistTaps="always" style={{paddingLeft:10,paddingRight:10, height:200}}>
          {this.horario? <Text style={styles.horarioTitle}>
          Horario
           </Text>: null

          }

          {this.horario? this.horario.map(el => 
          
          <Text style={styles.horarioText}>
            - {el.dia} : {el.asig == "descanso"? "Descanso" : el.asig.modelo} 
          </Text>  
          ) : 
           <View style={styles.container}>
           <Text style={styles.getStartedText}>
             Crear un horario
           </Text>
       </View>
          }
          <Form
            ref='registrationForm'
            onFocus={this.handleFormFocus.bind(this)}
            onChange={this.handleFormChange.bind(this)}
            >
            <Separator />
              {/* esto es lo que se debe intentar mejorar */}
            {this.ready === false ?
              null
              :  <PickerField ref='lunes'
              label='Lunes'
              options={this.state.paradas}/> 
              }
            {this.ready === false ?
              null
              :  <PickerField ref='martes'
              label='martes'
              options={this.state.paradas}/> 
              }
            {this.ready === false ?
              null
              :  <PickerField ref='miercoles'
              label='miercoles'
              options={this.state.paradas}/> 
              }
            {this.ready === false ?
              null
              :  <PickerField ref='jueves'
              label='jueves'
              options={this.state.paradas}/> 
              }
            {this.ready === false ?
              null
              :  <PickerField ref='viernes'
              label='viernes'
              options={this.state.paradas}/> 
              }
            {this.ready === false ?
              null
              :  <PickerField ref='sabado'
              label='sabado'
              options={this.state.paradas}/> 
              }
            {this.ready === false ?
              null
              :  <PickerField ref='domingo'
              label='domingo'
              options={this.state.paradas}/> 
              }
              {/* esto es lo que se debe intentar mejorar */}
              <Separator />
              

            </Form>
            {!this.horario? 
            <View style={styles.addNew}>
                  <Button title={'Guardar'} color="black" onPress={this.setHorario } />
            </View>: 
            <View style={styles.addNew}>
            <Button title={'Actualizar'} color="black" onPress={this.setHorario } />
      </View>
            }
          </ScrollView>
      
        

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
  horarioTitle: {
    fontSize: 25,
    color: 'black',
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 50,
  },
  horarioText: {
    fontSize: 16,
    color: 'black',
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer:{
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'black',
    margin: 20,
  },
});