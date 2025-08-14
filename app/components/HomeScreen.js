import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Button,
  TouchableOpacity
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { descargarDatosProgresivamente} from '../api/fetchData'; // o desde donde tengas tu lógica
import { borrarTodo } from '../storage/storage.js'


export default function HomeScreen() {
  const [data, setData] = useState([]);
  const [fromCache, setFromCache] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const getdata = () => {
    setLoading(true);
    const fetchInitialData = async () => {
      const { data, fromCache } = await descargarDatosProgresivamente();
       setData(data || []); 
       
      setFromCache(fromCache);  
      setLoading(false);
      alert("Datos Cargados")
    };

    fetchInitialData();
  };

  const deldata=()=>{
      borrarTodo()
  }
  /* 
  // 📶 Escucha los cambios de conexión
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        getDataFromApiOrStorage().then(({ data }) => {
          if (data) setData(data);
        });
      }
    });
    return () => unsubscribe();
  }, []); */

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        {fromCache || !isConnected ? 'Modo Offline' : 'Datos en línea'}
      </Text>
      <TouchableOpacity onPress={() => getdata()} style={styles.button}>
        <Text style={styles.buttonText}>Cargar</Text>
      </TouchableOpacity>
      <Text style={styles.status}>
        Delete Datos
      </Text>
     <TouchableOpacity onPress={() => deldata()} style={styles.button2}>
        <Text style={styles.buttonText}>borrar</Text>
      </TouchableOpacity>
    </View>
  );
}

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
  loader: {
    flex: 1,
    justifyContent: 'center',
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
    button2: {
    marginTop: 10,
    backgroundColor: '#b41616ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
