import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { InputScreen } from '../screens/InputScreen';
import { OutputScreen } from '../screens/OutputScreen';
import type { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#09090B' },
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="Input" component={InputScreen} />
      <Stack.Screen
        name="Output"
        component={OutputScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
}
