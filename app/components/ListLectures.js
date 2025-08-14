import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import {  buscarLecturasConRango } from '../storage/storage.js'

function formatFecha(serial) {
  if (!serial) return ''
  const utc_days = Math.floor(serial - 25569)
  const utc_value = utc_days * 86400
  const date_info = new Date(utc_value * 1000)
  const fractional_day = serial - Math.floor(serial)
  const total_seconds = Math.round(86400 * fractional_day)
  date_info.setSeconds(total_seconds)
  const parts = date_info.toLocaleString().split(',')
  return parts.length > 1 ? parts[1].trim() : date_info.toLocaleString()
}
const SearchStorageComponent = () => {
  const [query, setQuery] = useState('');
const [results, setResults] = useState([]);
const [centralId, setCentralId] = useState(null);

const handleSearch = async () => {
  try {
    const resultado = buscarLecturasConRango(query, 10);
  
    if(resultado.Msg){
      setResults([]);
      setCentralId(null);
      alert(resultado.Msg)
      return
    }
    // Guardamos el ID del central para poder identificarlo luego
    setCentralId(resultado.central?.id);

    const listaFinal = [
      ...(resultado.anteriores || []),
      resultado.central,
      ...(resultado.siguientes || []),
    ];

    setResults(listaFinal);
  } catch (e) {
    console.error('Error searching in storage:', e);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar:</Text>

      <TextInput
        style={styles.input}
        placeholder="Ingresar Nic o Medidor"
        keyboardType="numeric"
        value={query}
        onChangeText={setQuery}
      />

      <TouchableOpacity onPress={handleSearch} style={styles.button}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>

      <FlatList
        data={results}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => {
          const isMatch =
            item.NIC === parseInt(query) || item.Medidor === parseInt(query);

          return (
            <View
              style={[
                styles.card,
                isMatch && styles.highlightCard
              ]}
            >
              <Text style={styles.title}>NIC: {item.NIC}</Text>
              <Text>Medidor: {item.Medidor}</Text>
              <Text>Suscriptor: {item.Suscriptor}</Text>
              <Text>Dirección: {item.Dirección}</Text>
              <Text>Localidad: {item.Localidad}</Text>
              <Text>Cruce: {item.CRUCE}</Text>
              <Text>Orden: {item.ORDEN}</Text>
              <Text>Fecha: {formatFecha(item.Fecha)}</Text>
            </View>
          );
        }}
        ListEmptyComponent={
          query.length > 0 ? (
            <Text style={styles.status}>Sin resultados</Text>
          ) : null
        }
      />

    </View>
  );
};

export default SearchStorageComponent;
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 60,
  },
  status: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  highlightCard: {
    backgroundColor: '#4CAF50', // Verde
  },

});
