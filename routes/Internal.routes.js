import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Home from '../screens/Internal/Home';
import StationSearch from '../screens/Internal/StationSearch';
import RunningRide from '../screens/Internal/RunningRide';
import ShuttleBusSchedules from '../screens/Internal/ShuttleBusSchedules';
import HeaderRight from '../components/HeaderRight';

import routeNames from '../constants/routeNames';
import colors from '../constants/colors';
import useFetchBuses from '../hooks/useFetchBuses';

const Stack = createStackNavigator();

const InternalRoutes = () => {
  useFetchBuses();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary[500],
        },
        headerTitleStyle: {
          color: '#fff',
          fontFamily: 'RedHatDisplay-SemiBold',
        },
        headerTintColor: '#fff',
      }}>
      <Stack.Screen
        options={{
          title: 'V-Travel - Internal Services',

          headerLeftContainerStyle: {
            marginLeft: 6,
          },

          headerRightContainerStyle: {
            marginRight: 8,
          },

          headerRight: HeaderRight,
        }}
        name={routeNames.INTERNAL.SUB_ROUTES.HOME}
        component={Home}
      />

      <Stack.Screen
        name={routeNames.INTERNAL.SUB_ROUTES.RUNNING_RIDE}
        component={RunningRide}
      />
      <Stack.Screen
        name={routeNames.INTERNAL.SUB_ROUTES.STATION_SEARCH}
        component={StationSearch}
      />
      <Stack.Screen
        name={routeNames.INTERNAL.SUB_ROUTES.SHUTTLE_BUS_TT}
        component={ShuttleBusSchedules}
      />
    </Stack.Navigator>
  );
};

export default InternalRoutes;
