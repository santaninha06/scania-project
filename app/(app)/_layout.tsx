import { Redirect, Stack } from 'expo-router';
import { LoadingView } from '@/components/StateViews';
import { useAuth } from '@/context/AuthContext';
export default function AppLayout() {
  const { session, loading } = useAuth();
  if (loading) return <LoadingView />;
  if (!session) return <Redirect href="/login" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
