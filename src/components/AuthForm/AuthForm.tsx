import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type AuthFormProps = {
  loading: boolean;
  error: string | null;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string) => Promise<void>;
};

export function AuthForm({ loading, error, onLogin, onRegister }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleSubmit = async () => {
    if (isRegisterMode) {
      await onRegister(email.trim(), password);
      return;
    }
    await onLogin(email.trim(), password);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{isRegisterMode ? "Create account" : "Login"}</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password (min 10 chars)"
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable
        disabled={loading || !email.trim() || !password}
        style={[styles.button, (loading || !email.trim() || !password) && styles.buttonDisabled]}
        onPress={() => void handleSubmit()}
      >
        <Text style={styles.buttonText}>{loading ? "Please wait..." : "Continue"}</Text>
      </Pressable>
      <Pressable disabled={loading} onPress={() => setIsRegisterMode((current) => !current)}>
        <Text style={styles.link}>
          {isRegisterMode
            ? "Already have an account? Login"
            : "Need an account? Register"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    padding: 20,
    gap: 12
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#121212"
  },
  input: {
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  button: {
    backgroundColor: "#1f6feb",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center"
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700"
  },
  link: {
    color: "#1f6feb",
    textAlign: "center"
  },
  error: {
    color: "#d1242f",
    fontWeight: "600"
  }
});
