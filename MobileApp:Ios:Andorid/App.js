import React from 'react';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import AuthLayout from './src/screen/auth-layout';

import {NativeBaseProvider} from 'native-base';

import configureStore from './src/store';

const store = configureStore();

class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <NativeBaseProvider>
          <AuthLayout />
        </NativeBaseProvider>
      </Provider>
    );
  }
}

export default App;
