import firestore from '@react-native-firebase/firestore';

import org_members_schema from '../schemas/org_members.schema';
import ride_req_stack_schema from '../schemas/ride_req_stack.schema';
import stop_alerts_schema from '../schemas/stop_alerts.schema';
import running_rides_schema from '../schemas/running_rides.schema';
import ride_logs_schema from '../schemas/ride_logs.schema';

export async function doUserExists(email = '') {
  const docref = await firestore()
    .collection(org_members_schema.name)
    .where(org_members_schema.fields.email, '==', email)
    .get();

  if (docref.empty) {
    return false;
  } else {
    return true;
  }
}

export async function add_request(data = {}, uid = '') {
  const docref = await firestore()
    .collection(ride_req_stack_schema.name)
    .doc(uid)
    .get();

  if (!docref.exists) {
    await firestore().collection(ride_req_stack_schema.name).doc(uid).set(data);
    return true;
  }

  await firestore()
    .collection(ride_req_stack_schema.name)
    .doc(uid)
    .update(data);
  return true;
}

export async function del_request(uid = '') {
  await firestore().collection(ride_req_stack_schema.name).doc(uid).delete();
  return true;
}

export async function add_stop_alert(data = {}) {
  await firestore().collection(stop_alerts_schema.name).add(data);
  return true;
}

export async function delete_running_ride(plate_number) {
  await firestore()
    .collection(running_rides_schema.name)
    .doc(plate_number)
    .delete();
}

export async function add_end_ride_logs(plate_number = '', desc = '') {
  const docRef = await firestore()
    .collection(running_rides_schema.name)
    .doc(plate_number)
    .get();

  await firestore()
    .collection(ride_logs_schema.name)
    .add({
      ...docRef.data(),
      [ride_logs_schema.fields.end_time]:
        firestore.FieldValue.serverTimestamp(),
      [ride_logs_schema.fields.leave_note]: desc,
      [ride_logs_schema.fields.satatus]: 'canceled',
    });
}
