import { useState, useEffect } from 'react';
import * as Network from 'expo-network';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkConnection = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        if (isMounted) {
          // Only show offline if explicitly disconnected
          // null/undefined values default to connected (optimistic)
          const isOffline = networkState.isConnected === false;
          setIsConnected(!isOffline);
          setIsChecking(false);
        }
      } catch {
        if (isMounted) {
          // Assume connected if check fails
          setIsConnected(true);
          setIsChecking(false);
        }
      }
    };

    // Initial check
    checkConnection();

    // Poll every 5 seconds (expo-network doesn't have listeners)
    const interval = setInterval(checkConnection, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { isConnected, isChecking };
}
