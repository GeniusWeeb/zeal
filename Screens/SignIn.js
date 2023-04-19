import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser'
import { StyleSheet, Text, SafeAreaView, useColorScheme, Alert, Button, Image, TouchableOpacity } from 'react-native';
import * as Google from 'expo-auth-session/providers/google'
import * as React from 'react';
import * as firebaseApp from 'firebase/app'
import * as firebaseAuth from 'firebase/auth'
import { ResponseType } from 'expo-auth-session';
import { ScreenStack } from 'react-native-screens';
import { NavigationContext, useNavigation } from '@react-navigation/native';

import {  firebaseConfig, PatchData } from '../Controller/DatabaseController';
import userStore, { useAssignUserController, useUserController } from '../Controller/UserController';

WebBrowser.maybeCompleteAuthSession();


export default function SignIn() {

    const navigation = useNavigation();
    const app =   firebaseApp.initializeApp(firebaseConfig, "Zeal");
    const auth = firebaseAuth.getAuth(app);
    const [accessToken, setAccessToken] = React.useState(null);
    var credential ; 
    const[user ,SetFinalUser] = React.useState(null);
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId :"381324936027-h9b9kblph89k8p70ef2vr4uijs22h0a9.apps.googleusercontent.com",
        iosClientId : "381324936027-bjbcdlp87kshmgntcf56bco0ltdfe13f.apps.googleusercontent.com",
        androidClientId : "381324936027-mnoj4t98j0elf7g7totb9bkjflv76om3.apps.googleusercontent.com"     
      });

    React.useEffect(() => {  
      if (response?.type === "success")
      { 
      
        setAccessToken(response.authentication.accessToken);
        const idToken =response.authentication;
        credential = firebaseAuth.GoogleAuthProvider.credential(idToken.idToken);
      //  SignInGoogle();
      } accessToken && FetchUserInfo() && SignInGoogle();
      }, 
      [response, accessToken]);

     {
        React.useEffect(() =>{

        if(firebaseApp.getApp.length)
         {
          const unsub = auth.onAuthStateChanged(
               (user) =>{
                  console.log("Auth changed")
                userStore.getState().assignUser(user)
         
               }
          );
          return() => unsub ;
        }

          
             

        }, [])

     }
    async function SignInGoogle()
      {        
        try{
          
            let result =  await firebaseAuth.signInWithCredential(auth , credential)
              const user =  result.user;
              userStore.getState().assignUser(result.user);
              SetFinalUser(userStore.getState().currentUser);
              navigation.navigate("HomeScreen");

            }catch (error) {
            console.error(error);
          }
        
      }

    async function FetchUserInfo()
    {

      let response = await fetch("https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` }    
        });  
      const userInfo = await response.json();
      userStore.getState().assignUserPicture(userInfo.picture);    
    }

  return (
    <SafeAreaView style={styles.container}>
    { !user && <Button title=' Login' onPress={() => promptAsync()} />}
    <StatusBar style="dark" />
    </SafeAreaView>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});