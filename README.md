# PokéDex Explorer

## Árbol de carpetas y responsabilidad de cada archivo

```text
pokedex-explorer/
├── App.js                        # Punto de entrada, SafeAreaView y navegación por estado entre vistas
├── README.md                     # Documentación de arquitectura del proyecto
└── src/
    ├── theme/
    │   └── colors.js             # Variables globales de diseño (colores, espaciado y colores por tipo)
    ├── services/
    │   └── pokeApi.js            # Capa de red: peticiones HTTP (fetch) y mapeo/transformación del JSON
    ├── components/
    │   └── PokemonCard.js        # Componente visual reutilizable para cada tarjeta de la cuadrícula
    └── screens/
        ├── HomeScreen.js         # Vista principal: buscador, estados de UI y FlatList con scroll infinito
        └── DetailScreen.js       # Vista de detalle: tipos, peso/altura en kg/m y barras de estadísticas


