import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import NewCollectionScreen from '../screens/NewCollectionScreen';
import CollectionDetailsScreen from '../screens/CollectionDetailsScreen';
import CollectionReviewScreen from '../screens/CollectionReviewScreen';
import ConfirmCollectionScreen from '../screens/ConfirmCollectionScreen';
import CollectionSuccessScreen from '../screens/CollectionSuccessScreen';
import CollectionHistoryScreen from '../screens/CollectionHistoryScreen';
import CollectionDetailScreen from '../screens/CollectionDetailScreen';
import CollectorProfileScreen from '../screens/CollectorProfileScreen';
import EditCollectorProfileScreen from '../screens/EditCollectorProfileScreen';

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

  <Stack.Screen
            name="ConfirmCollection"
            component={ConfirmCollectionScreen}
            options={{
                title: 'Confirm Collection',
            }}
        />

        <Stack.Screen
  name="CollectionSuccess"
  component={CollectionSuccessScreen}
  options={{
    title: 'Collection Successful',
  }}
/>

    <Stack.Screen
  name="CollectionHistory"
  component={CollectionHistoryScreen}
  options={{
    title: 'My Collections',
  }}
/>

    <Stack.Screen
  name="CollectionDetail"
  component={CollectionDetailScreen}
  options={{
    title: 'Collection Details',
  }}
/>

<Stack.Screen
  name="CollectorProfile"
  component={CollectorProfileScreen}
  options={{
    title: 'My Profile',
  }}
/>

<Stack.Screen
  name="EditCollectorProfile"
  component={EditCollectorProfileScreen}
  options={{
    title: 'Edit Profile',
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