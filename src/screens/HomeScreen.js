import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { getPokemonList, getPokemonByNameOrId } from '../services/pokeApi';
import PokemonCard from '../components/PokemonCard';
import { colors, spacing } from '../theme/colors';

const PAGE_LIMIT = 20;

export default function HomeScreen({ onSelectPokemon }) {
  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState('');

  const [pokemonList, setPokemonList] = useState([]);
  const [searchResult, setSearchResult] = useState(null);

  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadList = async () => {
      if (offset === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      try {
        const newItems = await getPokemonList(PAGE_LIMIT, offset, controller.signal);
        setPokemonList((prev) => {
          if (offset === 0) return newItems;
          return [...prev, ...newItems];
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('No se pudo conectar con la PokéAPI. Revisa tu internet.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    };

    loadList();
    return () => controller.abort();
  }, [offset, retryCount]);

  useEffect(() => {
    if (!query) {
      setSearchResult(null);
      return;
    }

    const controller = new AbortController();

    const searchOne = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getPokemonByNameOrId(query, controller.signal);
        setSearchResult(result ? [result] : []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Ocurrió un error al buscar el Pokémon. Intenta de nuevo.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    searchOne();
    return () => controller.abort();
  }, [query, retryCount]);

  const handleSearch = () => {
    const text = searchText.trim().toLowerCase();
    setQuery(text);
  };

  const handleClearSearch = () => {
    setSearchText('');
    setQuery('');
    setError(null);
  };

  const handleLoadMore = () => {
    if (!query && !loading && !loadingMore && !error) {
      setOffset((prevOffset) => prevOffset + PAGE_LIMIT);
    }
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  const dataToDisplay = query ? searchResult : pokemonList;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PokéDex Explorer</Text>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Busca por nombre o número..."
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            if (text.trim() === '') setQuery('');
          }}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Buscar</Text>
        </Pressable>
        {query !== '' && (
          <Pressable style={styles.clearButton} onPress={handleClearSearch}>
            <Text style={styles.clearButtonText}>✕</Text>
          </Pressable>
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando Pokémon...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[styles.message, { color: colors.danger }]}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.buttonText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={dataToDisplay}
          numColumns={2}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <PokemonCard
              pokemon={item}
              onPress={() => onSelectPokemon(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            <Text style={styles.message}>
              No se encontró ningún Pokémon para "{query}" 🔍
            </Text>
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.footerText}>Cargando más Pokémon...</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  searchRow: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  clearButtonText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.lg,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  loadingText: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: 15,
  },
  message: {
    textAlign: 'center',
    marginTop: spacing.lg,
    color: colors.textMuted,
    fontSize: 15,
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
  },
  footerLoader: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
});