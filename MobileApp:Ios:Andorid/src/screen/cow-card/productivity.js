import React from 'react';
import {Dimensions} from 'react-native';
const {height} = Dimensions.get('window');
import {Button, Center, ScrollView, Text, View, VStack, Box} from 'native-base';
import Weighing from '../weighing';
import TextField from "../../components/textField";

export default class Productivity extends React.Component {
  state = {
    weighing: false,
  };

  componentDidMount() {
    const {onProductivity, isViewTabs} = this.props;
    isViewTabs && isViewTabs();
    onProductivity && onProductivity();
  }

  onUpdateWeight = () => {
    const {onUpdateWeight} = this.props;

    onUpdateWeight && onUpdateWeight();
  };

  onShowWeighing = () => {
    const {navigation, cowCard} = this.props;
    navigation.navigate('Взвешивание', {
      onUpdate: this.onUpdateWeight,
      navigation: navigation,
      tagId: cowCard.data && cowCard.data[0].EXTERNAL_ID,
    });
  };
  render() {
    const {cowCard, navigation, cowCardWeighing, isViewTabs, isHideTabs, isRetirement} =
      this.props;
    return (
      <View flex={1}>
        <ScrollView backgroundColor={'rgb(227,227,227)'}>
          {cowCardWeighing.data &&
            cowCardWeighing.data.map((item, index) => (
              <View
                key={item.ID}
                style={{
                  backgroundColor: 'white',
                }}
                mb={2}
                p={4}>
                <VStack key={item.ID} space={2}>
                  <TextField fontSize="md">Порядковый номер: {index + 1}</TextField>
                  <TextField fontSize={18}>
                    Дата взвешивания: {item.ACTIVE_FROM}
                  </TextField>
                  <TextField fontSize={18}>
                    Живой вес: {item.PROPS.WEIGHT && item.PROPS.WEIGHT.VALUE}
                  </TextField>
                  <TextField fontSize={18}>
                    Животное: {item.PROPS.KRS && item.PROPS.KRS.VALUE}
                  </TextField>
                </VStack>
              </View>
            ))}
        </ScrollView>
        <Center>
          <Button
            disabled={isRetirement}
            mb={4}
            w={{base: '90%'}}
            backgroundColor={'#1CA0D9'}
            p={3}
            borderRadius={7}
            onPress={() => this.onShowWeighing()}>
            Внести информацию
          </Button>
        </Center>
      </View>
    );
  }
}
