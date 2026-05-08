import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAuth } from "../hooks/useAuth";
import { useNumerology } from "../hooks/useNumerology";
import { useReadings } from "../hooks/useReadings";
import { Auth } from "../pages/Auth/Auth";
import { AppNavigator } from "./navigation/AppNavigator";

export function App() {
  const auth = useAuth();
  const readings = useReadings();
  const numerology = useNumerology();

  if (auth.isBootstrapping) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!auth.isAuthenticated || !auth.user) {
    return (
      <Auth
        loading={auth.isSubmitting}
        error={auth.error}
        onLogin={async (email, password) => auth.login({ email, password })}
        onRegister={async (email, password) => auth.register({ email, password })}
      />
    );
  }

  return (
    <AppNavigator
      email={auth.user.email}
      readings={readings.readings}
      loading={readings.isLoading}
      error={readings.error}
      onRefresh={readings.refreshReadings}
      onOpenReading={readings.loadReadingById}
      onDeleteReading={readings.removeReading}
      onCreateReading={async (payload) => {
        await readings.addReading(payload);
      }}
      numerologyResult={numerology.result}
      numerologyError={numerology.error}
      numerologyLoading={numerology.isLoading}
      onCalculateNumerology={async (payload) => {
        await numerology.calculate(payload);
      }}
      onLogout={auth.logout}
    />
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
