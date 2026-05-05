import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { AuthForm } from "../../components/AuthForm/AuthForm";

type AuthPageProps = {
  loading: boolean;
  error: string | null;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string) => Promise<void>;
};

export function Auth({ loading, error, onLogin, onRegister }: AuthPageProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.heading}>Numora Mobile</Text>
        <Text style={styles.subheading}>Connect to your Numora API account</Text>
        <AuthForm loading={loading} error={error} onLogin={onLogin} onRegister={onRegister} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f6ff"
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 12
  },
  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111111"
  },
  subheading: {
    color: "#5f5f5f",
    marginBottom: 10
  }
});
