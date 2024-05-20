<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      dense
      :rows="accounts"
      :columns="columns"
      row-key="name"
    >
      <template #top>
        <q-btn
          color="blue-9"
          label="Añadir cuenta"
          icon="mdi-plus"
          @click="showAddModal = true"
        />
      </template>
      <template v-slot:body-cell-Action="props">
        <q-td :props="props">
          <q-btn
            icon="list"
            size="sm"
            flat
            dense
            @click="handleViewDetail(props.row)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
  <q-dialog v-model="showAddModal">
    <q-card>
      <q-card-section>
        <q-input
          v-model="newCuentaForm.nombre"
          label="Nombre"
          :rules="[Required]"
        />
        <q-input
          v-model="newCuentaForm.nroCuenta"
          label="Número de Cuenta"
          :rules="[Required]"
        />
        <q-select
          v-model="newCuentaForm.tipo"
          :options="optionsTipoCuenta"
          label="Tipo"
          option-value="valor"
          option-label="label"
          emit-value
          map-options
          :rules="[Required]"
          hint=""
        />
        <q-select
          v-model="newCuentaForm.moneda"
          :options="optionsMoneda"
          label="Moneda"
          option-value="valor"
          option-label="label"
          emit-value
          map-options
          :rules="[Required]"
          hint=""
        />
        <q-input v-model.number="valorDefectoSaldo" label="Saldo" readonly />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancelar"
          color="primary"
          @click="showAddModal = false"
        />
        <q-btn flat label="Guardar" color="primary" @click="addCuenta" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showDetailModal">
    <q-card>
      <div class="q-pa-md">
        <div class="row">
          <div class="col-6">
            <q-item>
              <q-input
                dense
                outlined
                class="full-width"
                v-model="cuenta"
                readonly
                label="Nro. de cuenta"
              />
            </q-item>
          </div>
          <div class="col-6">
            <q-item>
              <q-input
                dense
                outlined
                class="full-width"
                v-model="moneda"
                readonly
                label="Moneda"
              />
            </q-item>
          </div>
          <div class="col-12">
            <q-item>
              <q-input
                dense
                autogrow
                outlined
                v-model="nombre"
                readonly
                class="full-width"
                label="Nombre de la cuenta"
              />
            </q-item>
          </div>
          <div class="col-6">
            <q-item>
              <q-input
                dense
                outlined
                class="full-width"
                v-model="saldo"
                readonly
                label="Saldo"
              />
            </q-item>
          </div>
        </div>
        <q-table
          flat
          bordered
          title="Movimiento de una cuenta"
          dense
          :rows="rowsMovimientos"
          :columns="columnsMovimientos"
          row-key="fecha"
        >
          <template #body-cell-importe="propsImporte">
            <q-td :props="propsImporte">
              <q-badge v-if="propsImporte.row.importe > 0" color="grey-6">
                {{ propsImporte.row.importe }}
              </q-badge>
              <q-badge v-if="propsImporte.row.importe < 0" color="red-6">
                {{ propsImporte.row.importe }}
              </q-badge>
              <q-badge v-if="propsImporte.row.importe == 0" color="black-6">
                {{ propsImporte.row.importe }}
              </q-badge>
            </q-td>
          </template>
        </q-table>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { AddCuenta, GetCuentas, ICuenta } from '../services/cuentaService'
import {
  IMovimiento,
  getMovimientosCuenta
} from '../services/movimientoService'
import { QTableColumn } from 'quasar'
import { Required } from '../rules/index'

const accounts = ref<ICuenta[]>([])
const newCuentaForm = ref<Partial<ICuenta>>({})
const showAddModal = ref()
const showDetailModal = ref()
const valorDefectoSaldo = ref(0)
const selectedCuenta = ref<ICuenta | null>(null)
const rowsMovimientos = ref<Partial<IMovimiento>[]>([])

const tipo = ref()
const moneda = ref()
const nombre = ref()
const saldo = ref()
const cuenta = ref()

onMounted(async () => {
  accounts.value = await GetCuentas()
})

const columns: QTableColumn[] = [
  {
    name: 'tipo',
    // Required: true,
    label: 'tipo',
    align: 'left',
    field: 'tipo',
    sortable: true
  },
  {
    name: 'moneda',
    align: 'center',
    label: 'Moneda',
    field: 'moneda',
    sortable: true
  },
  { name: 'nroCuenta', label: 'Cuenta', field: 'nroCuenta', sortable: true },
  { name: 'nombre', label: 'nombre', field: 'nombre' },
  { name: 'saldo', label: 'Saldo', field: 'saldo' },
  { name: 'Action', label: 'Acciones', field: 'Action' }
]

function formatFecha (fecha: Date): string {
  const dia = fecha.getDate().toString().padStart(2, '0')
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
  const año = fecha.getFullYear()
  const hora = fecha.getHours().toString().padStart(2, '0')
  const minuto = fecha.getMinutes().toString().padStart(2, '0')
  const segundo = fecha.getSeconds().toString().padStart(2, '0')

  return `${dia}/${mes}/${año}, ${hora}:${minuto}:${segundo}`
}

const columnsMovimientos: QTableColumn[] = [
  {
    name: 'fecha',
    label: 'fecha',
    align: 'left',
    field: 'fecha',
    format: (value: string) => formatFecha(new Date(value))
  },
  { name: 'importe', label: 'importe', align: 'right', field: 'importe' }
]

const optionsTipoCuenta = [
  {
    label: 'Cuenta de ahorro',
    valor: 'AHO',
    description: 'Moneda nacional',
    category: '1'
  },
  {
    label: 'Cuenta corriende',
    valor: 'CTE',
    description: 'Moneda extranjero',
    category: '2'
  }
]

const optionsMoneda = [
  {
    label: 'Bolivianos',
    valor: 'BOB',
    description: 'Moneda nacional',
    category: '1'
  },
  {
    label: 'Dólares',
    valor: 'USD',
    description: 'Moneda extranjero',
    category: '2'
  }
]

async function addCuenta () {
  const newCuenta = await AddCuenta(newCuentaForm.value as ICuenta)
  accounts.value.push(newCuenta)
  showAddModal.value = false
}

async function handleViewDetail (cuentas: ICuenta) {
  selectedCuenta.value = cuentas
  rowsMovimientos.value = await getMovimientosCuenta(cuentas)
  if (rowsMovimientos.value) {
    tipo.value = rowsMovimientos.value[0].oCuenta?.tipo
    moneda.value = rowsMovimientos.value[0].oCuenta?.moneda
    nombre.value = rowsMovimientos.value[0].oCuenta?.nombre
    saldo.value = rowsMovimientos.value[0].oCuenta?.saldo
    cuenta.value = rowsMovimientos.value[0].oCuenta?.nroCuenta
  }
  showDetailModal.value = true
}
</script>
