import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial
} from '@expo/vector-icons';
import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

// 사용 가능한 아이콘 세트들
export type IconSet = 
  | 'MaterialIcons'
  | 'Ionicons'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'Feather'
  | 'AntDesign'
  | 'Entypo'
  | 'EvilIcons'
  | 'Fontisto'
  | 'Foundation'
  | 'MaterialCommunityIcons'
  | 'Octicons'
  | 'SimpleLineIcons'
  | 'Zocial';

// 아이콘 이름 타입 (MaterialIcons 기준)
export type IconName = keyof typeof MaterialIcons.glyphMap;

// IconSymbol props 타입
export interface IconSymbolProps {
  /** 아이콘 세트 (기본값: MaterialIcons) */
  iconSet?: IconSet;
  /** 아이콘 이름 */
  name: IconName | string;
  /** 아이콘 크기 */
  size?: number;
  /** 아이콘 색상 */
  color: string;
  /** 스타일 */
  style?: StyleProp<TextStyle>;
}

/**
 * 모든 플랫폼에서 사용할 수 있는 아이콘 컴포넌트
 * 다양한 아이콘 세트를 지원합니다.
 */
export function IconSymbol({ 
  iconSet = 'MaterialIcons',
  name, 
  size = 24, 
  color, 
  style 
}: IconSymbolProps) {
  // 아이콘 세트별로 렌더링
  switch (iconSet) {
    case 'Ionicons':
      return <Ionicons name={name as any} size={size} color={color} style={style} />;
    case 'FontAwesome':
      return <FontAwesome name={name as any} size={size} color={color} style={style} />;
    case 'FontAwesome5':
      return <FontAwesome5 name={name as any} size={size} color={color} style={style} />;
    case 'Feather':
      return <Feather name={name as any} size={size} color={color} style={style} />;
    case 'AntDesign':
      return <AntDesign name={name as any} size={size} color={color} style={style} />;
    case 'Entypo':
      return <Entypo name={name as any} size={size} color={color} style={style} />;
    case 'EvilIcons':
      return <EvilIcons name={name as any} size={size} color={color} style={style} />;
    case 'Fontisto':
      return <Fontisto name={name as any} size={size} color={color} style={style} />;
    case 'Foundation':
      return <Foundation name={name as any} size={size} color={color} style={style} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={name as any} size={size} color={color} style={style} />;
    case 'Octicons':
      return <Octicons name={name as any} size={size} color={color} style={style} />;
    case 'SimpleLineIcons':
      return <SimpleLineIcons name={name as any} size={size} color={color} style={style} />;
    case 'Zocial':
      return <Zocial name={name as any} size={size} color={color} style={style} />;
    default:
      return <MaterialIcons name={name as any} size={size} color={color} style={style} />;
  }
}
