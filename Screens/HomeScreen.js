import { useNavigation, useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet , Text , View , Image , TouchableOpacity, ScrollView, Alert} from "react-native";
import userStore from "../Controller/UserController";
import { GetCategories, PatchData } from "../Controller/DatabaseController";
import * as firebaseAuth from 'firebase/auth'
import { firebaseAppStore } from "../Controller/UserController";
import { CategoryStore } from "../Controller/UserController";
import { useState } from "react";
import React from "react";
export default function HomeScreen()

{   

    const route =  useRoute();
    const navigation = useNavigation();
    const user   =  route.params?.user;
    const auth =  firebaseAuth.getAuth(firebaseAppStore.getState().currentApp);
    const [category, setCategory] = useState([]);
    const  isOnline =  userStore.getState().isUserOnline? true: false ;

  
  React.useEffect ( () => {
    setCategory(CategoryStore.getState().categories);
  } , [CategoryStore.getState().categories])
  

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('state', (event) => {
      // Check if the current screen is HomeScreen
      if (event.data.state.routes[event.data.state.index].name === 'HomeScreen') 
      {     
        if(isOnline)
        {
          GetCategories(auth.currentUser).then((result) => {
            let categories = [];
            for (let prop in result) {
              categories.push(`${prop}`)
            }
          CategoryStore.getState().setCategories(categories);
           console.log(CategoryStore.getState().lastUpdated);
            setCategory(categories);
          })
        }     
         
      }
    });
  
    return unsubscribe;
  }, [navigation]);

  async function FetchDataFromLocalStorage()
  {
      await CategoryStore.getState().hydrate();
  }


  
  return (    
    
    <View style = {styles.container}>
    <ScrollView>
        {category.length != 0 &&   category.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => {
            userStore.getState().SetCurrentUserCategory(item);     
            navigation.navigate("TaskView" , { title: `${item}` })
          }}>
          <View style={styles.button}>
          <Text style={styles.buttonText}>{item}</Text>
          </View>
          <View style={[ { marginTop: 10 }]}>
          </View>
          </TouchableOpacity>     
        ))}
    </ScrollView>
    <StatusBar style="light"/> 

    <TouchableOpacity onPress={() => { navigation.navigate("CategoryCreate")}}>
        <View style={styles.taskButtons} >
            <Text style={styles.buttonText}>Create Task</Text>
        </View>
     </TouchableOpacity>  
    <View style={styles.footer}>
      <Text>Footer content goes here</Text>
      <View style= {styles.footerButtons}>
        <Button title="Buton1"/>
        <Button title="Buton2"/>
        <Button title="Button3"/>
      </View>
    </View>
    <Text></Text> 
  </View>
);


}


const styles=   StyleSheet.create(
{
container:{

    flex:1 ,
    backgroundColor: "#41644A",
    alignItems : 'center',
    justifyContent:'space-evenly',
},

buttonContainer: {
    paddingBottom:0,
    position: 'absolute',
    bottom: 80,
    width: '100%',
    padding: 50,
  backgroundColor:'#41644A'
    

},

taskButtons :{
    width:200,
    backgroundColor:'#41644A',
    height: 50,
    backgroundColor: '#41644A',
    borderRadius: 50,
   justifyContent: 'center',
   alignItems: 'center',
    fontWeight: '100',
    bottom: 45,
    padding:0,

},
footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#263A29',
    alignItems: 'center',
    justifyContent: 'center',
    height:75,
    
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2A2F4F',
    height: 80,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '2A2F4F',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  ScrollView : {
    flex:1,
    


  },
  button: {
    width: 300,
    height: 60,
    backgroundColor: '#E86A33',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '900',
    bottom: 0,
    padding:20
   

  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  box: {
    backgroundColor: 'gray',
    padding: 20,
    borderRadius: 10,
  },
});