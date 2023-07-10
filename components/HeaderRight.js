import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {IconButton, Menu, HStack, Icon, Text} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import auth from '@react-native-firebase/auth';

import RenderWhen from './RenderWhen';

import useAuth from '../hooks/useAuth';
import {set_service} from '../redux/reducers/authReducer';
import routeNames from '../constants/routeNames';

const HeaderRight = () => {
  const {is_registered_member, service_type} = useAuth();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const switchService = () => {
    const service = service_type === 'internal' ? 'external' : 'internal';
    dispatch(set_service(service));
  };

  return (
    <Menu
      w="190"
      mr={4}
      trigger={triggerProps => {
        return (
          <IconButton
            {...triggerProps}
            size={'md'}
            variant="solid"
            mr={4}
            _icon={{
              as: MaterialCommunityIcons,
              name: 'face-man-profile',
            }}
          />
        );
      }}>
      {is_registered_member ? (
        <>
          <RenderWhen isTrue={service_type === 'internal'}>
            <Menu.Item
              onPress={() =>
                navigation.navigate(
                  routeNames.INTERNAL.SUB_ROUTES.SHUTTLE_BUS_TT,
                )
              }>
              <HStack alignItems={'center'} space={2}>
                <Icon as={MaterialCommunityIcons} name="bus-clock" />
                <Text>Shuttle Bus Time Table</Text>
              </HStack>
            </Menu.Item>
          </RenderWhen>
          <Menu.Item onPress={switchService}>
            <HStack alignItems={'center'} space={2}>
              <Icon as={Octicons} name="arrow-switch" />
              <Text>
                Switch To
                {service_type === 'internal' ? ' External ' : ' Internal '}
                Services
              </Text>
            </HStack>
          </Menu.Item>
        </>
      ) : null}
      <Menu.Item onPress={() => auth().signOut()}>
        <HStack alignItems={'center'} space={2}>
          <Icon as={MaterialCommunityIcons} name="logout-variant" />
          <Text>Log Out</Text>
        </HStack>
      </Menu.Item>
    </Menu>
  );
};

export default HeaderRight;
