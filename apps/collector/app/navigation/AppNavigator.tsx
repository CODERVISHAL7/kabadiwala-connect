import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

import AccountProfileScreen from '../screens/AccountProfileScreen';


// Collector screens
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

import CollectorOffersScreen
  from '../screens/CollectorOffersScreen';

import CollectorTransactionsScreen
  from '../screens/CollectorTransactionsScreen';

// Admin screens
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminCollectorsScreen from '../screens/AdminCollectorsScreen';
import AdminCollectorDetailScreen
  from '../screens/AdminCollectorDetailScreen';
import AdminCollectionDetailScreen
  from '../screens/AdminCollectionDetailScreen';

//Recycler screens
import RecyclerRegisterScreen
  from '../screens/RecyclerRegisterScreen';
import RecyclerDashboardScreen
  from '../screens/RecyclerDashboardScreen';
import MaterialLotDetailsScreen
  from '../screens/MaterialLotDetailsScreen';
import MakeOfferScreen from '../screens/MakeOfferScreen';
import RecyclerTransactionsScreen
  from '../screens/RecyclerTransactionsScreen';
import RecyclerTransactionSuccessScreen
  from '../screens/RecyclerTransactionSuccessScreen';


const Stack = createNativeStackNavigator();

type UserRole =
  | 'collector'
  | 'recycler_user'
  | 'admin';

type Props = {
  authenticated: boolean;
  role: UserRole | null;
  isActive: boolean | null;
};

function AccountDisabledScreen() {
  return (
    <View style={styles.disabledContainer}>
      <Text style={styles.disabledIcon}>
        🔒
      </Text>

      <Text style={styles.disabledTitle}>
        Account Deactivated
      </Text>

      <Text style={styles.disabledMessage}>
        Your account has been deactivated by an
        administrator.
      </Text>

      <Text style={styles.disabledSubMessage}>
        Please contact the administrator if you
        believe this was done by mistake.
      </Text>
    </View>
  );
}

export default function AppNavigator({
  authenticated,
  role,
  isActive,
}: Props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
      }}
    >
      {authenticated ? (
        <>
          {/* =========================
              ACCOUNT STATUS
          ========================== */}

          {isActive === false ? (
            <Stack.Screen
              name="AccountDisabled"
              component={AccountDisabledScreen}
              options={{
                title: 'Account Disabled',
                headerBackVisible: false,
              }}
            />
          ) : role === 'admin' ? (

            /* =========================
               ADMIN
            ========================== */

            <>
              <Stack.Screen
                name="AdminDashboard"
                component={AdminDashboardScreen}
                options={{
                  title: 'Admin Dashboard',
                }}
              />

              <Stack.Screen
                name="AccountProfile"
                component={AccountProfileScreen}
                options={{
                  title: 'My Profile',
                }}
              />

              <Stack.Screen
                name="AdminCollectors"
                component={AdminCollectorsScreen}
                options={{
                  title: 'Collectors',
                }}
              />

              <Stack.Screen
                name="AdminCollectorDetail"
                component={AdminCollectorDetailScreen}
                options={{
                  title: 'Collector Details',
                }}
            />

            <Stack.Screen
              name="AdminCollectionDetail"
              component={AdminCollectionDetailScreen}
              options={{
                title: 'Collection Details',
              }}
            />
            </>

          ) : role === 'collector' ? (

            /* =========================
               COLLECTOR
            ========================== */

            <>
              <Stack.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                  title: 'Kabadiwala Connect',
                }}
              />

              <Stack.Screen
                name="CollectorOffers"
                component={CollectorOffersScreen}
                options={{
                  title: 'Incoming Offers',
                }}
              />

              <Stack.Screen
                name="CollectorTransactions"
                component={CollectorTransactionsScreen}
                options={{
                  title: 'My Transactions',
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
                component={CollectionDetailsScreen as any}
                options={{
                  title: 'Collection Details',
                }}
              />

              <Stack.Screen
                name="CollectionReview"
                component={CollectionReviewScreen as any}
                options={{
                  title: 'Review Collection',
                }}
              />

              <Stack.Screen
                name="ConfirmCollection"
                component={ConfirmCollectionScreen as any}
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
            /* =========================
               RECYCLER 
            ========================== */

          ) : role === 'recycler_user' ? (

            <>
              <Stack.Screen
                name="RecyclerDashboard"
                component={RecyclerDashboardScreen}
                options={{
                  title: 'Recycler Dashboard',
                }}
              />

              <Stack.Screen
                name="AccountProfile"
                component={AccountProfileScreen}
                options={{
                  title: 'My Profile',
                }}
              />

              <Stack.Screen
                name="MaterialLotDetails"
                component={MaterialLotDetailsScreen as any}
                options={{
                  title: 'Material Lot Details',
                }}
              />

                  <Stack.Screen
                    name="MakeOffer"
                    component={MakeOfferScreen as any}
                    options={{
                      title: 'Make Offer',
                    }}
                  />

                  <Stack.Screen
                    name="RecyclerTransactions"
                    component={RecyclerTransactionsScreen}
                    options={{
                      title: 'My Transactions',
                    }}
                  />

                  <Stack.Screen
                name="RecyclerTransactionSuccess"
                component={RecyclerTransactionSuccessScreen}
                options={{
                  title: 'Transaction Confirmed',
                  headerBackVisible: false,
                }}
/>
            </>

          ) : (
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                title: 'Collector Login',
              }}
            />
          )}
                  </>
                ) : (

        /* =========================
           AUTHENTICATION
        ========================== */

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

          <Stack.Screen
            name="RecyclerRegister"
            component={RecyclerRegisterScreen}
            options={{
              title: 'Recycler Registration',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  disabledContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#f5f5f5',
  },

  disabledIcon: {
    fontSize: 50,
    marginBottom: 20,
  },

  disabledTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
  },

  disabledMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 10,
  },

  disabledSubMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    color: '#666',
  },
});