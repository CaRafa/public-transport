import React from 'react';
import {TouchableWithoutFeedback,Keyboard,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,Button} from 'react-native';
import { Form,
    Separator,InputField, LinkField,
    SwitchField, PickerField,DatePickerField,TimePickerField
  } from 'react-native-form-generator';

export default class updateC extends React.Component {
  static navigationOptions = {
    header: true,
    title: 'Modificar Propietario'
  };
  constructor(props){
    super(props);    
    const {state} = props.navigation;
    this.Transporte = state.params.transportes; 
    this.id = state.params.id
    this.state = {
      formData:{},
      Transportes:[],
      
    }
    
    this.addingTran = []
  }

  componentDidMount(){
    
   }

  

  handleFormChange(formData){ 
    this.setState({formData:formData})
    this.props.onFormChange && this.props.onFormChange(formData);
  }
  handleFormFocus(e, component){
  }

  UpdateCondAsync = async (transportes) => {
    try {
      let response = await fetch('http://192.168.1.108:3000/api/propietario/'+this.id,{
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tran: transportes,
            tel: this.state.formData.tel,
            data: true
        })
       });

      let result = await response.json();
      this.setState({result: result.con});
      this.infoLoaded = true;
      this.addingTran.forEach(element => {
        this.UpdateTranAsync(this.id,element)
      });


    } catch(e) {
      this.setState({result: e});
    }
  }
  

  UpdateTranAsync = async (owner,_id) => {
    try {
      let response = await fetch('http://192.168.1.108:3000/api/tranporte/'+_id,{
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            owner: owner
        })
       });

      let result = await response.json();
    } catch(e) {
      this.setState({result: e});
    }
  }
  

  guardarConductor = () => {
      
      if(this.addingTran.length == 0){
        this.UpdateCondAsync('none');
      }else{
        this.UpdateCondAsync(this.addingTran);
      }

     // this.UpdateCondAsync();
      this.props.navigation.goBack(null);
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
  
  render() {
    return (

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView keyboardShouldPersistTaps="always" style={{paddingLeft:10,paddingRight:10, height:200}}>
        <View style={styles.container}>
            <Text style={styles.getStartedText}>
              Editar datos del propietario
            </Text>
        </View>
        <Form
          ref='registrationForm'
          onFocus={this.handleFormFocus.bind(this)}
          onChange={this.handleFormChange.bind(this)}
          >
          <Separator />

             
            
            <InputField
            ref='tel'
            placeholder='Telefono'
            label='Telefono'
            keyboardType='phone-pad'
            />
            
            
          <Separator />
          <Text  style={{marginBottom:20,marginTop:20 }}>Marque los transportes de los cuales es dueño:</Text>
            
            {/* Esto se busca mejorar */}
            { this.Transporte.map( (el,index) =>
              <SwitchField label={parseInt(el.number)+" - "+el.model}
              key={index}
              ref={parseInt(el.number)}
              onValueChange={this.agregarTran.bind(this,el,index)}/>
            )}
          </Form>
          <View style={styles.addNew}>
                <Button title={'Actualizar'} color="black" onPress={this.guardarConductor } />
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