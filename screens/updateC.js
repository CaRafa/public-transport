import React from 'react';
import {Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,Button} from 'react-native';
import { Form,
    Separator,InputField, LinkField,
    SwitchField, PickerField,DatePickerField,TimePickerField
  } from 'react-native-form-generator';

export default class updateC extends React.Component {
  static navigationOptions = {
    header: true,
    title: 'Modificar Conductor'
  };
  constructor(props){
    super(props);    
    const {state} = props.navigation;
    this.Transporte = state.params.transportes; 
    this.id = state.params.id
    this.state = {
      formData:{},
      Transportes:[]
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

  UpdateCondAsync = async () => {
    try {
      let response = await fetch('http://192.168.137.1:3000/api/conductor/'+this.id,{
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tran: this.addingTran,
            tel: this.state.formData.tel,
            status: this.state.formData.status,
            data: true
        })
       });

      let result = await response.json();
      this.setState({result: result.con});
      this.infoLoaded = true;

    } catch(e) {
      this.setState({result: e});
    }
  }
  

  guardarConductor = () => {
      //this.tran = this.Transporte[parseInt(this.state.formData.route)-1]._id;
      this.UpdateCondAsync();
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

      
        <ScrollView keyboardShouldPersistTaps="always" style={{paddingLeft:10,paddingRight:10, height:200}}>
        <View style={styles.container}>
            <Text style={styles.getStartedText}>
              Editar datos del conductor
            </Text>
        </View>
        <Form
          ref='registrationForm'
          onFocus={this.handleFormFocus.bind(this)}
          onChange={this.handleFormChange.bind(this)}
          >
          <Separator />

             <SwitchField label={'Estado'}
              ref={'status'}/>
            
            <InputField
            ref='tel'
            placeholder='Telefono'
            label='Telefono'/>
            
            
          <Separator />
          
            {/* Esto se busca mejorar */}
            { this.Transporte.map( (el,index) =>
              <SwitchField label={parseInt(el.numero)+" - "+el.modelo}
              ref={parseInt(el.numero)}
              onValueChange={this.agregarTran.bind(this,el,index)}/>
            )}
          </Form>
          <View style={styles.addNew}>
                <Button title={'Actualizar'} color="black" onPress={this.guardarConductor } />
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