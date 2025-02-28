import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function NewPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.newPageText}>This is the New Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  newPageText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
});
