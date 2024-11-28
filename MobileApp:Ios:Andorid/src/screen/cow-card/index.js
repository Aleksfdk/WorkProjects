import React from 'react';
import {Dimensions, Platform} from 'react-native';
import Heading from '../../components/heading';
import {SceneMap, TabView} from 'react-native-tab-view';
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
import * as Api from '../../models/cow-card/api';
import Origin from './origin';
import {getCowCardWeighing} from '../../models/cowCard-weight/api';
import Tabs from '../../components/tabs';
import CowInfo from './cowInfo';
import Productivity from './productivity';
import ReproductionMenu from './reproduction-menu';
import Loading from '../../components/loading';
import TextField from '../../components/textField';
import Breed from './breed';
import Role from './role';
import ImprovementBreeds from './improvement-breeds';

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
    isCard: false,
    cowId: '',
    card: true,
    productivity: false,
    headingView: true,
    registryCard: false,
    title: '',
    isTabs: true,
    routes: [
      {key: 'main', title: 'О животном'},
      {key: 'origin', title: 'Происхождение'},
      {key: 'breed', title: 'Породность'},
      {key: 'role', title: 'Назначение'},
      {key: 'improvementBreeds', title: 'Улучшающие породы'},
      // {key: 'productivity', title: 'Продуктивность'},
      // {key: 'reproduction', title: 'Воспроизовдство'},
    ],
    index: 0,
  };


  async componentDidMount() {
    // Доабвить очистку cowcCard
    const {getCowCard, route, registryCard} = this.props;
    const {cowCardDetailed} = route.params;
    this.setState({
      title: cowCardDetailed.data.main.tag_id,
      cowGender: cowCardDetailed.data.main.gender_group.value,
      isRetirement: cowCardDetailed.data.main.active,
    });
    // });
  }

  componentWillUnmount() {
    this.setState({registryCard: false});
  }

  isViewTabs = () => {
    this.setState({isTabs: true, headingView: true});
  };

  isHideTabs = () => {
    this.setState({isTabs: false, headingView: false});
  };

  onTabPress = key => {
    console.log('key', key);
  };

  renderScene = routeTab => {
    const {route, cowCardWeighing} = this.props;
    const {
      cowCardDetailed,
      navigation,
      dataMark,
      scannerScreen = true,
    } = route.params;
    const {cowGender, isRetirement} = this.state;
    switch (routeTab.route.key) {
      case 'main':
        return (
          <CowInfo
            dataMark={dataMark}
            cowGender={cowGender}
            onUpdateWeight={this.onUpdateWeight}
            isViewTabs={this.isViewTabs}
            isHideTabs={this.isHideTabs}
            navigation={navigation}
            cowCardDetailed={cowCardDetailed}
            isRetirement={isRetirement}
            cowCardWeighing={cowCardWeighing}
          />
        );
      case 'origin':
        return (
          <Origin
            cowCardDetailed={cowCardDetailed}
            isRetirement={isRetirement}
            tagId={dataMark}
          />
        );
      case 'breed':
        return <Breed cowCardDetailed={cowCardDetailed} />;
      case 'role':
        return <Role />;
      case 'improvementBreeds':
        return <ImprovementBreeds cowCardDetailed={cowCardDetailed} />;
      default:
        return null;
    }
  };

  render() {
    const {route} = this.props;

    const {navigation, cowCardDetailed, dataMark} = route.params;
    const {cowGender, isRetirement, title, index, routes} = this.state;

    return (
      <View flex={1}>
        <Heading title={`${cowGender} №${dataMark}`} navigation={navigation} />
        <Tabs
          ml={'3%'}
          borderColor={'#FFFFFF'}
          shadow={true}
          color={'#FFFFFF'}
          routes={routes}
          onTabPress={this.onTabPress}
          renderScene={props => this.renderScene(props)}
        />
      </View>
    );
  }
}

export default connect(mstp, mdtp)(CowCard);
