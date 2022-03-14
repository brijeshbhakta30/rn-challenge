import { StyleSheet, Text } from 'react-native';
import Spinner from './Spinner';
import { SearchLocation } from './SearchLocation';

export default function InputResults({
  search,
  input,
}: {
  search: SearchLocation;
  input: string;
}) {
  if (!input.trim() || search === undefined) return null;
  if (search === 'fetching') {
    return (
      <>
        <Spinner height={14} />
        <Text style={styles.text}>
          &nbsp;&nbsp;Searching for{' '}
          <Text style={styles.inputText}>{input}</Text>
        </Text>
      </>
    );
  }
  if (search === 'no-result') {
    return (
      <Text style={styles.text}>
        No results for <Text style={styles.inputText}>{input}</Text>
      </Text>
    );
  }
  if (search === 'error') {
    return (
      <Text style={styles.text}>
        Error retrieving results for{' '}
        <Text style={styles.inputText}>{input}</Text>
      </Text>
    );
  }
  return (
    <Text style={styles.text}>
      Showing results for <Text style={styles.inputText}>{input}</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'textRegular',
    fontSize: 14,
    color: '#000000',
  },
  inputText: {
    fontFamily: 'textBold',
  },
});
