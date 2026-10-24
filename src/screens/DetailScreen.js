import { useState, useEffect } from 'react';
import {View,Text,Image,Pressable,ScrollView,ActivityIndicator,StyleSheet,} from 'react-native';
import { getPokemonByNameOrId } from '../services/pokeApi';
import {colors,spacing,typeColors,typeNamesEs,statNamesEs,} from '../theme/colors';

const MAX_STAT = 255;

export default function DetailScreen({ pokemonId, onBack }) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPokemonByNameOrId(pokemonId, controller.signal);
        setPokemon(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('No se pudo cargar la ficha del Pokémon.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadDetail();
    return () => controller.abort();
  }, [pokemonId, retryCount]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando ficha del Pokémon...</Text>
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.center}>
        <Text style={[styles.errorText, { color: colors.danger }]}>
          {error || 'Pokémon no encontrado.'}
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => setRetryCount((prev) => prev + 1)}
        >
          <Text style={styles.buttonText}>Reintentar</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.backButtonSecondary]}
          onPress={onBack}
        >
          <Text style={styles.buttonText}>Volver a la lista</Text>
        </Pressable>
      </View>
    );
  }

  const formattedNumber = `#${String(pokemon.id).padStart(3, '0')}`;
  const capitalizedName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Volver a la lista</Text>
        </Pressable>
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: pokemon.image }} style={styles.image} />
      </View>

      <View style={styles.content}>
        <Text style={styles.number}>{formattedNumber}</Text>
        <Text style={styles.title}>{capitalizedName}</Text>

        <View style={styles.typesRow}>
          {pokemon.types.map((type) => (
            <View
              key={type}
              style={[
                styles.typeBadge,
                { backgroundColor: typeColors[type] || colors.textMuted },
              ]}
            >
              <Text style={styles.typeText}>
                {typeNamesEs[type] || type.toUpperCase()}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{pokemon.height} m</Text>
            <Text style={styles.metricLabel}>Altura</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{pokemon.weight} kg</Text>
            <Text style={styles.metricLabel}>Peso</Text>
          </View>
        </View>

        <Text style={styles.section}>Estadísticas base</Text>
        <View style={styles.statsCard}>
          {pokemon.stats.map((stat) => {
            const percentage = Math.min((stat.baseStat / MAX_STAT) * 100, 100);
            return (
              <View key={stat.name} style={styles.statRow}>
                <Text style={styles.statName}>
                  {statNamesEs[stat.name] || stat.name}
                </Text>
                <Text style={styles.statValue}>{stat.baseStat}</Text>
                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${percentage}%`,
                        backgroundColor:
                          stat.baseStat >= 100
                            ? colors.success
                            : colors.primary,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        <Pressable style={styles.button} onPress={onBack}>
          <Text style={styles.buttonText}>Volver a la lista</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  backButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  image: {
    width: 220,
    height: 220,
  },
  content: {
    padding: spacing.md,
  },
  number: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textMuted,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  typesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  typeBadge: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  typeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  metricLabel: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: spacing.sm,
  },
  statsCard: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statName: {
    width: 95,
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
  statValue: {
    width: 38,
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'right',
    marginRight: spacing.sm,
  },
  barBackground: {
    flex: 1,
    height: 10,
    backgroundColor: colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
    backButtonSecondary: {
    backgroundColor: colors.textMuted,
    marginTop: spacing.sm,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  loadingText: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: 15,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});