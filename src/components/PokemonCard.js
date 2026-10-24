import { Pressable, View, Text, Image, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme/colors';

export default function PokemonCard({ pokemon, onPress }) {
  // Número con ceros a la izquierda: #025
  const formattedNumber = `#${String(pokemon.id).padStart(3, '0')}`;

  // Nombre con la primera letra en mayúscula
  const capitalizedName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <Pressable
      onPress={onPress}
      // El estilo cambia mientras el usuario mantiene presionado
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {/* Una Image con URL remota necesita width y height explícitos */}
      <Image source={{ uri: pokemon.image }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.number}>{formattedNumber}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {capitalizedName}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    margin: spacing.xs,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.6,
  },
  image: {
    width: 110,
    height: 110,
  },
  info: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  number: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textMuted,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 2,
  },
});