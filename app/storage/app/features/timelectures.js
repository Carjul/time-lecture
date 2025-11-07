import { createSlice } from '@reduxjs/toolkit'
import { buscarLecturasConRango } from '../../storage.js';

const initialState = {
  listaFinal: [],
  Msg: '',
  centralId: null,
}

export const DataLectures = createSlice({
  name: 'data',
  initialState,
  reducers: {
  handleSearch: async (query, range) => {
      try {
        const resultado = buscarLecturasConRango(query, range);
  
        if (resultado.Msg) {
            Msg = resultado.Msg;
            listaFinal = [];
            centralId = null;
          return;
        }
        centralId = resultado.central?.id;
    
        listaFinal = [
          ...(resultado.anteriores || []),
          resultado.central,
          ...(resultado.siguientes || []),
        ];
  
      } catch (e) {
        console.error('Error searching in storage:', e);
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const { handleSearch } = DataLectures.actions

export default DataLectures.reducer