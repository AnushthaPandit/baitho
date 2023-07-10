import {
  View,
  Center,
  Spinner,
  Heading,
  Box,
  HStack,
  Divider,
  VStack,
  Button,
} from 'native-base';
import {StyleSheet} from 'react-native';
import React, {useRef, useCallback} from 'react';
import RNMapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {useFocusEffect} from '@react-navigation/native';

import RenderWhen from '../../../components/RenderWhen';

import useRunningRide from '../../../hooks/useRunningRide';
import useCoords from '../../../hooks/useCoords';
import useRideLiveStatus from './useRideLiveStatus';

import {formatDistance} from '../../../utils/location.utils';
import colors from '../../../constants/colors';
import circle_car_img from '../../../assets/images/circle_car.png';
import EndRide from './EndRide';

const RunningRide = () => {
  const coords = useCoords();
  const running_ride = useRunningRide();
  const ride_live_status = useRideLiveStatus(running_ride?.bus_plate_number);

  const deltaRef = useRef({latitudeDelta: 0.0092, longitudeDelta: 0.0091});
  const mapViewRef = useRef(null);

  let formatted_distance;

  if (ride_live_status?.distance_km) {
    formatted_distance = formatDistance(ride_live_status?.distance_km);
  }

  const onRgionChange = region => {
    deltaRef.current = {
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    };
  };

  useFocusEffect(
    useCallback(() => {
      if (mapViewRef.current && ride_live_status?.current_location?.longitude) {
        const coordinates = [];

        coordinates[0] = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };

        if (!running_ride?.is_ride_started) {
          coordinates[1] = {
            latitude: ride_live_status?.current_location.latitude,
            longitude: ride_live_status?.current_location.longitude,
          };
        } else {
          coordinates[1] = {
            latitude: running_ride?.drop_off_loc?.latitude,
            longitude: running_ride?.drop_off_loc?.longitude,
          };
        }

        mapViewRef.current.fitToCoordinates(coordinates, {
          edgePadding: {top: 10, right: 80, bottom: 10, left: 80},
          animated: true,
        });
      }
    }, [
      coords.latitude,
      coords.longitude,
      ride_live_status?.current_location?.longitude,
      ride_live_status?.current_location?.latitude,
      running_ride?.is_ride_started,
    ]),
  );

  if (!running_ride) {
    return (
      <Center w="100%" h="100%">
        <Spinner />
        <Heading>Loading...</Heading>
      </Center>
    );
  }

  return (
    <View w={'100%'} h="100%">
      <RNMapView
        ref={r => (mapViewRef.current = r)}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: running_ride.pick_up_loc.latitude,
          longitude: running_ride.pick_up_loc.longitude,
          latitudeDelta: deltaRef.current.latitudeDelta,
          longitudeDelta: deltaRef.current.longitudeDelta,
        }}
        onRegionChange={onRgionChange}
        moveOnMarkerPress={false}
        showsUserLocation
        loadingEnabled>
        {ride_live_status?.current_location ? (
          <Marker
            coordinate={ride_live_status.current_location}
            title="Your driver is here"
            image={circle_car_img}
          />
        ) : null}

        {running_ride?.pick_up_loc ? (
          <Marker
            coordinate={running_ride?.pick_up_loc}
            title="Pick up point"
            pinColor={colors.secondary[900]}
          />
        ) : null}

        {running_ride?.drop_off_loc ? (
          <Marker
            coordinate={running_ride?.drop_off_loc}
            title="Drop off point"
          />
        ) : null}
      </RNMapView>
      <Box position="absolute" bottom={0} width={'100%'}>
        <Box padding={5} bgColor={'#fff'}>
          <RenderWhen isTrue={running_ride?.is_ride_started}>
            <Heading textAlign={'center'} mb={3}>
              Your ride has been started
            </Heading>
          </RenderWhen>
          <RenderWhen isTrue={!running_ride?.is_ride_started}>
            <HStack
              justifyContent={'center'}
              flexWrap={'wrap'}
              space={2}
              alignItems={'center'}>
              <Heading textAlign={'center'} mb={3}>
                Vehicle Number
              </Heading>
              <Heading textAlign={'center'} mb={3} fontWeight={600}>
                {running_ride?.bus_plate_number}
              </Heading>
              <Heading textAlign={'center'} mb={3}>
                has accepted your ride.
              </Heading>
            </HStack>
          </RenderWhen>
          <Divider mb={2} />
          <RenderWhen isTrue={formatted_distance}>
            <VStack space={5}>
              <RenderWhen isTrue={running_ride?.is_ride_started}>
                <HStack
                  justifyContent={'center'}
                  flexWrap={'wrap'}
                  space={2}
                  alignItems={'center'}>
                  <Heading textAlign={'center'} size="md">
                    You're driver is
                  </Heading>
                  <Heading size="md" textAlign={'center'} fontWeight={600}>
                    {formatted_distance}
                  </Heading>
                  <Heading size="md" textAlign={'center'}>
                    away from destination
                  </Heading>
                </HStack>
              </RenderWhen>
              <RenderWhen isTrue={!running_ride?.is_ride_started}>
                <HStack
                  justifyContent={'center'}
                  flexWrap={'wrap'}
                  space={2}
                  alignItems={'center'}>
                  <Heading textAlign={'center'} size="md">
                    You're driver is
                  </Heading>
                  <Heading size="md" textAlign={'center'} fontWeight={600}>
                    {formatted_distance}
                  </Heading>
                  <Heading size="md" textAlign={'center'}>
                    away from pick up point.
                  </Heading>
                </HStack>
              </RenderWhen>
            </VStack>
          </RenderWhen>

          <EndRide plateNumber={running_ride?.bus_plate_number} />
        </Box>
      </Box>
    </View>
  );
};

export default RunningRide;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
