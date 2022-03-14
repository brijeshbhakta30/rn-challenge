import { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import * as Location from 'expo-location';
import { SearchLocation } from './SearchLocation';
import InputResults from './InputResults';
import { ClosestBranchContextType } from './ClosestBranchProvider';

export default function BranchesInput({
  search,
  setSearch,
}: {
  search: SearchLocation;
  setSearch: ClosestBranchContextType['actions']['setSearch'];
}) {
  const [input, setInput] = useState('');
  useEffect(() => {
    if (input.trim().length > 2) {
      setSearch('fetching');
      Location.geocodeAsync(input.trim())
        .then((result) => {
          setSearch(result[0] || 'no-result');
        })
        .catch(() => {
          setSearch('error');
        });
    } else {
      setSearch(undefined);
    }
  }, [input]);
  return (
    <View style={styles.container}>
      <TextInput
        value={input}
        onChangeText={setInput}
        style={styles.input}
        placeholder="Search for a branch"
        autoFocus
      />
      <View style={styles.result}>
        <InputResults search={search} input={input} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderColor: '#ccc',
    borderBottomWidth: 1,
  },
  input: {
    backgroundColor: '#fff',
    fontFamily: 'textRegular',
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 18,
    paddingVertical: 5,
    paddingHorizontal: 8,
    color: 'black',
  },
});
