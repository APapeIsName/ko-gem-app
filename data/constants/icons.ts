// 위치 권한 관련 아이콘
export const LOCATION_ICONS = {
  LOCATION: 'my-location',
  LOCATION_ON: 'location-on',
  LOCATION_OFF: 'location-off',
  LOCATION_SEARCHING: 'location-searching',
  PLACE: 'place',
  GPS_FIXED: 'gps-fixed',
  GPS_NOT_FIXED: 'gps-not-fixed',
  GPS_OFF: 'gps-off',
  NAVIGATION: 'navigation',
  COMPASS_CALIBRATION: 'compass-calibration'
} as const;

// 네비게이션 관련 아이콘
export const NAVIGATION_ICONS = {
  HOME: 'home',
  SEARCH: 'search',
  SETTINGS: 'settings',
  LIST: 'list',
  SEND: 'send',
  ARROW_BACK: 'arrow-back',
  ARROW_FORWARD: 'arrow-forward',
  CHEVRON_RIGHT: 'chevron-right',
  KEYBOARD_ARROW_DOWN: 'keyboard-arrow-down',
  CLOSE: 'close',
  CHECK: 'check',
  EVENT: 'event',
  MAP: 'map',
  MAP_OUTLINE: 'map-outline',
  MAP_SHARP: 'map-sharp',
} as const;

// 일반적인 UI 아이콘들
export const UI_ICONS = {
  // 액션
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete',
  SHARE: 'share',
  FAVORITE: 'favorite',
  FAVORITE_BORDER: 'favorite-border',
  BOOKMARK: 'bookmark',
  BOOKMARK_BORDER: 'bookmark-border',
  
  // 상태
  STAR: 'star',
  STAR_BORDER: 'star-border',
  THUMB_UP: 'thumb-up',
  THUMB_DOWN: 'thumb-down',
  LIKE: 'favorite',
  DISLIKE: 'thumb-down',
  
  // 통신
  EMAIL: 'email',
  PHONE: 'phone',
  MESSAGE: 'message',
  NOTIFICATIONS: 'notifications',
  NOTIFICATIONS_OFF: 'notifications-off',
  
  // 미디어
  CAMERA: 'camera-alt',
  PHOTO: 'photo',
  VIDEO: 'videocam',
  MUSIC: 'music-note',
  PLAY: 'play-arrow',
  PAUSE: 'pause',
  STOP: 'stop',
  
  // 시간
  CALENDAR: 'calendar-today',
  CLOCK: 'access-time',
  SCHEDULE: 'schedule',
  
  // 교통
  CAR: 'directions-car',
  BUS: 'directions-bus',
  TRAIN: 'train',
  AIRPLANE: 'flight',
  BICYCLE: 'directions-bike',
  WALK: 'directions-walk',
  
  // 기타
  MAP: 'map',
  WIFI: 'wifi',
  BATTERY: 'battery-full',
  DARK_MODE: 'dark-mode',
  LIGHT_MODE: 'light-mode',
  PERSON: 'person',
  GROUP: 'group',
  SHOPPING_CART: 'shopping-cart'
} as const;

// 모든 아이콘을 하나의 객체로 통합
export const ICONS = {
  ...LOCATION_ICONS,
  ...NAVIGATION_ICONS,
  ...UI_ICONS
} as const;

export type IconName = keyof typeof ICONS;
