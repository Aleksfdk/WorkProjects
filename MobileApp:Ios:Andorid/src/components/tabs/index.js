import React from 'react';
import {Box} from 'native-base';
import {View, Dimensions} from 'react-native';
import TextField from '../../components/textField';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

export default class Tabs extends React.Component {
  state = {
    routes: this.props.routes,
    index: 0,
  };

  componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS,
  ) {
    const {tabIndex} = this.props;
    if (tabIndex !== prevProps.tabIndex) {
      this.setState({index: this.props.tabIndex});
    }
  }
  onRenderScene = tabs => SceneMap(tabs);

  onRenderTabBar = (
    props,
    backgroundColor,
    color,
    shadow,
    borderColor,
    ml,
  ) => (
    <TabBar
      {...props}
      onTabPress={tab => {
        const {onTabPress} = this.props;
        onTabPress && onTabPress(tab.route.key);
      }}
      scrollEnabled={true}
      tabStyle={{width: 'auto'}}
      renderLabel={({route, focused}) => (
        <Box ml={ml}>
          {!route.iconCount || route.iconCount <= 0 ? (
            <TextField
              fontSize={18}
              style={{color: !color ? '#5B6477' : color}}>
              {route.title}
            </TextField>
          ) : (
            <Box flexDirection={'row'} alignItems={'center'}>
              <TextField
                fontSize={18}
                style={{color: !color ? '#5B6477' : color}}>
                {route.title}
              </TextField>
              <Box
                left={'5%'}
                flexDirection={'row'}
                justifyContent={'center'}
                alignItems={'center'}
                w={26}
                h={26}
                backgroundColor={'#1CA0D9'}
                borderRadius={22}>
                <TextField color={'#FFFFFF'} fontSize={14}>
                  {route.iconCount}
                </TextField>
              </Box>
            </Box>
          )}
        </Box>
      )}
      indicatorStyle={{
        backgroundColor: borderColor ? borderColor : '#1CA0D9',
      }}
      style={{
        borderBottomColor: backgroundColor && '#DDDDDD',
        borderBottomWidth: backgroundColor && 1,
        borderStyle: backgroundColor && 'solid',
        backgroundColor: backgroundColor ? backgroundColor : '#1CA0D9',
        shadowColor: shadow ? '#000' : 'transparent',
        shadowOffset: {
          width: shadow && 0,
          height: shadow && 2,
        },
        shadowOpacity: shadow && 0.25,
        shadowRadius: shadow && 3.84,

        elevation: 4,
      }}
    />
  );
  render() {
    const {index, routes} = this.state;
    const {
      tabs,
      contentTab = true,
      renderScene,
      backgroundColor,
      color,
      shadow = false,
      borderColor,
      ml,
    } = this.props;
    return (
      <TabView
        renderTabBar={props =>
          this.onRenderTabBar(
            props,
            backgroundColor,
            color,
            shadow,
            borderColor,
            ml,
          )
        }
        navigationState={{index, routes}}
        // renderScene={() => SceneMap(tabs)}
        renderScene={renderScene}
        onIndexChange={value => {
          this.setState({index: value});
        }}
        initialLayout={{width: Dimensions.get('window').width}}
        style={!contentTab && {flex: 0.079}}
      />
    );
  }
}

// export default class Tabs extends React.Component {
//   constructor(props) {
//     super(props);
//     this.scrollView = React.createRef();
//     this.elRef = React.createRef();
//     this.state = {
//       tab: 0,
//       tabOneScroll: 0,
//       tabTwoScroll: 150,
//       tabThreeScroll: 300,
//       tabFourScroll: 400,
//     };
//   }
//
//   componentDidUpdate(
//     prevProps: Readonly<P>,
//     prevState: Readonly<S>,
//     snapshot: SS,
//   ) {
//     const {tabIndex} = prevProps;
//     const {onChangeXScroll} = this.props;
//
//     if (this.props.tabIndex !== tabIndex) {
//       this.onChangeTab(this.props.tabIndex);
//       onChangeXScroll &&
//         onChangeXScroll(this.props.tabIndex, this.scrollView.current);
//     }
//   }
//
//   onChangeTab = value => {
//     this.setState({tab: value});
//   };
//
//   onCheckTab = e => {
//     const {onCheckTab, onChangeXScroll} = this.props;
//     onCheckTab && onCheckTab(e);
//     this.setState({tab: e});
//   };
//
//   onScrollFunc = event => {
//     this.scrollView.current.scrollTo({
//       x: event.nativeEvent.contentOffset.x,
//       y: 0,
//       animated: true,
//     });
//   };
//
//   onTest = e => {
//     console.log('e', e);
//   };
//
//   render() {
//     const {tabs, content = true, widthContainer} = this.props;
//     const {tab} = this.state;
//     let flexView = content ? 1 : 0;
//     return (
//       <View flex={flexView}>
//         {tabs.length > 2 ? (
//           <ScrollView
//             style={
//               content
//                 ? {
//                     flex: 1,
//                     backgroundColor: '#1CA0D9',
//                   }
//                 : {
//                     backgroundColor: '#1CA0D9',
//                   }
//             }
//             // onPress={e => this.onChangeScrollTab(e)}
//             ref={this.scrollView}
//             // mt={4}
//             horizontal={true}
//             showsHorizontalScrollIndicator={false}>
//             <Tab
//               // disableIndicator={true}
//               value={tab}
//               onChange={e => this.onCheckTab(e)}
//               indicatorStyle={{
//                 backgroundColor: 'white',
//                 height: 4,
//               }}
//               variant="default">
//               {tabs.map(item => (
//                 <Tab.Item
//                   // onPress={this.onScrollFunc}
//                   ref={this.elRef}
//                   key={item.key}
//                   // title={item.title}
//                   title={
//                     <TextField fontSize={18} color={'white'}>
//                       {item.title}
//                     </TextField>
//                   }
//                   containerStyle={{
//                     width: widthContainer,
//                     backgroundColor: 'transparent',
//                   }}
//                   titleStyle={{
//                     color: 'white',
//                   }}
//                   buttonStyle={{
//                     // paddingBottom: 14,
//                     backgroundColor: '#1CA0D9',
//                   }}
//                 />
//               ))}
//             </Tab>
//           </ScrollView>
//         ) : (
//           <Tab
//             // disableIndicator={true}
//             value={tab}
//             indicatorStyle={{
//               color: 'white',
//               backgroundColor: 'white',
//               height: 4,
//             }}
//             variant="primary"
//             onChange={e => this.onCheckTab(e)}>
//             {tabs.map(item => (
//               <Tab.Item
//                 key={item.key}
//                 // title={item.icon ? item.title : <Text>Test</Text>}
//                 title={
//                   item.icon ? (
//                     <View flexDirection={'row'} alignItems={'center'}>
//                       <Ionicons name={item.icon} size={24} color={'#ffffff'} />
//                       <TextField color={'white'} fontSize={20} pl={2}>
//                         {item.title}
//                       </TextField>
//                     </View>
//                   ) : (
//                     <TextField fontSize={18} color={'white'}>
//                       {item.title}
//                     </TextField>
//                   )
//                 }
//                 containerStyle={{
//                   backgroundColor: 'transparent',
//                 }}
//                 titleStyle={{
//                   fontSize: 14,
//                   color: 'white',
//                 }}
//                 buttonStyle={{
//                   backgroundColor: '#1CA0D9',
//                 }}
//                 // icon={{name: 'timer', type: 'ionicon', color: 'white'}}
//               />
//             ))}
//           </Tab>
//         )}
//         {content && (
//           <View flex={12}>
//             <TabView
//               value={tab}
//               onChange={this.onCheckTab}
//               animationType="spring">
//               {tabs.map(item => (
//                 <TabView.Item
//                   key={item.key}
//                   style={{width: '100%', backgroundColor: 'white'}}>
//                   {item.element}
//                 </TabView.Item>
//               ))}
//             </TabView>
//           </View>
//         )}
//       </View>
//     );
//   }
// }
