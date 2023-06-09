import {
  FlatList,
  Input,
  Box,
  Icon,
  HStack,
  Text,
  Divider,
  Pressable,
  Spinner,
  Center,
} from 'native-base';
import React, {useState, useEffect} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import useSearchData from '../hooks/useSearchData';
import useOnlyStops from '../hooks/useOnlyStops';

import Container from '../components/Container';

const StationSearch = ({route, navigation}) => {
  const type = route.params?.type;

  const {setDest, setSource} = useSearchData();
  const {isLoading, stops} = useOnlyStops();

  const [stText, setstText] = useState('');
  const [result, setresult] = useState([]);

  const handlePress = title => {
    if (type === 'source') {
      setSource(title);
    } else {
      setDest(title);
    }

    navigation.goBack();
  };

  useEffect(() => {
    setresult(
      stops.filter(obj =>
        obj.title.toLowerCase().includes(stText.toLowerCase()),
      ),
    );
  }, [stText]);

  return (
    <Container>
      {isLoading ? (
        <Center w="100%">
          <Spinner />
        </Center>
      ) : null}
      <Box mb={4}>
        <Input
          size={'lg'}
          w="100%"
          placeholder="Bus Number"
          value={stText}
          onChangeText={v => setstText(v)}
          autoFocus
        />
      </Box>
      <FlatList
        data={result}
        renderItem={({item}) => (
          <Pressable onPress={handlePress.bind(this, item.title)}>
            <HStack padding={1} space={5} my={2} alignItems={'center'}>
              <Icon size={'lg'} as={MaterialCommunityIcons} name={'bus-stop'} />

              <Text textTransform={'capitalize'} flex={1}>
                {item.title}
              </Text>
            </HStack>
            <Divider />
          </Pressable>
        )}
        keyExtractor={(it, i) => i}
      />
    </Container>
  );
};

export default StationSearch;

const bus_data = [
  {title: 'Bokaro Steel City'},
  {title: 'Ranchi'},
  {title: 'Dhanbaad'},
  {title: 'Darbhanga'},
  {title: 'Green City'},
  {title: 'Yellow City'},
  {title: 'Pink City'},
  {title: 'Blue City'},
  {title: 'Red City'},
];
