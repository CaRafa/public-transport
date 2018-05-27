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
    this.rutas = state.params.rutas; 
    this.id = state.params.id
    this.horario = state.params.horario
    this.state = {
      formData:{},
      paradas:[]
    }
    this.rutasJson = []
    //this.ready = false;
   this.obtainOptions();

  }

  componentDidMount(){
    
   }

   obtainOptions = () => {
       
    for(var i = 0; i < this.rutas.length; i++){
        // var number = this.rutas[i].number
        this.rutasJson.push(this.rutas[i])
        var aux =  JSON.stringify(this.rutas[i].title)+' - '+Math.round(this.rutas[i].distance/1000)+'Km' 
        this.state.paradas[i+1] = aux;
        this.setState({ paradas: this.state.paradas })
    }
    this.rutasJson.push("descanso")
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
      let response = await fetch('http://192.168.1.106:3000/api/tranporte/'+this.id,{
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
      this.setState({result: result.trans});
       //('RESPUESTA PUT', this.state.result)
      this.infoLoaded = true;

    } catch(e) {
      this.setState({result: e});
    }
  }
  

 

  setHorario = () => {
    this.horario = []
    if(this.state.formData.lunes){
        var aux = {dia: 'lunes', asig: this.rutasJson[this.state.formData.lunes-1]._id}
        this.horario.push(aux);
    }else{
      var aux = {dia: 'lunes', asig: 'descanso'}
        this.horario.push(aux);
    }
    if(this.state.formData.martes){
      var aux = {dia: 'martes', asig: this.rutasJson[this.state.formData.martes-1]._id}
        this.horario.push(aux);
    }else{
      var aux = {dia: 'martes', asig: 'descanso'}
        this.horario.push(aux);
    }

    if(this.state.formData.miercoles){
      var aux = {dia: 'miercoles', asig: this.rutasJson[this.state.formData.miercoles-1]._id}
        this.horario.push(aux);
    }else{
      var aux = {dia: 'miercoles', asig: 'descanso'}
        this.horario.push(aux);
    }
    if(this.state.formData.jueves){
      var aux = {dia: 'jueves', asig: this.rutasJson[this.state.formData.jueves-1]._id}
        this.horario.push(aux);
    }else{
      var aux = {dia: 'jueves', asig: 'descanso'}
        this.horario.push(aux);
    }
    if(this.state.formData.viernes){
      var aux = {dia: 'viernes', asig: this.rutasJson[this.state.formData.viernes-1]._id}
        this.horario.push(aux);
    }else{
      var aux = {dia: 'viernes', asig: 'descanso'}
        this.horario.push(aux);
    }
    if(this.state.formData.sabado){
      var aux = {dia: 'sabado', asig: this.rutasJson[this.state.formData.sabado-1]._id}
        this.horario.push(aux);
    }else{
      var aux = {dia: 'sabado', asig: 'descanso'}
        this.horario.push(aux);
    }
    if(this.state.formData.domingo){
      var aux = {dia: 'domingo', asig: this.rutasJson[this.state.formData.domingo-1]._id}
        this.horario.push(aux);
    }else{
      var aux = {dia: 'domingo', asig: 'descanso'}
        this.horario.push(aux);
    }
     //('HORARIO PARA ACTUALIZAR', this.horario);
    this.UpdateHorarioAsync().then(function(res){
      
    })
    this.props.navigation.goBack(null)
  }
  
  render() {

    
      return (

        <ScrollView keyboardShouldPersistTaps="always" style={{paddingLeft:10,paddingRight:10, height:200}}>
          {/* {this.horario? <Text style={styles.horarioTitle}>
          Horario
           </Text>: null

          } */}

          {this.horario?  <View style={styles.container}>
                <Text style={styles.getStartedText}>
                  Actualizar horario
                </Text>
           </View>: 
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