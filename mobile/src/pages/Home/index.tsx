import React , {useState, useEffect}from 'react';
import {View,ImageBackground, StyleSheet, Text, Image, TextInput, KeyboardAvoidingView, Platform, Picker} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {Feather as Icon} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';


interface IBGEUfResponse{
    sigla: string;
}

interface cityResponse{
    nome: string;
}

const Home = () =>{
    const [ufs, setUFs] = useState<string[]>([]);
    const [citys, setCitys] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const navigation = useNavigation();

   function handleNavigationToPooints(){
       navigation.navigate('Points',{
        selectedUf,
        selectedCity
       });

       console.log(selectedCity, selectedUf)
   }

    useEffect(()=>{
        axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response=>{
            const ufInitals= response.data.map(uf=>uf.sigla);

        setUFs(ufInitals);
        });
    },[])

    useEffect(() =>{
        axios.get<cityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(response=>{
            const cityNames = response.data.map(city=>city.nome);
            setCitys(cityNames);
        });

    },[selectedUf])
    return(
        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS ==='ios' ? 'padding' : undefined}>
            <ImageBackground 
                source={require('../../assets/home-background.png')} 
                style={styles.container}
                imageStyle={{width:274, height:368}}
            >           
                <View style={styles.main}>
                <Image source={require('../../assets/logo.png')}/>
                <Text style={styles.title}>Seu Marketplace de coleta de residuos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encotrarem pontos de coleta de forma eficiente.</Text>
                </View>
                <View style={styles.footer}>
                   <Text>Selecione a UF</Text>
                    <Picker
                        selectedValue={selectedUf}
                        style={styles.input}
                        onValueChange={(itemValue, itemIndex) => setSelectedUf(itemValue)}
                    >
                    {                                
                        ufs.map(uf=>(
                            <Picker.Item   key={uf.toString()} label={uf} value={uf} />
                        ))
                    }
                    </Picker>
                   
                    <Text>Selecione a Cidade</Text>
                     <Picker
                        selectedValue={selectedCity}
                        style={styles.input}
                        onValueChange={(itemValue, itemIndex) => setSelectedCity(itemValue)}
                    >
                    {    
                                                    
                        citys.map(city=>(
                            
                            <Picker.Item key={city.toString()} label={city} value={city} />
                        ))
                    }
                    </Picker>
                   
                    <RectButton style={styles.button} onPress={handleNavigationToPooints}>
                        <View  style={styles.buttonIcon}>
                            <Text> 
                                <Icon name="arrow-right" color="#fff" size={24}/>
                            </Text>                        
                        </View>
                        <Text style={styles.buttonText} > 
                            Entrar
                        </Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
       
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });
export default Home;