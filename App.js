import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import { Button, Provider as PaperProvider } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

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

  const downloadImage = async () => {
    if (!foxImageUrl) return;

    try {
      // Solicitar permissão para acessar a mídia
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert('Permissão para acessar a galeria é necessária!');
        return;
      }

      // Baixar a imagem
      const fileUri = FileSystem.documentDirectory + 'fox.jpg';
      const { uri } = await FileSystem.downloadAsync(foxImageUrl, fileUri);

      // Salvar a imagem na galeria
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('app-fox', asset, false);

      Alert.alert('Sucesso', 'Imagem salva na galeria!');
    } catch (error) {
      console.error('Erro ao baixar a imagem:', error);
      Alert.alert('Erro ao baixar a imagem');
    }
  };

  useEffect(() => {
    fetchFoxImage();
  }, []);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Imagens Aleatórias de Raposas</Text>
        <View style={styles.imageContainer}>
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          {error && <Text style={styles.error}>{error}</Text>}
          {foxImageUrl && !loading && <Image source={{ uri: foxImageUrl }} style={styles.image} />}
        </View>
        <Button mode="contained" onPress={fetchFoxImage} style={styles.button}>
          Sortear nova Imagem
        </Button>
        {foxImageUrl && (
          <Button mode="contained" onPress={downloadImage} style={styles.button}>
            Baixar Imagem
          </Button>
        )}
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
  imageContainer: {
    width: 300,
    height: 300,
    margin: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
