import Assigned from "./AssignedTasks/AssignedTasks";
import { StudyStackParamList } from "../../types/types";
import CreatedTasks from "./CreatedTasks/CreatedTasks";
import AttemptScreen from "./AttemptScreen/AttemptScreen";
import { useAppSelector } from "../../hooks/storeHooks";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ViewResponse from "./ViewResponse/ViewResponse";
import IndividualResponses from "./ViewResponse/IndividualResponses";

export default function StudyScreen() {
  const Stack = createNativeStackNavigator<StudyStackParamList>();

  const { userData } = useAppSelector(state => state.user);

  return userData?.accountType ? (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name={
            userData?.accountType === "student" ? "Assigned" : "CreatedTasks"
          }
          component={
            userData?.accountType === "student" ? Assigned : CreatedTasks
          }
        />

        <Stack.Screen
          name="AttemptScreen"
          options={{ gestureEnabled: false, animation: "fade_from_bottom" }}
          component={AttemptScreen}
        />

        <Stack.Screen
          name="ViewResponses"
          options={{ gestureEnabled: false, animation: "fade_from_bottom" }}
          component={ViewResponse}
        />

        <Stack.Screen
          name="IndividualResponses"
          component={IndividualResponses}
        />
      </Stack.Navigator>
    </>
  ) : (
    <></>
  );
}
