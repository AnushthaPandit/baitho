import {
  VStack,
  Divider,
  Button,
  FormControl,
  Input,
  Modal,
  Center,
} from 'native-base';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {
  delete_running_ride,
  add_end_ride_logs,
} from '../../../utils/firestore.utils';
import routeNames from '../../../constants/routeNames';

const EndRide = ({plateNumber}) => {
  const [openForm, setopenForm] = useState(false);

  return (
    <VStack space={3} padding={4}>
      <Divider />
      <Button
        colorScheme={'muted'}
        onPress={() => setopenForm(true)}
        borderRadius={'full'}
        w={'100%'}>
        Cancel Ride
      </Button>
      <EndNoteForm isOpen={openForm} plateNumber={plateNumber} />
    </VStack>
  );
};

export default EndRide;

const EndNoteForm = ({isOpen, plateNumber}) => {
  const [note, setnote] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const bus_plate_number = plateNumber;

  const navigation = useNavigation();

  const end_ride = async () => {
    if (!note.trim()) {
      alert('Please enter your note!');
      return;
    }

    try {
      setisLoading(true);
      await add_end_ride_logs(bus_plate_number, note);
      await delete_running_ride(bus_plate_number);
      setTimeout(() => {
        navigation.navigate(routeNames.INTERNAL.SUB_ROUTES.HOME);
      }, 1000);
      setisLoading(false);
    } catch (error) {
      alert('Something went wrong!');
      setisLoading(false);
    }
  };

  return (
    <Center>
      <Modal isOpen={isOpen}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Cancel Ride</Modal.Header>
          <Modal.Body>
            <FormControl mt="3">
              <FormControl.Label>Please leave a note</FormControl.Label>
              <Input value={note} onChangeText={setnote} multiline />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button isLoading={isLoading} onPress={end_ride}>
              Save
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
};
