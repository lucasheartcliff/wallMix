const Realm = require('realm');
import { image, settings } from './schema';

const openDatabase = () =>
  Realm.open({
    path: 'wpkconfig.v4',
    schema: [image, settings],
  }).then(realm => realm);

const insertOnDatabase = async (branchName, dataObject) => {
  const realm = await openDatabase();
  return await realm.write(() => {
    realm.create(branchName, dataObject);
  });
};

const updateOnDatabase = async (branchName, node, newValue) => {
  const realm = await openDatabase();
  return await realm.write(() => {
    realm.create(branchName, { node: { ...newValue } }, 'modified');
    let data = realm.objects(branchName);
    console.log('On Update',data);
  });
};

const deleteOnDatabase = async (branchName, dataObject) => {
  const realm = await openDatabase();
  return await realm.write(() => {
    const data = realm.create(branchName, dataObject);
    realm.delete(data);
  });
};

const deleteAllOnDatabase = async branchName => {
  const realm = await openDatabase();
  return await realm.write(() => {
    const data = realm.objects(branchName);
    realm.delete(data);
  });
};

const fetchOnDatabase = async branchName => {
  const realm = await openDatabase();
  return await realm.objects(branchName);
};

export {
  insertOnDatabase,
  updateOnDatabase,
  fetchOnDatabase,
  deleteOnDatabase,
  deleteAllOnDatabase,
};
