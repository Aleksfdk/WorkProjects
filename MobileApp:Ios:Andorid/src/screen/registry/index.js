import React from 'react';
import {
  Box,
  View,
  ScrollView,
  Image,
} from 'native-base';
import {Keyboard, Platform, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import * as Api from '../../models/cow-card/api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Notebook from './notebook';

const {
  getCowCard,
  getDetailedCowCard,
  getCowCardFarm,
  getCowCardYard,
  getCowCardListFilter,
} = Api;
import _ from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TextField from '../../components/textField';
import HeadingField from '../../components/headingField';
import {normalize} from 'react-native-elements';
import RegistryHeader from './registryHeader';
import {setNotification} from '../../models/notification/action';
import {getCowCardWeighing} from '../../models/cowCard-weight/api';
import {
  setCowCardListFilter,
  resetCowCardRegistry,
} from '../../models/cow-card/action';
import FilterRegistry from '../filter-registry';

const iconGender = {
  chick: require('../../../public/image/telka.png'),
  cow: require('../../../public/image/korova.png'),
  bull: require('../../../public/image/bik.png'),
  bychok: require('../../../public/image/bichok.png'),
  calf: require('../../../public/image/telka.png'),
  bull_calf: require('../../../public/image/kastrat.png'),
  heifer: require('../../../public/image/netel.png'),
  virgin: require('../../../public/image/pervotelka.png'),
};

const LIST_GENDER_COW = [
  {
    key: 1,
    name: 'Телка',
  },
  {
    key: 2,
    name: 'Нетель',
  },
  {
    key: 3,
    name: 'Первотёлка',
  },
  {
    key: 4,
    name: 'Первотелка',
  },
  {
    key: 5,
    name: 'Корова',
  },
  {
    key: 6,
    name: 'Тёлка',
  },
];

const mstp = state => {
  return {
    cowCard: state.cowCard,
    cowCardDetailed: state.cowCardDetailed,
    farmList: state.farmList,
    yardList: state.yardList,
    filtersList: state.filters,
    cowCardFilter: state.cowCardFilter,
    cowCardCountFilter: state.cowCardCountFilter,
    profile: state.profile,
  };
};

const mdtp = dispatch => {
  return {
    getCowCard: data => dispatch(getCowCard(data)),
    getDetailedCowCard: data => dispatch(getDetailedCowCard(data)),
    getCowCardWeighing: data => dispatch(getCowCardWeighing(data)),
    getCowCardFarm: data => dispatch(getCowCardFarm(data)),
    getCowCardYard: data => dispatch(getCowCardYard(data)),
    getCowCardListFilter: data => dispatch(getCowCardListFilter(data)),
    setCowCardListFilter: data => dispatch(setCowCardListFilter(data)),
    resetCowCardRegistry: () => dispatch(resetCowCardRegistry()),
  };
};

class Registry extends React.Component {
  state = {
    data: [],
    dataOffline: [],
    dataMark: '',
    card: false,
    sortValue: '1',
    menuGender: false,
  };


  onCheckTagId = element => {
    const {data} = this.state;
    const isAlert = {isAlert: true};
    this.setState({
      data: data.map(item => {
        if (item.PROPS.RFID.VALUE == element.tag_id) {
          return {
            ...item,
            dataAlert: [...item.dataAlert, ...[element]],
            ...isAlert,
          };
        }
        return item;
      }),
    });
  };

  componentDidMount() {
    const {navigation} = this.props;
    this.getList().then(async () => {
      await this.onGetData().then(response => {
        this.setState({dataOffline: response});
        response.map(item => this.onCheckTagId(item));
      });
    });
  }

  getList = async () => {
    const {getCowCard, setCowCardListFilter} = this.props;
    setCowCardListFilter({});
    await getCowCard()
      //     {
      //   code: 'krs',
      //   type: 'farm',
      // })
      .then(() => {
        const {cowCard} = this.props;
        this.setState({
          data: cowCard.data,
          amountCow: cowCard.data.data.length,
        });
      })
      .then(() => {
        const {data} = this.state;
        const isAlert = {isAlert: false, dataAlert: [], isSearch: false};
        this.setState({
          data: data.map(item => {
            return {...item, ...isAlert};
          }),
        });
      })
      .then(() => {
        this.onGetListFilters();
      });
  };

  onCowCardFilter = async () => {
    const {getCowCard, cowCardFilter, resetCowCard} = this.props;
    // await resetCowCard();
    getCowCard({
      code: 'krs',
      type: 'farm',
      filter: cowCardFilter,
    })
      .then(() => {
        const {cowCard} = this.props;
        this.setState({data: cowCard.data, amountCow: cowCard.data.length});
      })
      .then(() => {
        const {data} = this.state;
        const isAlert = {isAlert: false, dataAlert: [], isSearch: false};
        this.setState({
          data: data.data.map(item => {
            return {...item, ...isAlert};
          }),
        });
      });
  };

  onRegistrySort = sort => {
    const {getCowCard, navigation} = this.props;
    navigation.goBack();
    getCowCard({
      code: 'krs',
      type: 'farm',
      order: sort,
    })
      .then(() => {
        const {cowCard} = this.props;
        this.setState({
          data: cowCard.data,
          amountCow: cowCard.data.length,
        });
      })
      .then(() => {
        const {data} = this.state;
        const isAlert = {isAlert: false, dataAlert: [], isSearch: false};
        this.setState({
          data: data.map(item => {
            return {...item, ...isAlert};
          }),
        });
      });
  };

  onMenuGender = cowGender => {
    let gender = false;
    LIST_GENDER_COW.map(item => {
      if (item.name == cowGender) {
        gender = true;
      }
    });
    return gender;
  };

  onGetDetailedCard = async (item, navigation) => {
    const {getDetailedCowCard} = this.props;
    // this.setState({dataMark: item.EXTERNAL_ID, card: true});
    this.setState({currentScreen: item?.PROPS?.RFID.VALUE});
    await getDetailedCowCard({id: Number(item.id)}).then(() => {
      const {cowCardDetailed, cowCardWeighing} = this.props;
      navigation.navigate('RegistryDetailed', {
        cowCardDetailed: cowCardDetailed.data,
        // cowCardWeighing: cowCardWeighing,
        dataAlert: item.dataAlert,
        isRegistry: true,
        dataMark: item.tag_id,
        navigation: navigation,
        scannerScreen: false,
        cowGender: item.gender_group.value,
        title: item.tag_id,
        isRetirement: item.active,
        onSaveOfflineData: this.onSaveOfflineData,
        genderCow: this.onMenuGender(item.gender_group.value),
      });
    });
  };

  onSearchMark = async mark => {
    const markTrim = mark.toLowerCase().trim();
    const {data} = this.state;
    const {cowCard} = this.props;
    const currentData = [...data];

    if (markTrim !== '') {
      let sortData = currentData.map(item => {
        if (item.EXTERNAL_ID.toLowerCase().search(markTrim) == -1) {
          item.isSearch = true;
          return item;
        } else {
          item.isSearch = false;
          return item;
        }
      });
      this.setState({data: sortData});
    } else {
      Keyboard.dismiss();
      const {data} = this.state;
      const isAlert = {isAlert: false, dataAlert: [], isSearch: false};
      this.setState({
        data: data.map(item => {
          return {...item, ...isAlert};
        }),
      });
      await this.onGetData().then(response => {
        this.setState({dataOffline: response});
        response.map(item => {
          return this.onCheckTagId(item);
        });
      });
    }

  };

  onGetListFilters = () => {
    const {getCowCardListFilter, getCowCardFarm, getCowCardYard} = this.props;
    getCowCardListFilter({
      code: 'rfid',
      type: 'farm',
      filter: {
        ACTIVE: 'Y',
      },
    });
  };

  onSetFilters = val => {
    const {setCowCardListFilter} = this.props;
    setCowCardListFilter(val);
  };

  onSetSortValue = sortValue => {
    this.setState({sortValue: sortValue});
  };

  render() {
    const {
      navigation,
      farmList,
      yardList,
      filtersList,
      cowCardCountFilter,
      resetCowCardRegistry,
      cowCard,
      profile,
    } = this.props;
    const {data, amountCow, isFilter, filters, sortValue, dataOffline} =
      this.state;
    return (
      <View flex={1}>
        {profile.version === 0 ? (
          <Box>
            <RegistryHeader
              onSearchMark={this.onSearchMark}
              amountCow={amountCow}
              navigation={navigation}
              onCowCardFilter={this.onCowCardFilter}
              onRegistrySort={this.onRegistrySort}
              getList={this.getList}
              filtersList={filtersList}
              setFilters={this.onSetFilters}
              cowCardCountFilter={cowCardCountFilter}
              sortValue={sortValue}
              onSetSortValue={this.onSetSortValue}
            />
            <ScrollView>
              {data?.data?.map(item => (
                <TouchableOpacity
                  style={item.isSearch && {display: 'none'}}
                  key={item.id}
                  onPress={() =>
                    // this.setState({dataMark: item.EXTERNAL_ID, card: true})
                    this.onGetDetailedCard(item, navigation)
                  }>
                  <Box
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    key={item.id}
                    style={{
                      backgroundColor: item.active
                        ? 'white'
                        : 'rgba(251,251,251,0.73)',
                    }}
                    p={4}
                    mb={2}>
                    <Box flexDirection={'row'} alignItems={'center'}>
                      <Image
                        // source={require('../../../public/image/telka.png')}
                        source={iconGender[item.gender_group.key]}
                        alt={item.gender_group.value}
                      />
                      <Box ml={'7%'}>
                        <TextField
                          fontSize={16}
                          fontFamily={'NunitoSans-Bold'}
                          fontWeight={600}>
                          {item.nickname ? item.nickname : 'Нет данных'}
                        </TextField>
                        <TextField fontSize={13} color={'#95A6BC'}>
                          {item.gender_group.value}
                        </TextField>
                      </Box>
                    </Box>
                    <Box width={'33%'} flexDirection={'row'} alignItems={'center'}>
                      <Box>
                        <TextField
                          fontSize={16}
                          fontFamily={'NunitoSans-Bold'}
                          fontWeight={600}>
                          {item.tag_id}
                        </TextField>
                        <TextField fontSize={13} color={'#95A6BC'}>
                          {item.age}
                        </TextField>
                      </Box>
                      {!item.active && (
                        <Box position={'absolute'} right={-40}>
                          <Box pr={1}>
                            <Ionicons
                              style={{color: '#D32F2F'}}
                              name={'archive-outline'}
                              size={18}
                            />
                          </Box>
                          {/*<TextField fontSize="sm" color={'red.700'}>*/}
                          {/*  Архив*/}
                          {/*</TextField>*/}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Box>
        ) : (
          <View flex={1}>
            <Notebook navigation={navigation} />
          </View>
        )}
      </View>
    );
  }
}

export default connect(mstp, mdtp)(Registry);
