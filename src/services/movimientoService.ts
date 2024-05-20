import { api } from 'src/services/api'
import { ICuenta } from 'src/services/cuentaService'

export interface IMovimiento {
  fecha: string
  tipo: string
  importe: number
  nroCuenta: string
  oCuenta?: ICuenta
}

export interface IAccountSaldoInterface {
  nroCuenta: string
  saldo: number
}

export interface ITransferenciaFormInterface {
  origen: IAccountSaldoInterface,
  destino: IAccountSaldoInterface,
  monto: number
}

export const getMovimientosCuenta = async (cuenta: ICuenta): Promise<IMovimiento[]> => {
  try {
    const response = await api.get(`/Movimiento/lista/${cuenta.nroCuenta}`)
    return response.data
  } catch (error) {
    throw new Error('error al guardar' + error)
  }
}

export async function addMovimiento (movimiento: IMovimiento): Promise<IMovimiento> {
  try {
    const response = await api.post('/Movimiento', movimiento)
    return response.data
  } catch (error) {
    throw new Error('Error adding account: ' + error)
  }
}

export const getAccountsSaldo = async (): Promise<IAccountSaldoInterface[]> => {
  try {
    const response = await api.get('/Movimiento/transferencia')
    return response.data
  } catch (error) {
    console.error('Error fetching accounts:', error)
    throw error
  }
}
