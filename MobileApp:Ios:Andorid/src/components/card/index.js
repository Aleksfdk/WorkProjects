import React from 'react';
import {Box, Text, View} from 'native-base';
import TextField from '../textField';

export class CardItem extends React.Component {
  state = {};
  render() {
    const {title, value, type = 'string', subValue} = this.props;
    return (
      <Box pt={2} pb={2} flexDirection={'row'} justifyContent={'space-between'}>
        <TextField
          w={190}
          wordBreak="break-all"
          color={'#5B6477'}
          fontSize="md">
          {title}
        </TextField>
        <View>
          <TextField wordBreak="break-all" fontSize="md" textAlign={'right'}>
            {value}
          </TextField>
          {subValue && (
            <TextField fontSize={14} color={'#5B6477'}>
              {subValue}
            </TextField>
          )}
        </View>
      </Box>
    );
  }
}

export class CardComment extends React.Component {
  state = {};
  render() {
    const {title, value} = this.props;
    return (
      <Box
        style={{
          borderStyle: 'solid',
          borderTopWidth: 1,
          borderTopColor: '#DDDDDD',
        }}
        mt={6}
        pt={2}
        pb={2}>
        <TextField color={'#5B6477'} w={200} fontSize="md">
          {title}
        </TextField>
        <View>
          <TextField fontSize="md">{value}</TextField>
        </View>
      </Box>
    );
  }
}
