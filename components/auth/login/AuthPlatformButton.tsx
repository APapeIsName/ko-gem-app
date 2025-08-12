import { Pressable, StyleSheet } from 'react-native';

/**
 * OAuth 플랫폼 버튼 컴포넌트
 * @param children - 버튼 내부에 표시할 컴포넌트
 * @param onPress - 버튼 클릭 시 호출될 함수
 * @returns 
 */
export default function AuthPlatformButton({
    children,
    onPress,
}: {
    children: React.ReactNode;
    onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});