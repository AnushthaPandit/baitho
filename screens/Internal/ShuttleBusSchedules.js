import {Button, HStack, Icon} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Modal} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Ionicons from 'react-native-vector-icons/Ionicons';

import routeNames from '../../constants/routeNames';

const images = [
  {
    url: '',
    props: {
      source: require('../../assets/images/shuttle_tt.jpeg'),
    },
  },
];

const ShuttleBusSchedules = () => {
  const navigation = useNavigation();
  const goBack = () => navigation.navigate(routeNames.INTERNAL.SUB_ROUTES.HOME);

  return (
    <Modal visible={true} transparent={true}>
      <ImageViewer
        imageUrls={images}
        saveToLocalByLongPress={false}
        renderHeader={() => (
          <HStack w="100%" bgColor={'primary.500'}>
            <Button
              variant={'unstyled'}
              _icon={{color: 'white'}}
              _text={{color: 'white'}}
              onPress={goBack}
              startIcon={<Icon as={Ionicons} name="arrow-back" />}>
              Go Back
            </Button>
          </HStack>
        )}
      />
    </Modal>
  );
};

export default ShuttleBusSchedules;
