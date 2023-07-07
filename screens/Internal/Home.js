import {
  View,
  Pressable,
  Box,
  HStack,
  Heading,
  Icon,
  Center,
  Spinner,
  VStack,
  Button,
  WarningOutlineIcon,
  Text,
} from 'native-base';
import React, {useRef, useEffect, useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import RNMapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import MapViewDirections from 'react-native-maps-directions';

import useCoords from '../../hooks/useCoords';
import useInternalSearchData from '../../hooks/useInternalSearchData';
import useRideReq from '../../hooks/useRideReq';
import useAuth from '../../hooks/useAuth';
import useRunningRide from '../../hooks/useRunningRide';

import routeNames from '../../constants/routeNames';
import colors from '../../constants/colors';
import configs from '../../configs';
import {add_request, del_request} from '../../utils/firestore.utils';
import {haversine} from '../../utils/location.utils';

import Container from '../../components/Container';
import RenderWhen from '../../components/RenderWhen';

const Home = () => {
  const current_loc = useCoords();
  const {data, setreset, setDest, setSource} = useInternalSearchData();
  const {uid} = useAuth();
  const ride_req_obj = useRideReq();
  const running_ride = useRunningRide();

  const [isRideReqLoading, setisRideReqLoading] = useState(false);
  const [isCancelReqLoading, setisCancelReqLoading] = useState(false);
  const navigation = useNavigation();

  const deltaRef = useRef({latitudeDelta: 0.0092, longitudeDelta: 0.0091});
  const mapViewRef = useRef(null);

  const onRgionChange = region => {
    deltaRef.current = {
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    };
  };

  const handle_long_press = (e, curr_loc) => {
    setDest({coords: e.nativeEvent.coordinate});
    setSource({coords: {...curr_loc}});
  };

  const make_ride_req = async () => {
    setisRideReqLoading(true);
    distance = haversine(
      current_loc.latitude,
      current_loc.longitude,
      data.dest.coords.latitude,
      data.dest.coords.longitude,
    ).toFixed(2);
    await add_request(
      {
        pick_up_loc: {
          latitude: current_loc.latitude,
          longitude: current_loc.longitude,
        },

        drop_off_loc: {
          latitude: data.dest.coords.latitude,
          longitude: data.dest.coords.longitude,
        },

        status: 'pending',
        uid,
        distance,
      },
      uid,
    );
    setSource({
      coords: {
        latitude: current_loc.latitude,
        longitude: current_loc.longitude,
      },
    });

    console.log('source');
    setisRideReqLoading(false);
  };

  const cancel_request = async () => {
    setisCancelReqLoading(true);
    await del_request(uid);
    setisCancelReqLoading(false);
  };

  let distance;

  useFocusEffect(
    useCallback(() => {
      if (mapViewRef.current && data.source) {
        const coordinates = [];

        coordinates[0] = {
          latitude: data.source.coords.latitude,
          longitude: data.source.coords.longitude,
        };

        if (data.dest) {
          coordinates[1] = {
            latitude: data.dest.coords.latitude,
            longitude: data.dest.coords.longitude,
          };
        }

        mapViewRef.current.fitToCoordinates(coordinates, {
          edgePadding: {top: 10, right: 80, bottom: 10, left: 80},
          animated: true,
        });
      }
    }, [data.source, data.dest, current_loc]),
  );

  useFocusEffect(
    useCallback(() => {
      if (running_ride) {
        navigation.navigate(routeNames.INTERNAL.SUB_ROUTES.RUNNING_RIDE);
      }
    }, [running_ride, navigation]),
  );

  if (!current_loc.latitude) {
    return (
      <Center w="100%" h="100%">
        <Spinner />
        <Heading>Loading...</Heading>
      </Center>
    );
  }

  return (
    <View h="100%">
      <RenderWhen isTrue={current_loc.latitude}>
        <RNMapView
          ref={r => (mapViewRef.current = r)}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: current_loc.latitude,
            longitude: current_loc.longitude,
            latitudeDelta: deltaRef.current.latitudeDelta,
            longitudeDelta: deltaRef.current.longitudeDelta,
          }}
          onRegionChange={onRgionChange}
          onLongPress={e => handle_long_press(e, current_loc)}
          moveOnMarkerPress={false}
          showsUserLocation
          loadingEnabled>
          {Boolean(data.source) ? (
            <Marker
              coordinate={{
                latitude: data.source?.coords.latitude,
                longitude: data.source?.coords.longitude,
              }}
              title={'Pick Up Point'}
              pinColor={colors.secondary[900]}
            />
          ) : null}

          {data.dest ? (
            <Marker
              coordinate={{
                latitude: data.dest.coords.latitude,
                longitude: data.dest.coords.longitude,
              }}
              title={'Drop Off Point'}
            />
          ) : null}

          {data.dest ? (
            <MapViewDirections
              origin={data.source.coords}
              destination={data.dest.coords}
              apikey={configs.GOOGLE_MAP_API_KEY}
              strokeWidth={3}
              strokeColor="hotpink"
            />
          ) : null}
        </RNMapView>
      </RenderWhen>

      <Container padding={0} h="100%" w="100%">
        <RenderWhen isTrue={!ride_req_obj}>
          <VStack padding={4} space={3}>
            {/* <InputButton
              Icon={<Icon as={FontAwesome} name={'circle-o'} />}
              placeholder={'Choose Your Pick up point'}
              value={data.source?.title}
              onPress={() =>
                navigation.navigate(
                  routeNames.INTERNAL.SUB_ROUTES.STATION_SEARCH,
                  {type: 'src'},
                )
              }
            /> */}
            {/* <InputButton
              Icon={<Icon as={MaterialIcons} name={'location-pin'} />}
              placeholder={'Choose Your drop off point'}
              value={data.dest?.title}
              onPress={() =>
                navigation.navigate(
                  routeNames.INTERNAL.SUB_ROUTES.STATION_SEARCH,
                  {type: 'dest'},
                )
              }
            /> */}

            <RenderWhen isTrue={!data.dest}>
              <Box borderRadius={'md'} padding={4} w="100%" bgColor={'#fff'}>
                <HStack space={1} alignItems={'center'} flexWrap={'wrap'}>
                  <WarningOutlineIcon />
                  <Text>Long press on the map to select your destination</Text>
                </HStack>
              </Box>
            </RenderWhen>
          </VStack>
        </RenderWhen>

        <RenderWhen isTrue={ride_req_obj}>
          <VStack
            space={3}
            position={'absolute'}
            w="100%"
            bottom={0}
            padding={8}>
            <Box bgColor={'secondary.50'} borderRadius={'xl'} padding={3}>
              <Center w="100%" my={4}>
                <Icon
                  as={MaterialIcons}
                  name={'av-timer'}
                  size={'2xl'}
                  color={'black'}
                />
                <Heading textAlign={'center'} fontWeight={500}>
                  Your ride is under request
                </Heading>
                <Heading textAlign={'center'} size={'md'}>
                  Finding the nearest driver please wait.
                </Heading>
              </Center>
              <VStack space={2}>
                <Button
                  isLoading={isCancelReqLoading}
                  onPress={cancel_request}
                  colorScheme={'muted'}>
                  Cancel Request
                </Button>
              </VStack>
            </Box>
          </VStack>
        </RenderWhen>

        <RenderWhen isTrue={Boolean(data.dest && data.source) && !ride_req_obj}>
          <VStack
            space={3}
            position={'absolute'}
            w="100%"
            padding={2}
            bottom={0}>
            <Button
              isLoading={isRideReqLoading}
              colorScheme={'secondary'}
              onPress={make_ride_req}>
              Book Ride
            </Button>
            <Button colorScheme={'muted'} onPress={setreset}>
              Cancel
            </Button>
          </VStack>
        </RenderWhen>
      </Container>
    </View>
  );
};

export default Home;

function InputButton({onPress, Icon, value, placeholder}) {
  return (
    <Pressable onPress={onPress}>
      <Box w="100%" bgColor={'primary.50'} padding={3} borderRadius={'md'}>
        <HStack alignItems={'center'} space={2}>
          {Icon}
          <Heading
            size={'sm'}
            fontWeight={500}
            textTransform={'capitalize'}
            color={value ? 'black' : 'muted.400'}>
            {value ? value : placeholder}
          </Heading>
        </HStack>
      </Box>
    </Pressable>
  );
}

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
