import { Platform, StatusBar, Dimensions } from 'react-native';
import { theme } from 'galio-framework';

const { height, width } = Dimensions.get('window');

export const StatusHeight = StatusBar.currentHeight;
export const HeaderHeight = theme.SIZES.BASE * 3.5 + (StatusHeight || 0);
export const iPhoneX = () => Platform.OS === 'ios' && (height >= 812 && width >= 375);
