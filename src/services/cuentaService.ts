import { api } from './api'

export interface ICuenta {
  nroCuenta: string;
  tipo: string;
  moneda: string;
  nombre: string;
  saldo: number;
  movimientos: unknown[];
}

export const GetCuentas = async (): Promise<ICuenta[]> => {
  try {
    const response = await api.get('/Cuenta')
    return response.data
  } catch (error) {
    console.error('Error fetching accounts:', error)
    throw error
  }
}

export const AddCuenta = async (cuenta: ICuenta): Promise<ICuenta> => {
  try {
    const response = await api.post('/Cuenta', cuenta)
    return response.data
  } catch (error) {
    throw new Error('erro al registrar el dato' + error)
  }
}
