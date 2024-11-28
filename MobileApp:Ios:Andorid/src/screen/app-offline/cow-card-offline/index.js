import React from 'react';
import {Platform} from 'react-native';
import Heading from '../../../components/heading';
import {
  NativeBaseProvider,
  View,
  Text,
  Center,
  ScrollView,
  VStack,
  Box,
  Stack,
  HStack,
  Pressable,
  Button,
  Flex,
} from 'native-base';
import {connect} from 'react-redux';
import * as Api from '../../../models/cow-card/api';
import {getCowCardWeighing} from '../../../models/cowCard-weight/api';
import TextField from "../../../components/textField";

const {getCowCard} = Api;

const mstp = state => {
  return {
    cowCard: state.cowCard,
    cowCardWeighing: state.cowCardWeighing,
  };
};

const mdtp = dispatch => {
  return {
    getCowCard: data => dispatch(getCowCard(data)),
    getCowCardWeighing: data => dispatch(getCowCardWeighing(data)),
  };
};

class CowCard extends React.Component {
  state = {
    cowId: '',
    card: true,
    productivity: false,
    headingView: true,
    registryCard: false,
    title: '',
    isTabs: true,
  };

  async componentDidMount() {
    const {getCowCard, route, getCowCardWeighing, registryCard} = this.props;
    const {cowCard} = route.params;
    registryCard && this.setState({registryCard: true});
    this.setState({title: cowCard.EXTERNAL_ID});
  }

  componentWillUnmount() {
    this.setState({registryCard: false});
  }

  onNavigate = navigation => {
    const {} = this.props;

    navigation.goBack();
  };

  onHeader = () => {
    const {title} = this.state;
    const {route} = this.props;
    const {cowCard} = route.params;
    const cowGender = cowCard.PROPS.GENDER.VALUE;
    return `${cowGender} №${title}`;
  };

  onProductivity = () => {
    this.setState({card: false, productivity: true});
  };
  isViewTabs = () => {
    this.setState({isTabs: true, headingView: true});
  };

  isHideTabs = () => {
    this.setState({isTabs: false, headingView: false});
  };

  render() {
    const {route, cowCardWeighing, onBack} = this.props;
    const {cowCard, navigation, scannerScreen = true, dataMark} = route.params;
    const cowGender = cowCard && cowCard.PROPS.GENDER_GROUP.VALUE;
    const {title, isTabs} = this.state;

    return (
      <View flex={1}>
        <Heading
          title={`${cowGender} №${title}`}
          navigation={navigation}
        />
        <View flex={1} borderRadius={20}>
          {cowCard && (
            <ScrollView flex={1} mt={'5%'} ml={'5%'} mr={'5%'}>
              <Box
                pt={2}
                pb={2}
                flexDirection={'row'}
                justifyContent={'space-between'}>
                <TextField w={220} fontSize="md">
                  ID животного:
                </TextField>
                <TextField fontSize="md">{cowCard.EXTERNAL_ID}</TextField>
              </Box>
              <Box
                pt={2}
                pb={2}
                flexDirection={'row'}
                justifyContent={'space-between'}>
                <TextField w={220} fontSize="md">
                  Внутрихозяйственный номер:
                </TextField>
                <TextField fontSize="md">{cowCard.NAME}</TextField>
              </Box>
              <Box
                pt={2}
                pb={2}
                flexDirection={'row'}
                justifyContent={'space-between'}>
                <TextField w={220} fontSize="md">
                  Ферма:
                </TextField>
                <TextField fontSize="md">{cowCard.PROPS.FARM.VALUE}</TextField>
              </Box>
              {/*<Box*/}
              {/*  pt={2}*/}
              {/*  pb={2}*/}
              {/*  flexDirection={'row'}*/}
              {/*  justifyContent={'space-between'}>*/}
              {/*  <TextField w={220} fontSize="md">*/}
              {/*    Пол:*/}
              {/*  </TextField>*/}
              {/*  <TextField fontSize="md">{cowCard.PROPS.GENDER.VALUE}</TextField>*/}
              {/*</Box>*/}
              <Box
                pt={2}
                pb={2}
                flexDirection={'row'}
                justifyContent={'space-between'}>
                <TextField w={220} fontSize="md">
                  Возраст:
                </TextField>
                <TextField fontSize="md">{cowCard.PROPS.AGE.VALUE}</TextField>
              </Box>
              <Box
                pt={2}
                pb={2}
                flexDirection={'row'}
                justifyContent={'space-between'}>
                <TextField w={220} fontSize="md">
                  Половозрастная группа:
                </TextField>
                <TextField fontSize="md">{cowCard.PROPS.GENDER_GROUP.VALUE}</TextField>
              </Box>
              <Box
                pt={2}
                pb={2}
                flexDirection={'row'}
                justifyContent={'space-between'}>
                <TextField w={220} fontSize="md">
                  Порода:
                </TextField>
                <TextField fontSize="md">{cowCard.PROPS.BREED.VALUE}</TextField>
              </Box>
              <Box
                pt={2}
                pb={2}
                flexDirection={'row'}
                justifyContent={'space-between'}>
                <TextField w={220} fontSize="md">
                  Межотельный цикл:
                </TextField>
                <TextField fontSize="md">
                  {cowCard.PROPS.INTER_OCEANIC_CYCLE.VALUE}
                </TextField>
              </Box>
              <Box
                pt={2}
                pb={2}
                flexDirection={'row'}
                justifyContent={'space-between'}>
                <TextField w={220} fontSize="md">
                  Состояние здоровья:
                </TextField>
                <TextField fontSize="md">{cowCard.PROPS.STATE_OF_HEALTH.VALUE}</TextField>
              </Box>
              <Box
                pt={2}
                pb={2}
                flexDirection={'row'}
                justifyContent={'space-between'}>
                <TextField w={220} fontSize="md">
                  Ответственный сотрудник:
                </TextField>
                <TextField fontSize="md">{cowCard.PROPS.RESPONSIBLE.VALUE}</TextField>
              </Box>
              <Box
                pt={2}
                pb={2}
                flexDirection={'row'}
                justifyContent={'space-between'}>
                <TextField w={220} fontSize="md">
                  Скотник:
                </TextField>
                <TextField fontSize="md">{cowCard.PROPS.CATTLEMAN.VALUE}</TextField>
              </Box>
              <Box
                pt={2}
                pb={2}
                flexDirection={'row'}
                justifyContent={'space-between'}>
                <TextField w={220} fontSize="md">
                  Последнее обновление:
                </TextField>
                <TextField fontSize="md">{cowCard.TIMESTAMP_X}</TextField>
              </Box>
            </ScrollView>
          )}
        </View>
      </View>
    );
  }
}

export default connect(mstp, mdtp)(CowCard);
