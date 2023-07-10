const ride_logs = {
  name: 'ride_logs',
  fields: {
    start_point_loc: {
      name: 'start_point_loc',
      latitude: 'latitude',
      longitude: 'longitude',
    },
    pick_up_loc: {
      name: 'pick_up_loc',
      latitude: 'latitude',
      longitude: 'longitude',
    },
    drop_off_loc: {
      name: 'drop_off_loc',
      latitude: 'latitude',
      longitude: 'longitude',
    },
    start_time: 'start_time',
    end_time: 'end_time',
    distance_covered: 'distance_covered',
    leave_note: 'leave_note',
    uid: 'uid',
    bus_plate_number: 'bus_plate_number',
    satatus: 'satatus',
  },
};

export default ride_logs;
