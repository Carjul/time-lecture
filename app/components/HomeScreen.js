// HomeScreen.js
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, UIManager, Platform } from 'react-native';
import { descargarDatosProgresivamente } from '../api/fetchData';
import { borrarTodo } from '../storage/storage.js';

// Permitir animaciones en Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function HomeScreen() {
  const [fromCache, setFromCache] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estado de progreso
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [saved, setSaved] = useState(0);
  const [total, setTotal] = useState(0);

  const [showLoad, setShowLoad] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const percent = total > 0 ? Math.min(100, Math.round((saved / total) * 100)) : 0;

  const setGetData = () => {
    setPage(0);
    setTotalPages(0);
    setSaved(0);
    setTotal(0);
  };

  const getdata = () => {
    setLoading(true);
    setGetData();
    const onProgress = ({ page, totalPaginas, saved, total }) => {
      setPage(page);
      setTotalPages(totalPaginas);
      setSaved(saved);
      setTotal(total);
    };

    (async () => {
      const { fromCache } = await descargarDatosProgresivamente(onProgress);
      setFromCache(fromCache);
      setLoading(false);
      alert('✅ Datos cargados correctamente');
      setTimeout(() => {
        setGetData();
      }, 30000);
    })();
  };

  const deldata = () => {
    let msg = borrarTodo();
    alert(msg);
    setGetData();
  };

  // Animar desplegable
  const toggleSection = (type) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (type === "load") setShowLoad(!showLoad);
    if (type === "delete") setShowDelete(!showDelete);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        {fromCache ? '📴 Modo Offline' : '🌐 Datos en línea'}
      </Text>

      {/* Sección Cargar */}
      <TouchableOpacity onPress={() => toggleSection("load")} style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>⬇️ Cargar Datos</Text>
      </TouchableOpacity>
      {showLoad && (
        <View style={styles.sectionContent}>
          <TouchableOpacity
            onPress={getdata}
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Cargar'}</Text>
          </TouchableOpacity>

          {loading || total > 0 ? (
            <View style={styles.progressWrapper}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${percent}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {percent}%  •  {saved}/{total} registros  •  página {Math.max(page, 0)}/{Math.max(totalPages, 0)}
              </Text>
            </View>
          ) : null}
        </View>
      )}

      {/* Sección Borrar */}
      <TouchableOpacity onPress={() => toggleSection("delete")} style={[styles.sectionHeader, { backgroundColor: "#e74c3c" }]}>
        <Text style={styles.sectionHeaderText}>🗑️ Borrar Datos</Text>
      </TouchableOpacity>
      {showDelete && (
        <View style={styles.sectionContent}>
          <TouchableOpacity
            onPress={deldata}
            style={[styles.buttonDelete, loading && styles.buttonDisabled]}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Borrar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 50, backgroundColor: "#f8fff8", flex: 1 },
  status: { fontSize: 18, marginBottom: 20, fontWeight: 'bold', color: "#2e7d32" },

  sectionHeader: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  sectionHeaderText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  sectionContent: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#c8e6c9"
  },

  button: {
    marginTop: 10,
    backgroundColor: '#2e7d32',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonDelete: {
    marginTop: 10,
    backgroundColor: '#c0392b',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonDisabled: { opacity: 0.6 },

  buttonText: { color: '#fff', fontWeight: '600' },

  // Progreso
  progressWrapper: { marginTop: 16, width: '100%' },
  progressBar: {
    height: 18,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    marginTop: 6,
    fontSize: 14,
    color: '#333',
    textAlign: "center"
  },
});
