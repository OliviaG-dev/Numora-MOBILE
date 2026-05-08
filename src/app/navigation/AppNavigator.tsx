import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "../../pages/Home/Home";
import { NewReading } from "../../pages/NewReading/NewReading";
import { Numerology } from "../../pages/Numerology/Numerology";
import { ReadingDetail } from "../../pages/ReadingDetail/ReadingDetail";
import type { AppStackParamList } from "../../types/navigation.types";
import type { NumerologyCalculatePayload, NumerologyResult } from "../../types/numerology.types";
import type { CreateReadingPayload, Reading } from "../../types/reading.types";

type AppNavigatorProps = {
  email: string;
  readings: Reading[];
  loading: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
  onOpenReading: (readingId: string) => Promise<Reading>;
  onDeleteReading: (readingId: string) => Promise<void>;
  onCreateReading: (payload: CreateReadingPayload) => Promise<void>;
  numerologyResult: NumerologyResult | null;
  numerologyError: string | null;
  numerologyLoading: boolean;
  onCalculateNumerology: (payload: NumerologyCalculatePayload) => Promise<void>;
  onLogout: () => Promise<void>;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator({
  email,
  readings,
  loading,
  error,
  onRefresh,
  onOpenReading,
  onDeleteReading,
  onCreateReading,
  numerologyResult,
  numerologyError,
  numerologyLoading,
  onCalculateNumerology,
  onLogout
}: AppNavigatorProps) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" options={{ title: "Numora" }}>
          {({ navigation }) => (
            <Home
              email={email}
              readings={readings}
              loading={loading}
              error={error}
              onRefresh={onRefresh}
              onOpenReading={(readingId) =>
                navigation.navigate("ReadingDetail", { readingId })
              }
              onDeleteReading={onDeleteReading}
              onGoToCreate={() => navigation.navigate("NewReading")}
              onGoToNumerology={() => navigation.navigate("Numerology")}
              onLogout={onLogout}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Numerology" options={{ title: "Numerology" }}>
          {() => (
            <Numerology
              loading={numerologyLoading}
              error={numerologyError}
              result={numerologyResult}
              onCalculate={onCalculateNumerology}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="NewReading" options={{ title: "New reading" }}>
          {({ navigation }) => (
            <NewReading
              onSubmit={onCreateReading}
              onBack={() => navigation.navigate("Home")}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="ReadingDetail" options={{ title: "Reading detail" }}>
          {({ navigation, route }) => (
            <ReadingDetail
              readingId={route.params.readingId}
              onLoad={onOpenReading}
              onBack={() => navigation.navigate("Home")}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
