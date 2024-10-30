import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import { Button, Provider as PaperProvider } from 'react-native-paper';

export default function App() {
  const [foxImageUrl, setFoxImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFoxImage = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://randomfox.ca/floof/');
      const data = await response.json();
      setFoxImageUrl(data.image);
    } catch (error) {
      setError('Erro ao buscar imagem da raposa');
      console.error('Error fetching fox image:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoxImage();
  }, []);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Imagens Aleatórias de Raposas</Text>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {error && <Text style={styles.error}>{error}</Text>}
        {foxImageUrl && !loading && <Image source={{ uri: foxImageUrl }} style={styles.image} />}
        <Button mode="contained" onPress={fetchFoxImage} style={styles.button}>
          Sortear nova Imagem
        </Button>
        <StatusBar style="auto" />
        <Text style={styles.footer}>Powered by randomfox.ca</Text>
        <Text style={styles.footer}>App by Lucas Albuquerque</Text>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    margin: 20,
    borderRadius: 20,
  },
  button: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    color: 'gray',
  },
});
