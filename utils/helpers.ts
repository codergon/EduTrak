import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAllAsync = async (storage_Keys: string[]) => {
  const qArray = await AsyncStorage.multiGet(storage_Keys);

  const dataObj: { [key: string]: any } = {};
  qArray.map(([key, value]) => {
    if (!!value) dataObj[key] = value;
  });
  return dataObj;
};
