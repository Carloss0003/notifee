import { Button, StyleSheet, Text, View } from "react-native";
import notifee, {AndroidImportance, AuthorizationStatus, EventType, TimestampTrigger, TriggerType} from '@notifee/react-native'
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

  notifee.onBackgroundEvent(async ({type, detail}) => {
    const {notification, pressAction} = detail

    if(type === EventType.PRESS){
      console.log('tocou na notificação' + pressAction?.id)
    }
    if(notification?.id){
      await notifee.cancelNotification(notification.id)
    }
    console.log('Event Background')
  })

  useEffect(()=>{
    return notifee.onForegroundEvent(({type, detail})=>{
      switch(type){
        case EventType.DISMISSED:
          console.log('Usuário descartou a notificação')
          break;
        case EventType.PRESS:
          console.log(detail.notification)
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

  async function handleScaleNotification(){
    const date = new Date(Date.now())

    date.setMinutes(date.getMinutes() + 1)
    const trigger:TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime()
    }
    await notifee.createTriggerNotification({
      title: 'Lembrete Estudar',
      body: 'Estudar JS ás 15:30',
      android: {
        channelId: 'lembrete',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default'
        }
      }
    }, trigger)
  }
  async function listNotification(){
    notifee.getTriggerNotificationIds()
    .then((response)=>{
      console.log(response)
    })
  }

  async function handleCancelNotification(){
    await notifee.cancelNotification("cbeEVWhEgSQKe2SR89im")
  }
  return(
    <View style={Container.container}>
      <Text style={Container.text}>Notify 2</Text>
      <Button title="enviar noti" onPress={handleNotification}/>
      <Button title="agendar noti" onPress={handleScaleNotification}/>
      <Button title="Listar noti" onPress={listNotification}/>
      <Button title="Cancel noti" onPress={handleCancelNotification}/>
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