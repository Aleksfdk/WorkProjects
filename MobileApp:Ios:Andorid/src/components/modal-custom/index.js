import React from 'react';
import {View, Box} from 'native-base';
import TextField from '../textField';
import {TouchableOpacity} from 'react-native';

class ModaCustom extends React.Component {
  state = {};

  render() {
    const {visible = false, onClose, onSubmit, title, children} = this.props;
    return (
      <View
        flex={6}
        style={
          !visible
            ? {display: 'none'}
            : {
                zIndex: 999,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                width: '100%',
                height: '100%',
                position: 'absolute',
              }
        }>
        <Box
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            top: '20%',
          }}
          w={300}
          h={200}
          bg={'white'}>
          <TextField
            color={'#5B6477'}
            ml={4}
            mr={4}
            mt={4}
            mb={4}
            fontSize={22}>
            {title}
          </TextField>
          {children}
          <Box
            position={'absolute'}
            bottom={6}
            right={10}
            flexDirection={'row'}
            alignItems={'center'}>
            <TouchableOpacity onPress={() => onClose && onClose()}>
              <TextField color={'#3761F3'} ml={4} mr={6} fontSize={18}>
                ОТМЕНА
              </TextField>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onSubmit && onSubmit();
                onClose && onClose();
              }}>
              <TextField color={'#3761F3'} fontSize={18}>
                OK
              </TextField>
            </TouchableOpacity>
          </Box>
        </Box>
      </View>
    );
  }
}

export default ModaCustom;
