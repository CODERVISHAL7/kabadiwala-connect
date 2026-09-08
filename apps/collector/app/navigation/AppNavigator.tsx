import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import NewCollectionScreen from '../screens/NewCollectionScreen';
import CollectionDetailsScreen from '../screens/CollectionDetailsScreen';
import CollectionReviewScreen from '../screens/CollectionReviewScreen';

const Stack = createNativeStackNavigator();

type Props = {
  authenticated: boolean;
};

export default function AppNavigator({
  authenticated,
}: Props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
      }}
    >
    {authenticated ? (
      <>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
        title: 'Kabadiwala Connect',
      }}
    />

    <Stack.Screen
      name="NewCollection"
      component={NewCollectionScreen}
      options={{
        title: 'New Collection',
      }}
    />

    <Stack.Screen
  name="CollectionDetails"
  component={CollectionDetailsScreen}
  options={{
    title: 'Collection Details',
  }}
/>
  <Stack.Screen
  name="CollectionReview"
  component={CollectionReviewScreen}
  options={{
    title: 'Review Collection',
  }}
/>
  </>
) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              title: 'Collector Login',
            }}
          />

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              title: 'Create Account',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}