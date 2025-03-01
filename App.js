import React, { useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, View, Text, Button, StatusBar } from 'react-native';
import Compass from './components/Compass';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="Compass" component={Page} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const Main = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, marginTop: '50%' }}>
      <Button
        title="to compass"
        onPress={() => navigation.navigate('Compass')}
      />
    </View>
  );
};

const Page = () => {
  const [heading, setHeading] = useState(0);

  return (
    <View style={{ flex: 1, marginTop: '50%', alignItems: 'center' }}>
      <Compass onHeadingChange={setHeading} />
      <Text>{heading ?? 0}°</Text>
    </View>
  );
};
