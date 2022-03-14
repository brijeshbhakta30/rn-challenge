import { FlatList, StyleSheet, View, Text } from 'react-native';
import { Branch } from './Branch';
import { useNearByBranches } from './ClosestBranchProvider';
import { prettifyString } from './utils';

export default function BranchDetails() {
  const branches = useNearByBranches();
  if (!branches) {
    return null;
  }

  const getAddress = (branch: Branch) => {
    const { PostalAddress: { BuildingNumber, StreetName, TownName, PostCode } = {} } = branch;
    const addressItems = [BuildingNumber, StreetName, TownName, PostCode].filter(Boolean);
    return addressItems.join(', ');
  };

  const renderItem = ({ item: branch }: { item: Branch }) => (
    <View key={branch.Identification} style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.textTitle}>{branch.Name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>{getAddress(branch)}</Text>
      </View>
      {branch.ServiceAndFacility && (
        <View style={styles.row}>
          <Text style={styles.text}>Services: <Text style={styles.textBold}>
            {prettifyString(branch.ServiceAndFacility)}
          </Text></Text>
        </View>
      )}
      {branch.Accessibility && (
        <View style={styles.row}>
          <Text style={styles.text}>Accessibility: <Text style={styles.textBold}>{prettifyString(branch.Accessibility)}</Text></Text>
        </View>
      )}
    </View>
  );

  return (
    <FlatList
      data={branches}
      renderItem={renderItem}
      keyExtractor={(item) => item.Identification}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
  },
  text: {
    fontFamily: 'textRegular',
    color: 'black',
    fontSize: 14,
    flex: 1,
  },
  textBold: {
    fontFamily: 'textBold',
    color: 'black',
    fontSize: 14,
    flex: 1,
  },
  textTitle: {
    fontFamily: 'textBold',
    color: '#ED0000',
    fontSize: 16,
    flex: 1,
  }
});
