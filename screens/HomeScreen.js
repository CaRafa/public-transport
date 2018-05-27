import React from 'react';
import {RefreshControl,Image,Platform, ScrollView,StyleSheet,Text, TouchableOpacity,View,} from 'react-native';


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,

  };

  constructor(props){ 
    super(props)
    this.state = {
      estadistica: undefined,
      refreshing: false,
    }
   }
   
  componentDidMount(){
    this._fetchEstadisticaAsync();
    
   } 


   _fetchEstadisticaAsync = async () => {
    try {
      let response = await fetch('http://192.168.1.106:3000/api/estadistica/5b0abe2379be3b1284a1c3f9' ,{
        method: 'GET'
       });

      let result = await response.json();
      this.setState({estadistica: result.est});

    } catch(e) {
      this.setState({result: e});
       //(this.state.result)
    }
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this._fetchEstadisticaAsync().then(() => {
      this.setState({refreshing: false});
    });
  }

  render() {
    return (
      <View style={styles.container}>
         <ScrollView refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }  >   
            <View style={{ justifyContent: 'center',
            alignItems: 'center', marginTop:30}}>
            <Image 
            style={{width: 200, height: 200,}}
            source={
              require('./../assets/images/hatillo9.jpg')
              }
              
              
            />
              </View>
              <Text style={styles.getStartedTitle}>
              Bienvenido.
            </Text>
            { ! this.state.estadistica ? 
            <Text style={styles.getStartedTitle}>
                 Porfavor espere.
            </Text>
            
            :
              <Text style={styles.getStartedText}>
              - Herramienta de administración para el transporte público. Datos relevantes:
              {"\n"} {"\n"} • Transportes en servicio - {!this.state.estadistica? 'N/A': this.state.estadistica.nTransActive}{"\n"}
              / Transportes fuera de servicio - {!this.state.estadistica? 'N/A': this.state.estadistica.nTransOut}
              {"\n"}{"\n"} • Rutas - { ! this.state.estadistica?'N/A': this.state.estadistica.nRutas  }
              {"\n"}{"\n"} • Paradas -  {!this.state.estadistica? 'N/A':this.state.estadistica.nParadas }{"\n"}{"\n"}

            </Text>
            }
            </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  getStartedTitle: {
    fontSize: 28,
    color: 'black',
    lineHeight: 30,
    textAlign: 'center',
    margin: 5,
  },
  getStartedText: {
    fontSize: 18,
    color: 'grey',
    lineHeight: 20,
    textAlign: 'center',
    margin: 5,
  },
  hint: {
    fontSize: 20,
    color: 'black',
    lineHeight: 20,
    textAlign: 'center'
  }
});
