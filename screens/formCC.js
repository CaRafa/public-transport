import React from 'react';
import {Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,Button} from 'react-native';
import { Form,
    Separator,InputField, LinkField,
    SwitchField, PickerField,DatePickerField,TimePickerField
  } from 'react-native-form-generator';

export default class FormCC extends React.Component {
  static navigationOptions = {
    header: true,
    title: 'Crear Conductor'
  };
  constructor(props){
    super(props);    
    const {state} = props.navigation;
    this.Transporte = state.params; 
    this.state = {
      formData:{},
      Transportes:[]
    }
    // this.ready = false;
    // this.obtainOptions();
    this.addingTran = []
  }

  componentDidMount(){
    
   }

  //  obtainOptions = () => {
  //   for(var i = 0; i < this.Transporte.length; i++){
  //       var aux = JSON.stringify(this.Transporte[i].modelo)
  //       this.state.Transportes[i+1] = aux;
  //       //console.log(this.state.Transportes);
  //       this.setState({ Transportes: this.state.Transportes })
  //   }
  //   console.log(this.state.Transportes);
  //   this.ready = true;
  //  }

  handleFormChange(formData){ 
    this.setState({formData:formData})
    this.props.onFormChange && this.props.onFormChange(formData);
  }
  handleFormFocus(e, component){
  }

  CreateCondAsync = async () => {
    try {
      let response = await fetch('http://192.168.1.106:3000/api/conductor',{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: this.state.formData.name,
            lastName: this.state.formData.lastName,
            ci: parseInt(this.state.formData.ci),
            tran: this.addingTran,
            licencia: parseInt(this.state.formData.licencia),
            fN: this.state.formData.fN,
            tel: this.state.formData.tel,
            status: true
        })
       });

      let result = await response.json();
      this.setState({result: result.con});
      this.infoLoaded = true;
      console.log(this.state.result);

    } catch(e) {
      this.setState({result: e});
      console.log(this.state.result)
    }
  }
  

  guardarConductor = () => {
      console.log('Guardar Conductor', this.state.formData,this.addingTran);
      //this.tran = this.Transporte[parseInt(this.state.formData.route)-1]._id;
      this.CreateCondAsync();
      this.props.navigation.navigate('Conductores');
  }

  agregarTran = (object, index) => {
    if(this.addingTran.length == 0){
      this.addingTran.push(object._id)
    }else{
      var splice = false;
      for(var i=0; i < this.addingTran.length; i++ ){
        if(this.addingTran[i] == object._id){
          this.addingTran.splice(i,1)
          splice=true;
        }
      }
      if(splice == false){
          this.addingTran.push(object._id)
      }
    }
    console.log(this.addingTran);
  }
  
  render() {
    return (

      
        <ScrollView keyboardShouldPersistTaps="always" style={{paddingLeft:10,paddingRight:10, height:200}}>
        <View style={styles.container}>
            <Text style={styles.getStartedText}>
              Agregar un Conductor
            </Text>
        </View>
        <Form
          ref='registrationForm'
          onFocus={this.handleFormFocus.bind(this)}
          onChange={this.handleFormChange.bind(this)}
          >
          <Separator />
          <InputField
            ref='name'
            label='Nombre'
            placeholder='Nombre del Conductor' />
          <InputField
            ref='lastName'
            label='Apellido'
            placeholder='Apellido del Conductor' />
            <InputField
            ref='ci'
            placeholder='Cedula'
            label='v-'/>
            <InputField
            ref='tel'
            placeholder='Telefono'
            label='tel'/>
            <Separator />
            <InputField
            ref='licencia'
            label='#Licencia'
            placeholder='Numero de licencia'/>
            <DatePickerField ref='fN'
            minimumDate={new Date('1/1/1900')}
            maximumDate={new Date('1/1/2000')}
            placeholder='Fecha de Nacimiento'/>
          <Separator />
          {/* {this.ready === false ?
            null
            :  <PickerField ref='route'
            label='Transporte asignado'
            options={this.state.Transportes}/> 
            } */}
            {/* Esto se busca mejorar */}
            { this.Transporte.map( (el,index) =>
              <SwitchField label={parseInt(el.numero)+" - "+el.modelo}
              ref={parseInt(el.numero)}
              onValueChange={this.agregarTran.bind(this,el,index)}/>
            )}
          </Form>
          <Text>{JSON.stringify(this.state.formData)}</Text>
          <View style={styles.buttonContainer}>
                <Button title={'Guardar'} onPress={this.guardarConductor } />
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