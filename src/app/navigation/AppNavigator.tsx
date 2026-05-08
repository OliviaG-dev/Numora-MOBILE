import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CompatibilityAnalyzer } from "../../pages/CompatibilityAnalyzer/CompatibilityAnalyzer";
import { DailyVibration } from "../../pages/DailyVibration/DailyVibration";
import { DateAnalyzer } from "../../pages/DateAnalyzer/DateAnalyzer";
import { Home } from "../../pages/Home/Home";
import { MatrixDestiny } from "../../pages/MatrixDestiny/MatrixDestiny";
import { NameAnalyzer } from "../../pages/NameAnalyzer/NameAnalyzer";
import { NewReading } from "../../pages/NewReading/NewReading";
import { Numerology } from "../../pages/Numerology/Numerology";
import { PlaceVibration } from "../../pages/PlaceVibration/PlaceVibration";
import { Profile } from "../../pages/Profile/Profile";
import { Readings } from "../../pages/Readings/Readings";
import { ReadingDetail } from "../../pages/ReadingDetail/ReadingDetail";
import { Settings } from "../../pages/Settings/Settings";
import { TreeOfLife } from "../../pages/TreeOfLife/TreeOfLife";
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
              onGoToReadings={() => navigation.navigate("Readings")}
              onGoToNumerology={() => navigation.navigate("Numerology")}
              onGoToMatrixDestiny={() => navigation.navigate("MatrixDestiny")}
              onGoToTreeOfLife={() => navigation.navigate("TreeOfLife")}
              onGoToDateAnalyzer={() => navigation.navigate("DateAnalyzer")}
              onGoToNameAnalyzer={() => navigation.navigate("NameAnalyzer")}
              onGoToDailyVibration={() => navigation.navigate("DailyVibration")}
              onGoToPlaceVibration={() => navigation.navigate("PlaceVibration")}
              onGoToCompatibilityAnalyzer={() =>
                navigation.navigate("CompatibilityAnalyzer")
              }
              onGoToProfile={() => navigation.navigate("Profile")}
              onGoToSettings={() => navigation.navigate("Settings")}
              onLogout={onLogout}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Readings" options={{ title: "Readings" }}>
          {({ navigation }) => (
            <Readings
              readings={readings}
              loading={loading}
              error={error}
              onRefresh={onRefresh}
              onOpenReading={(readingId) =>
                navigation.navigate("ReadingDetail", { readingId })
              }
              onDeleteReading={onDeleteReading}
              onGoToCreate={() => navigation.navigate("NewReading")}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Profile" options={{ title: "Profile" }}>
          {() => <Profile email={email} />}
        </Stack.Screen>
        <Stack.Screen name="Settings" options={{ title: "Settings" }}>
          {() => <Settings onLogout={onLogout} />}
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
        <Stack.Screen name="MatrixDestiny" options={{ title: "Matrix Destiny" }}>
          {() => <MatrixDestiny initialMatrix={numerologyResult?.matrixDestiny ?? null} />}
        </Stack.Screen>
        <Stack.Screen name="TreeOfLife" options={{ title: "Tree of Life" }}>
          {() => <TreeOfLife initialTree={numerologyResult?.treeOfLife ?? null} />}
        </Stack.Screen>
        <Stack.Screen name="DateAnalyzer" options={{ title: "Date Analyzer" }}>
          {() => <DateAnalyzer />}
        </Stack.Screen>
        <Stack.Screen name="NameAnalyzer" options={{ title: "Name Analyzer" }}>
          {() => <NameAnalyzer />}
        </Stack.Screen>
        <Stack.Screen name="DailyVibration" options={{ title: "Daily Vibration" }}>
          {() => <DailyVibration />}
        </Stack.Screen>
        <Stack.Screen name="PlaceVibration" options={{ title: "Place Vibration" }}>
          {() => <PlaceVibration />}
        </Stack.Screen>
        <Stack.Screen
          name="CompatibilityAnalyzer"
          options={{ title: "Compatibility Analyzer" }}
        >
          {() => <CompatibilityAnalyzer />}
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
