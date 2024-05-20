<template>
  <q-card>
    <q-form ref="form" @submit.prevent="handleTransfer">
      <q-card-section>
        <div class="q-mb-md">
          <div class="text-h6">CUENTA ORIGEN</div>
          <q-select
            v-model="transferForm.origen"
            :options="cuentas"
            label="Cuenta"
            option-value="nroCuenta"
            option-label="nroCuenta"
            :rules="[Required]"
          />
          <q-input v-model="origenSaldo" label="Saldo Disponible" readonly />
        </div>

        <div class="q-mb-md">
          <div class="text-h6">CUENTA DESTINO</div>
          <q-select
            v-model="transferForm.destino"
            :options="cuentas"
            label="Cuenta"
            option-value="nroCuenta"
            option-label="nroCuenta"
            :rules="[Required]"
          />
          <div v-if="isSaldoInsuficiente" class="text-red">
            Saldo insuficiente
          </div>
          <q-input
            v-model.number="transferForm.monto"
            label="Monto"
            :rules="[Required, NoZero]"
            :disable="isSaldoInsuficiente"
          />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Aceptar" color="primary" type="submit" />
        <q-btn flat label="Cancelar" color="primary" @click="resetForm" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  IAccountSaldoInterface,
  getAccountsSaldo,
  ITransferenciaFormInterface,
  IMovimiento,
  addMovimiento
} from 'src/services/movimientoService'
import { QForm, useQuasar } from 'quasar'
import { Required, NoZero } from 'src/rules'

const loading = ref(true)
const error = ref<string | null>(null)
const cuentas = ref<IAccountSaldoInterface[]>([])
const newMovimientoForm = ref<Partial<IMovimiento>>({})
const newMovimientoFormDestino = ref<Partial<IMovimiento>>({})
const transferForm = ref<Partial<ITransferenciaFormInterface>>({})
const form = ref<InstanceType<typeof QForm> | null>(null)

const $q = useQuasar()

const origenSaldo = computed(() => {
  const account = cuentas.value.find(
    (acc) => acc.nroCuenta === transferForm.value.origen?.nroCuenta
  )
  return account ? account.saldo : 0
})

const isSaldoInsuficiente = computed(() => origenSaldo.value <= 0)

onMounted(async () => {
  try {
    cuentas.value = await getAccountsSaldo()
  } catch (err) {
    error.value = 'Error fetching accounts'
  } finally {
    loading.value = false
  }
})

const handleTransfer = async () => {
  if (form.value) {
    const valid = await form.value.validate()
    if (valid) {
      executeTransfer()
    }
  }
}

const executeTransfer = async () => {
  const { origen, destino, monto } = transferForm.value
  console.log('🚀🚀🚀 : monto', monto)
  const accountOrigen = cuentas.value.find(
    (acc) => acc.nroCuenta === origen?.nroCuenta
  )
  const accountDestino = cuentas.value.find(
    (acc) => acc.nroCuenta === destino?.nroCuenta
  )

  if (accountOrigen && accountDestino && monto) {
    if (accountOrigen.saldo >= monto) {
      accountOrigen.saldo -= monto
      accountDestino.saldo += monto

      const movimientoOrigen = {
        ...newMovimientoForm.value,
        nroCuenta: accountOrigen.nroCuenta,
        importe: -monto
      }

      try {
        addMovimiento(movimientoOrigen as IMovimiento)
      } catch (error) {
        throw new Error('error')
      }

      const movimientoDestino = {
        ...newMovimientoFormDestino.value,
        nroCuenta: accountDestino.nroCuenta,
        importe: monto
      }
      await delay(1000)
      try {
        addMovimiento(movimientoDestino as IMovimiento)
      } catch (error) {
        throw new Error('error 2')
      }
    } else {
      console.log('holas')
      $q.notify({
        type: 'negative',
        message: 'Saldo insuficiente en la cuenta de origen'
      })
    }
  }
}

function delay (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const resetForm = () => {
  transferForm.value = {}
  if (form.value) {
    form.value.resetValidation()
  }
}
</script>
