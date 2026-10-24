import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import { colors } from './src/theme/colors';

export default function App() {
  // Estado para alternar entre la vista de lista (null) y la vista de detalle (id del Pokémon)
  const [selectedPokemonId, setSelectedPokemonId] = useState(null);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor={colors.primary} />
        {selectedPokemonId === null ? (
          <HomeScreen
            onSelectPokemon={(id) => setSelectedPokemonId(id)}
          />
        ) : (
          <DetailScreen
            pokemonId={selectedPokemonId}
            onBack={() => setSelectedPokemonId(null)}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
});