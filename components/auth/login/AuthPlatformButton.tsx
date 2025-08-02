import { Pressable, StyleSheet } from 'react-native';

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