import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import * as Location from 'expo-location';
import { Branch } from './Branch';

export type States = 'loading-fonts' | 'loading-branches' | 'ready' | 'error';

async function fetchBranches(): Promise<undefined | Branch[]> {
  const branches = await fetch(
    'https://openbanking.santander.co.uk/sanuk/external/open-banking/v2.2/branches',
  );
  const json = await branches.json();
  return json?.data?.[0]?.Brand?.[0]?.Branch;
}

export default function useLoading() {
  const [state, setState] = useState<States>('loading-fonts');
  const [branches, setBranches] = useState<undefined | Branch[]>(undefined);

  const [fontsLoaded] = useFonts({
    textBold: require('../assets/fonts/SantanderMicroText-Bd.ttf'),
    textRegular: require('../assets/fonts/SantanderMicroText.ttf'),
  });

  useEffect(() => {
    Location.requestForegroundPermissionsAsync()
      .then((status) => {
        if (!status.granted) {
          setState('error');
        }
      })
      .catch(() => setState('error'));
  }, []);

  useEffect(() => {
    if (state === 'loading-fonts') {
      if (fontsLoaded) {
        setState('loading-branches');
      }
    } else if (state === 'loading-branches') {
      fetchBranches()
        .then((data) => {
          setBranches(data);
          setState('ready');
        })
        .catch(() => setState('error'));
    }
  }, [state, fontsLoaded]);

  return [state, branches] as [typeof state, typeof branches];
}
