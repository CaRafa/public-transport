import React from 'react';
import {TouchableWithoutFeedback,Keyboard,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,Button} from 'react-native';
import { Form,
    Separator,InputField, LinkField,
    SwitchField, PickerField,DatePickerField,TimePickerField
  } from 'react-native-form-generator';

export default class updateT extends React.Component {
  static navigationOptions = {
    header: true,
    title: 'Modificar transporte'
  };
  constructor(props){
    super(props);    
    const {state} = props.navigation;
    this.object = state.params.trans; 
    this.routes = state.params.routes
    this.state = {
      formData:{},
      Transportes:[]
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

  UpdateTranAsync = async () => {
    try {
      let response = await fetch('http://192.168.1.6:3000/api/tranporte/'+this.object._id,{
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: this.state.formData.des,
            // route: this.addingRoutes,
            active: this.state.formData.status,
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
  

  updateTransporte = () => {
      //this.tran = this.Transporte[parseInt(this.state.formData.route)-1]._id;
      this.UpdateTranAsync();
      this.props.navigation.goBack(null);
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

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView keyboardShouldPersistTaps="always" style={{paddingLeft:10,paddingRight:10, height:200}}>
        <View style={styles.container}>
            <Text style={styles.getStartedText}>
              Editar datos del transporte
            </Text>
        </View>
        <Form
          ref='registrationForm'
          onFocus={this.handleFormFocus.bind(this)}
          onChange={this.handleFormChange.bind(this)}
          >
          <Separator />

            <SwitchField label={'Estado'}
              ref={'status'}
              
              />
            <InputField
            ref='des'
            multiline={true}
            placeholder='Descripcion'
            helpText='Algun comentario sobre el transporte' 
            style={{ height: 200} }/>
          <Separator />

          
            
          {/* <Separator /> */}
          
            {/* Esto se busca mejorar */}
            {/* { this.routes.map( (el,index) =>
              
              <SwitchField label={el.title}
              ref={el.title}
              onValueChange={this.agregarRuta.bind(this,el,index)}/>
            
            ) } */}

          </Form>
          <View style={styles.addNew}>
                <Button title={'Actualizar'} color="black" onPress={this.updateTransporte } />
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