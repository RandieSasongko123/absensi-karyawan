import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import AppBar from '../../components/AppBar';
import { useAuth } from '../../context/AuthContext';

export default function TabsLayout() {
  const { isAdmin } = useAuth();

  return (
    <>
      <AppBar />
      <Tabs 
        screenOptions={{ 
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
          },
          tabBarActiveTintColor: '#3498db',
          tabBarInactiveTintColor: '#95a5a6',
          tabBarLabelStyle: {
            fontFamily: 'Quicksand-Medium',
            fontSize: 12,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="time" size={size} color={color} />
            ),
          }}
        />
        
        {/* Tab Report dengan redirect jika bukan admin */}
        <Tabs.Screen
          name="report"
          options={{
            title: 'Report',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document-text" size={size} color={color} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              if (!isAdmin) {
                e.preventDefault(); // Mencegah navigasi
                // Bisa tambahkan alert atau feedback lain
              }
            },
          }}
          redirect={!isAdmin}
        />
        
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}