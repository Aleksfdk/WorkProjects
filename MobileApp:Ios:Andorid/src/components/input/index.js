import React from 'react';
import {
  FormControl,
  Input,
  Stack,
  WarningOutlineIcon,
  Box,
  Center,
  NativeBaseProvider,
} from 'native-base';

export const InputControl = ({value, onChange, title, errMessage}) => {
  return (
    <FormControl
      onChange={onChange}
      mb="7"
      w={{
        base: '75%',
        md: '25%',
      }}>
      <FormControl.Label>{title}</FormControl.Label>
      <Input
        value={value}
        style={{height: 40}}
        placeholder="Введите значение"
      />
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {errMessage}
      </FormControl.ErrorMessage>
    </FormControl>
    // <Box
    //   w={{
    //     base: '90%',
    //     md: '25%',
    //   }}>
    //   <FormControl isRequired>
    //     <Stack mx="4">
    //       <FormControl.Label>Password</FormControl.Label>
    //       <Input type="password" defaultValue="12345" placeholder="password" />
    //       <FormControl.HelperText>
    //         Must be atleast 6 characters.
    //       </FormControl.HelperText>
    //       <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
    //         Atleast 6 characters are required.
    //       </FormControl.ErrorMessage>
    //     </Stack>
    //   </FormControl>
    // </Box>
  );
};

export default ({value, onChange, title, errMessage}) => {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <InputControl
          title={title}
          value={value}
          onChange={onChange}
          errMessage={errMessage}
        />
      </Center>
    </NativeBaseProvider>
  );
};
