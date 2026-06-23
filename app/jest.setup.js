// Use the in-memory AsyncStorage mock so config get/set can be tested without
// a native module.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
