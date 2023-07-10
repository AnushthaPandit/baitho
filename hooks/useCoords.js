import {useEffect, useState} from 'react';

import {
  requestLocationPermission,
  getCurrentLocation,
} from '../utils/location.utils';

const default_location = {latitude: 37.78825, longitude: -122.4324};

const useCoords = () => {
  const [curr_coords, setcurr_coords] = useState({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    setInterval(() => {
      getLiveLocation().then(coords => {
        if (coords) {
          setcurr_coords({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
        } else {
          alert(
            "We're having a trouble getting your location please provide location permission!",
          );
        }
      });
    }, 3000);
  }, []);

  return curr_coords;
};

export default useCoords;

const getLiveLocation = async () => {
  const locPermissionDenied = await requestLocationPermission();
  if (locPermissionDenied) {
    const {latitude, longitude, heading, speed} = await getCurrentLocation();

    return {
      latitude,
      longitude,
      heading,
      speed,
    };
  }
};
