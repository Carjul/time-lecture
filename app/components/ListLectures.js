import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { buscarLecturasConRango } from '../storage/storage.js';

function formatFecha(serial) {
  if (!serial) return '';
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  const fractional_day = serial - Math.floor(serial);
  const total_seconds = Math.round(86400 * fractional_day);
  date_info.setSeconds(total_seconds);
  const parts = date_info.toLocaleString().split(',');
  return parts.length > 1 ? parts[1].trim() : date_info.toLocaleString();
}

const SearchStorageComponent = () => {
  const [query, setQuery] = useState('');
  const [range, setRange] = useState(10); // rango seleccionado
  const [results, setResults] = useState([]);
  const [centralId, setCentralId] = useState(null);

  const handleSearch = async () => {
    try {
      const resultado = buscarLecturasConRango(query, range);

      if (resultado.Msg) {
        setResults([]);
        setCentralId(null);
        alert(resultado.Msg);
        return;
      }

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

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.headerCell}>NIC</Text>
      <Text style={styles.headerCell}>Medidor</Text>
      <Text style={styles.headerCell}>Suscriptor</Text>
      <Text style={styles.headerCell}>Localidad</Text>
      <Text style={styles.headerCell}>Dirección</Text>
      <Text style={styles.headerCell}>Hora</Text>
    </View>
  );

  const renderItem = ({ item }) => {
    const isCentral = item.id === centralId;
    return (
      <View style={[styles.tableRow, isCentral && styles.centralRow]}>
        <Text style={styles.cell}>{item.NIC}</Text>
        <Text style={styles.cell}>{item.Medidor}</Text>
        <Text style={styles.cell}>{item.Suscriptor}</Text>
        <Text style={styles.cell}>{item.Localidad}</Text>
        <Text style={styles.cell}>{item.Direccion}</Text>
        <Text style={styles.cell}>{formatFecha(item.Fecha)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar lecturas</Text>

      <TextInput
        style={styles.input}
        placeholder="Ingresar Nic o Medidor"
        keyboardType="numeric"
        value={query}
        onChangeText={setQuery}
      />

      <Text style={styles.label}>Rango de búsqueda:</Text>
      <Picker
        selectedValue={range}
        onValueChange={(value) => setRange(value)}
        style={styles.picker}
      >
        {[10, 20, 30, 40, 50, 60].map((num) => (
          <Picker.Item key={num} label={`${num}`} value={num} />
        ))}
      </Picker>

      <TouchableOpacity onPress={handleSearch} style={styles.button}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>

      <FlatList
        data={results}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        ListHeaderComponent={results.length > 0 ? renderHeader : null}
        renderItem={renderItem}
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
    flex: 1,
    backgroundColor: '#e8f5e9', // Verde muy clarito
    padding: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#a5d6a7',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  label: {
    fontWeight: '600',
    color: '#388e3c',
    marginBottom: 5,
  },
  picker: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#a5d6a7',
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#388e3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c62828',
    textAlign: 'center',
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#66bb6a',
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 4,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginBottom: 2,
    borderRadius: 4,
    paddingVertical: 6,
  },
  cell: {
    flex: 1,
    fontSize: 12,
    color: '#2e7d32',
    textAlign: 'center',
  },
  centralRow: {
    backgroundColor: '#c8e6c9', // Verde más fuerte para resaltar el central
  },
});
