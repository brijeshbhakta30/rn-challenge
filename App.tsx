import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import BranchesInput from './src/BranchesInput';
import Map from './src/Map';
import Spinner from './src/Spinner';
import BranchDetails from './src/BranchDetails';
import { ClosestBranchProvider } from './src/ClosestBranchProvider';

export default function App() {
  return (
    <ClosestBranchProvider>
      {({ state, search, actions: { setSearch } }) => (
        <View style={styles.container}>
          <StatusBar style="auto" />
          <Map/>
          {state === 'ready' ? (
            <View style={styles.branchContainer}>
              <BranchesInput search={search} setSearch={setSearch} />
              <BranchDetails />
            </View>
          ) : state === 'error' ? (
            <View style={styles.centred}>
              <Text style={styles.error}>An error has occurred</Text>
            </View>
          ) : (
            <View style={styles.centred}>
              <Spinner height={60} />
            </View>
          )}
        </View>
      )}
    </ClosestBranchProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  error: {
    fontFamily: 'textRegular',
    fontSize: 24,
    color: '#ED0000',
    padding: 10,
    backgroundColor: '#80808030',
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  branchContainer: {
    backgroundColor: '#fff',
    flex: 0.4,
    paddingHorizontal: 16,
  }
});
