import React from 'react';
import {RefreshControl,TouchableWithoutFeedback,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,Button,Keyboard} from 'react-native';
import { Form,
    Separator,InputField, LinkField,
    SwitchField, PickerField,DatePickerField,TimePickerField
  } from 'react-native-form-generator';

export default class FormCC extends React.Component {
  static navigationOptions = {
    header: true,
    title: 'Crear Propietario'
  };
  constructor(props){
    super(props);    
    const {state} = props.navigation;
    this.Transporte = state.params; 
    this.state = {
      formData:{},
      Transportes: this.Transporte,
      lastRefresh: Date(Date.now()).toString(),
      refreshing: false,
    }
    
    this.addingTran = []
  }

  componentDidMount(){
    
   }

   _fetchTransportesAsync = async () => {
    try {
      let response = await fetch('http://192.168.137.1:3000/api/transporte',{
        method: 'GET'});
      let result = await response.json();
      this.setState({Transportes: result.transporte}); 
      

    } catch(e) {
      this.setState({transporte: e});
    }
  }

  handleFormChange(formData){ 
    this.setState({formData:formData})
    this.props.onFormChange && this.props.onFormChange(formData);
  }
  handleFormFocus(e, component){
  }

  CreateCondAsync = async () => {
    try {
      let response = await fetch('http://192.168.137.1:3000/api/propietario',{
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
            tel: this.state.formData.tel
        })
       });

      let result = await response.json();
      this.setState({result: result.con});
      this.infoLoaded = true;
      this.addingTran.forEach(element => {
        this.UpdateTranAsync(this.state.result,element)
      });
     
      this.props.navigation.goBack(null)
      // this.props.navigation.navigate('FormCT',{ formP:true, owner: this.state.result })

    } catch(e) {
      this.setState({result: e});
    }
  }

  addTransport = () => {
    this.props.navigation.navigate('FormCT',{ formP:true, owner: this.state.result, key:this.props.navigation.state.key })

  }

  UpdateTranAsync = async (owner,_id) => {
    try {
      let response = await fetch('http://192.168.137.1:3000/api/tranporte/'+_id,{
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            owner: owner._id
        })
       });

      let result = await response.json();
    } catch(e) {
      this.setState({result: e});
    }
  }
  

  guardarConductor = () => {
      //this.tran = this.Transporte[parseInt(this.state.formData.route)-1]._id;
      
      this.CreateCondAsync();
      
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
  }

  _onRefresh() {
    this.setState({refreshing: true});
    // this._fetchTransportesAsync()
    this._fetchTransportesAsync().then(() => {
      this.setState({refreshing: false});
    });
  }
  
  render() {
    return (

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        } style={{paddingLeft:10,paddingRight:10, height:200}}>

        
        <View style={styles.container}>
            <Text style={styles.getStartedText}>
              Agregar un Propietario
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
            placeholder='Nombre del Propietario' />
          <InputField
            ref='lastName'
            label='Apellido'
            placeholder='Apellido del Propietario' />
            <InputField
            ref='ci'
            placeholder='Cedula'
            label='v-'
            keyboardType='numeric'
            />
            <InputField
            ref='tel'
            placeholder='Telefono'
            label='Telefono'
            keyboardType='phone-pad'
            />
            {/* <Separator /> */}
         
            <DatePickerField ref='fN'
            minimumDate={new Date('1/1/1900')}
            maximumDate={new Date('1/1/2000')}
            placeholder='Fecha de Nacimiento'/> 
          <Separator />
         
            {/* Esto se busca mejorar */}
            <Text  style={{marginBottom:20,marginTop:20 }}>Marque los transportes de los cuales es dueño:</Text>
            
            { this.state.Transportes.map( (el,index) =>
              <SwitchField label={parseInt(el.number)+" - "+el.model+" - "+el.licPlate}
              key={index}
              ref={parseInt(el.number)}
              onValueChange={this.agregarTran.bind(this,el,index)}/>
            )}
          </Form>
          <View style={styles.addNew}>
                <Button title={'Guardar'} color="black" onPress={this.guardarConductor } />
          </View>
          <View style={styles.addNew}>
                <Button title={'Agregar un transporte'} color="black" onPress={this.addTransport } />
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
    marginRight: 60
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