import { Button, StyleSheet, Text, View } from "react-native";
import notifee, {AndroidImportance, AuthorizationStatus, EventType} from '@notifee/react-native'
import {useEffect, useState} from 'react'

export default function App(){
  const [state, setState] = useState(true)
  useEffect(()=>{
    async function getPermission() {
      const settings = await notifee.requestPermission()
      if(settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED){
        console.log('Permissao: ' + settings.authorizationStatus)
        setState(true)
      } else {
        console.log('Usário negou permissão')
        setState(false)
      }
    }

    getPermission()
  }, [])
  useEffect(()=>{
    return notifee.onForegroundEvent(({type, detail})=>{
      switch(type){
        case EventType.DISMISSED:
          console.log('Usuário descartou a notificação')
          break;
        case EventType.PRESS:
          console.log('tocou: ' + detail.notification)
          break
      }
    })
  }, [])
  async function handleNotification(){
    if(!state){
      return;
    } 
    const chanelId:any = await notifee.createChannel({
      id: 'lembrete',
      name: 'lembrete',
      vibration: true,
      importance: AndroidImportance.HIGH
    })

    await notifee.displayNotification({
      id: 'lembrete',
      title: 'estudar',
      body: 'Lembrete para estudar react-native',
      android: {
        channelId: chanelId,
        pressAction: {
          id: 'default'
        }
      }
    })
  }
  return(
    <View style={Container.container}>
      <Text style={Container.text}>Notify 2</Text>
      <Button title="enviar noti" onPress={handleNotification}/>
    </View>
  )
}

const Container = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text:{
    fontWeight: 'bold',
    color: '#000'
  }
})