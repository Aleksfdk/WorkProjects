import React, {useState} from 'react';
import {Platform, StatusBar, TouchableOpacity} from 'react-native';
import {
  Box,
  FormControl,
  Input,
  Center,
  View,
  TextArea,
  useDisclose,
  Actionsheet,
  Select,
  ScrollView,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import momentJs from 'moment';
import TextField from '../textField';
import placeholder from "lodash/fp/placeholder";

export default function FormItem(props) {
  const newDate = new Date();
  const {
    name,
    type,
    value,
    onChange,
    isRequired = false,
    isAction,
    pointerEvents,
    isDisabled = false,
    children,
    onChangeText,
    overlayData = [],
    overlayList = '',
    onWatcher,
    label,
    minLength,
    maxLength,
    keyboardType = 'number-pad',
    base,
    placeholder
  } = props;
  const {isOpen, onOpen, onClose} = useDisclose();
  const [isCurrentDate, setIsCurrentDate] = useState(false);
  const [isDate, setIsDate] = useState(value);

  return (
    <Center>
      {type === 'date' && (
        <FormControl
          isRequired={isRequired}
          w={{
            base: base ? base : '90%',
            md: '25%',
          }}
          mb="7">
          <FormControl.Label>{children}</FormControl.Label>
          <TouchableOpacity onPress={() => setIsCurrentDate(true)}>
            <View pointerEvents={'none'}>
              <Input
                name={name}
                pointerEvents="none"
                value={moment(isDate).format('DD.MM.YY')}
                // onChange={() => onChangeText(moment(isDate).format('DD.MM.YY'))}
                style={{height: 40}}
                InputRightElement={
                  // <Box style={{transform: [{rotate: '90deg'}]}}>
                  <Box pr={0.5}>
                    <Ionicons
                      onPress={() => setIsCurrentDate(true)}
                      style={{color: '#A3A3A3'}}
                      name={'chevron-down-outline'}
                      size={19}
                    />
                  </Box>
                }
                placeholder="Введите значение"
              />
            </View>
          </TouchableOpacity>
          <DatePicker
            modal
            mode={'date'}
            locale={'ru'}
            open={isCurrentDate}
            confirmText={'Сохранить'}
            cancelText={'Отмена'}
            onConfirm={date => {
              setIsCurrentDate(false);
              setIsDate(date);
              onChangeText && onChangeText(moment(date).format('DD.MM.YY'));
              // onChange && onChange(momentJs(date).format('DD.MM.YY'));
            }}
            onCancel={() => {
              setIsCurrentDate(false);
            }}
            date={isDate}
          />
        </FormControl>
      )}
      {type === 'action' && (
        <FormControl
          isRequired={isRequired}
          w={{
            base: '90%',
            md: '25%',
          }}
          mb="7">
          <FormControl.Label>{children}</FormControl.Label>
          <>
            <TouchableOpacity key={1} onPress={onOpen}>
              <View pointerEvents={'none'}>
                <Input
                  key={1}
                  pointerEvents="none"
                  value={overlayList[value]}
                  style={{
                    height: 40,
                  }}
                  InputRightElement={
                    <Box pr={0.5}>
                      <Ionicons
                        onPress={() => setIsCurrentDate(true)}
                        style={{color: '#A3A3A3'}}
                        name={'chevron-down-outline'}
                        size={19}
                      />
                    </Box>
                  }
                  placeholder="Выберите из списка"
                />
              </View>
            </TouchableOpacity>
            <Actionsheet isOpen={isOpen} onClose={onClose}>
              <Actionsheet.Content>
                <Box w="100%" h={60} px={4} justifyContent="center">
                  <TextField
                    fontSize="16"
                    color="gray.500"
                    _dark={{
                      color: 'gray.300',
                    }}>
                    {children}
                  </TextField>
                </Box>
                {overlayData?.map((item, index) => (
                  <Actionsheet.Item
                    key={index + 1}
                    onPress={() => {
                      onWatcher && onWatcher(item.value);
                      onChangeText(item.value);
                      onClose();
                    }}>
                    {item.name}
                  </Actionsheet.Item>
                ))}
              </Actionsheet.Content>
            </Actionsheet>
          </>
        </FormControl>
      )}
      {type === 'number' && (
        <FormControl
          pointerEvents={pointerEvents}
          isRequired={isRequired}
          w={{
            base: '90%',
            md: '25%',
          }}
          mb="7">
          <FormControl.Label>{children}</FormControl.Label>
          <Input
            name={name}
            // keyboardType={Device.isAndroid ? 'numeric' : 'number-pad'}
            minLength={minLength}
            maxLength={maxLength}
            pointerEvents={pointerEvents}
            value={value}
            onChange={e => onChange && onChange(e.nativeEvent.text)}
            keyboardType={keyboardType}
            placeholder={placeholder}
            style={{
              height: 40,
              backgroundColor: isDisabled === true && 'rgba(158,158,158,0.5)',
            }}
            // InputRightElement={
            //   <Box pr={2}>
            //     <Ionicons
            //       style={{color: 'grey'}}
            //       name={'chevron-down-outline'}
            //       size={25}
            //     />
            //   </Box>
            // }
          />
        </FormControl>
      )}
      {type === 'list' && (
        <FormControl
          isRequired={isRequired}
          mb="7"
          w={{
            base: '90%',
            md: '25%',
          }}>
          <FormControl.Label>{children}</FormControl.Label>
          <TouchableOpacity onPress={() => isDisabled === false && isAction()}>
            <View
              pointerEvents={'none'}
              style={
                isDisabled === true && {
                  backgroundColor: 'rgba(158,158,158,0.5)',
                }
              }>
              <Input
                name={name}
                value={value}
                onChange={e => onChange && onChange(e.nativeEvent.text)}
                pointerEvents="none"
                style={{height: 40}}
                // InputRightElement={
                //   <Box pr={0.5}>
                //     <Ionicons
                //       onPress={() => setIsCurrentDate(true)}
                //       style={{color: '#A3A3A3'}}
                //       name={'chevron-down-outline'}
                //       size={19}
                //     />
                //   </Box>
                // }
                placeholder="Выберите из списка"
              />
            </View>
          </TouchableOpacity>
        </FormControl>
      )}
      {type === 'textArea' && (
        <FormControl
          isRequired={isRequired}
          mb="7"
          w={{
            base: '90%',
            md: '25%',
          }}>
          <FormControl.Label>{children}</FormControl.Label>
          <TextArea
            value={value}
            onChange={e => onChange(e.nativeEvent.text)}
            h={40}
            placeholder="Введите значение"
            w={{
              base: '100%',
              md: '25%',
            }}
          />
        </FormControl>
      )}
      {type === 'string' && (
        <FormControl
          isRequired={isRequired}
          mb="7"
          w={{
            base: '90%',
            md: '25%',
          }}>
          <FormControl.Label>{children}</FormControl.Label>
          <TouchableOpacity onPress={() => isAction()}>
            <Input
              name={name}
              value={value}
              onChange={e => onChange && onChange(e.nativeEvent.text)}
              style={{height: 40}}
              // InputRightElement={
              //   <Box pr={0.5}>
              //     <Ionicons
              //       onPress={() => setIsCurrentDate(true)}
              //       style={{color: '#A3A3A3'}}
              //       name={'chevron-down-outline'}
              //       size={19}
              //     />
              //   </Box>
              // }
              placeholder="Введите значение"
            />
          </TouchableOpacity>
        </FormControl>
      )}
      {type === 'text' && (
        <FormControl
          pointerEvents={pointerEvents}
          isRequired={isRequired}
          mb="7"
          w={{
            base: '90%',
            md: '25%',
          }}>
          <FormControl.Label>{children}</FormControl.Label>
          <TouchableOpacity onPress={() => isAction && isAction()}>
            <Input
              name={name}
              value={value}
              onChange={e => onChange(e.nativeEvent.text)}
              style={{height: 40}}
              // InputRightElement={
              //   <Box pr={0.5}>
              //     <Ionicons
              //       onPress={() => setIsCurrentDate(true)}
              //       style={{color: '#A3A3A3'}}
              //       name={'chevron-down-outline'}
              //       size={19}
              //     />
              //   </Box>
              // }
              placeholder="Введите значение"
            />
          </TouchableOpacity>
        </FormControl>
      )}
      {type === 'actionDefault' && (
        <FormControl
          isRequired={isRequired}
          w={{
            base: '90%',
            md: '25%',
          }}
          mb="7">
          <FormControl.Label>{children}</FormControl.Label>
          {isAction && isAction()}
        </FormControl>
      )}
      {type === 'listDefault' && (
        <FormControl
          isRequired={isRequired}
          mb="7"
          w={{
            base: '90%',
            md: '25%',
          }}>
          <FormControl.Label>{children}</FormControl.Label>
          <TouchableOpacity onPress={() => isDisabled === false && isAction()}>
            <View
              pointerEvents={'none'}
              style={
                isDisabled === true && {
                  backgroundColor: 'rgba(227,227,227,0.5)',
                }
              }>
              <Input
                value={value}
                pointerEvents="none"
                style={{height: 40}}
                InputRightElement={
                  <Box pr={0.5}>
                    <Ionicons
                      onPress={() => setIsCurrentDate(true)}
                      style={{color: '#A3A3A3'}}
                      name={'chevron-down-outline'}
                      size={19}
                    />
                  </Box>
                }
                placeholder="Выберите из списка"
              />
            </View>
          </TouchableOpacity>
        </FormControl>
      )}
      {type == 'select' && (
        <FormControl
          isRequired={isRequired}
          mb="7"
          w={{
            base: base ? base : '90%',
            md: '25%',
          }}>
          <FormControl.Label>{children}</FormControl.Label>
          <Select
            style={{height: 40}}
            selectedValue={value}
            accessibilityLabel={label}
            placeholder="Выберите из списка"
            onValueChange={value => {
              onChange(value);
              onWatcher && onWatcher(value);
            }}>
            {overlayData.map(item => (
              <Select.Item label={item.name} value={item.value} />
            ))}
          </Select>
        </FormControl>
      )}
    </Center>
  );
}
