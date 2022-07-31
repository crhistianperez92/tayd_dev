// import React from 'react';
// import { DrawerNavigatorItems } from 'react-navigation-drawer';
// import { ScrollView, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
// import { Block, Text, theme } from 'galio-framework';
// import Images from '../constants/Images';
// import { DrawerItem } from '../components/index';
// import Actions from '../lib/actions';

// import nowTheme from '../constants/Theme';

// export default class DrawerTayder extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             userData: null,
//         }
//     }

//     async componentDidMount() {
//         await Actions.extractUserData().then((result) => {
//             if(result != null) {
//               this.setState({userData: result.user})
//             }
//         });
//     }

//     _logout(props) {
//         Actions.removeUserData().then((response) => {
//           if(response) {
//             setTimeout(() => {
//               props.navigation.navigate('Onboarding')
//             }, 500);
//           }
//         });
//       }

//     render() {
//         let {userData} = this.state;

//         return (
//             <Block style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
//                 <Block row style={styles.header}>
//                     <Image source={Images.ProfilePicture} style={{ borderRadius: 50, height: 60, width: 60, marginRight: 25 }} />
//                     <Block flex>
//                     <Text style={styles.nameTitle}>{userData != null && userData.info ? userData.info.name : ''}</Text>
//                     <Text style={{fontFamily: 'trueno', fontSize: 14, lineHeight: 15}}>{userData != null ? userData.email : ''}</Text>
//                     </Block>
//                 </Block>
            
//                 <Block flex>
//                     <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
//                     <Text style={styles.sectionTitle}>Cuenta</Text>
            
//                     <DrawerNavigatorItems {...this.props} />
            
//                     <Text style={styles.sectionTitle}>Extra</Text>

//                     <TouchableOpacity onPress={() => this._logout(this.props)} style={{ fontFamily: 'trueno', fontSize: 18, }}>
//                         <DrawerItem {...this.props} title="Cerrar sesión" />
//                     </TouchableOpacity>
//                     </ScrollView>
//                 </Block>
            
//                 <Block style={{justifyContent: 'center', alignSelf: 'center', paddingBottom: 30}}>
//                     <Image source={Images.TaydLogoGris} style={{height: 30, width: 140, marginTop: 20}} />
//                 </Block>
//             </Block>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//       flex: 1
//     },
//     header: {
//       paddingHorizontal: 28,
//       paddingTop: theme.SIZES.BASE,
//       justifyContent: 'center'
//     },
//     sectionTitle: {
//       fontFamily: 'trueno-extrabold',
//       fontSize: 32,
//       color: nowTheme.COLORS.SECONDARY,
//       paddingLeft: 20,
//     },
//     nameTitle: {
//       fontFamily: 'trueno-extrabold',
//       fontSize: 24,
//       color: nowTheme.COLORS.SECONDARY,
//       lineHeight: 29,
//     },
//     headerIcon: {
//       marginTop: -20
//     },
//     logo: {
//       height: 40,
//       width: 37
//     }
//   });