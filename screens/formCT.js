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
    this.addingRoutes = []
    

  }

  componentDidMount(){
    
   }

  

  handleFormChange(formData){ 
    this.setState({formData:formData})
    this.props.onFormChange && this.props.onFormChange(formData);
  }
  handleFormFocus(e, component){
  }

  CreateTranAsync = async () => {
    try {
      let response = await fetch('http://192.168.137.1:3000/api/transporte',{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          numero: parseInt(this.state.formData.num),
          description: this.state.formData.des,
          modelo: this.state.formData.model,
          year: this.state.formData.year,
          route: this.addingRoutes,
          type: this.state.formData.type,
          placa: this.state.formData.placa,
          t_type: this.state.formData.t_type
        })
       });

      let result = await response.json();
      this.setState({result: result.par});
      this.infoLoaded = true;

    } catch(e) {
      this.setState({result: e});
    }
  }
  

  guardarTransporte = () => {
      this.CreateTranAsync();
      this.props.navigation.navigate('Transportes');
  }

  agregarRuta = (object, index) => {
    if(this.addingRoutes.length == 0){
      this.addingRoutes.push(object._id)
    }else{
      var splice = false;
      for(var i=0; i < this.addingRoutes.length; i++ ){
        if(this.addingRoutes[i] == object._id){
          this.addingRoutes.splice(i,1)
          splice=true;
        }
      }
      if(splice == false){
          this.addingRoutes.push(object._id)
      }
    }
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
            ref='num'
            label='Numero'
            placeholder='Numero del transporte'
            
            />
            <InputField
            multiline={true}
            ref='des'
            placeholder='Descripcion'
            helpText='Algun comentario sobre el transporte' 
            style={{ height: 200} }/>

            <InputField
            ref='model'
            label='Modelo'
            placeholder='marca del tranporte'/>
            <InputField
            ref='placa'
            label='Placa'
            placeholder='Placa del transporte'/>
            <InputField
            ref='year'
            label='Año'/>
          
          <PickerField ref='t_type'
            label='Tipo de vehiculo'
            options={{
              "": '',
              Mt: 'Moto taxi',
              taxi: 'Taxi',
              TransP:'Transporte pequeño',
              TransG:'Transporte grande'
            }}/>

          
            

            <Separator />
            <Text  style={{marginBottom:20,marginTop:20 }}>Marque las rutas que recorrera este transporte:</Text>
            
            {  this.rutas.map( (el,index) =>
              
              
              <SwitchField label={el.title}
              ref={el.title}
              onValueChange={this.agregarRuta.bind(this,el,index)}/>
            
              
            ) 
            
            }
            

          </Form>
          <View style={styles.addNew}>
                <Button title={'Guardar'} color="black" onPress={this.guardarTransporte } />
          </View>
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
  buttonContainer:{
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'black',
    margin: 20,
  },
});