import React from 'react';
import {TouchableWithoutFeedback,Keyboard,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,Button} from 'react-native';
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
    this.object = state.params; 
    console.log('objeto que llega a form ct', this.object);
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
     //('tipo de vehiculo',this.state.formData.t_type );
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
          placa: this.state.formData.placa,
          t_type: this.state.formData.t_type,
          active: true,
          color: this.state.formData.color,
          seats: this.state.formData.seats,
        })
       });

      let result = await response.json();
      this.setState({result: result.par});
      this.infoLoaded = true;

    } catch(e) {
      this.setState({result: e});
    }
  }
  CreateTranWithOwnerAsync = async () => {
     
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
          placa: this.state.formData.placa,
          t_type: this.state.formData.t_type,
          active: true,
          color: this.state.formData.color,
          seats: this.state.formData.seats,
          // owner: this.object.owner._id
        })
       });

      let result = await response.json();
      this.setState({result: result.tran});
      this.infoLoaded = true;
      this.UpdateEstadisticaAsync()
      // this.updateConductor();

    } catch(e) {
      this.setState({result: e});
    }
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
          nTransActive:1,
          flag: false
        })
       });

      let result = await response.json();
      this.setState({esta: result.par});
      
    } catch(e) {
      this.setState({result: e});
    }
  }
  

  updateConductor = async () => {
    
    var aux = this.object.owner.transports
    aux.push(this.state.result._id);
    try {
      let response = await fetch('http://192.168.137.1:3000/api/propietario/'+this.object.owner._id,{
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tran: aux,
            data: true
        })
       });

      let result = await response.json();
      // this.setState({result: result.con});
      // this.infoLoaded = true;
     
     
    } catch(e) {
      this.setState({result: e});
    }

  }

  guardarTransporte = () => {

     if(this.object){
        this.CreateTranWithOwnerAsync();
        // this.props.navigation.navigate('Transportes');
        this.props.navigation.goBack(null)
        
      }
      else{
        this.CreateTranAsync();
        this.UpdateEstadisticaAsync()
        this.props.navigation.goBack(null);
      }

  }

  
  
  render() {
    return (

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
            keyboardType='numeric'
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
            ref='color'
            label='Color'
            placeholder='Color del transporte'/>
            <InputField
            ref='year'
            label='Año'
            keyboardType='numeric'
            />
            <InputField
            ref='seats'
            label='Número de puestos'
            keyboardType='numeric'
            />
          
          <PickerField ref='t_type'
            label='Tipo de vehiculo'
            options={{
              "": '',
              Mt: 'Moto taxi',
              taxi: 'Taxi',
              TransP:'Transporte pequeño',
              TransG:'Transporte grande'
            }}/>

          
            

            {/* <Separator />
            <Text  style={{marginBottom:20,marginTop:20 }}>Marque las rutas que recorrera este transporte:</Text>
             */}
            
            {/* {  this.rutas.map( (el,index) =>
              
              
              <SwitchField label={el.title}
              ref={el.title}
              onValueChange={this.agregarRuta.bind(this,el,index)}/>
            
              
            ) 
            
            } */}
            

          </Form>
          <View style={styles.addNew}>
                <Button title={'Guardar'} color="black" onPress={this.guardarTransporte } />
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