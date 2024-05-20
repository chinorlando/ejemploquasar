<template>
  <div class="q-pa-md">
    <q-card>
      <q-form ref="form" class="q-gutter-md">
        <q-card-section>
          <q-select
            v-model="newMovimientoForm.nroCuenta"
            :options="cuentas"
            label="Cuentass"
            option-value="nroCuenta"
            option-label="nroCuenta"
            emit-value
            map-options
            :rules="[Required]"
            hint=""
          />
          <q-input
            v-model.number="newMovimientoForm.importe"
            label="Monto"
            :rules="[Required, NoZero]"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Abonar"
            color="primary"
            @click="handleSave(false)"
          />
          <q-btn
            flat
            label="Retiro"
            color="primary"
            @click="handleSave(true)"
          />
          <q-btn
            flat
            label="Cancelar"
            color="primary"
            />
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { GetCuentas, ICuenta } from 'src/services/cuentaService'
import { IMovimiento, addMovimiento } from 'src/services/movimientoService'
import { onMounted, ref } from 'vue'
import { QForm } from 'quasar'
import { Required, NoZero } from 'src/rules'

const loading = ref(true)
const error = ref<string | null>(null)
const cuentas = ref<ICuenta[]>([])
const newMovimientoForm = ref<Partial<IMovimiento>>({})
const form = ref<InstanceType<typeof QForm> | null>(null)

onMounted(async () => {
  try {
    cuentas.value = await GetCuentas()
  } catch (err) {
    error.value = 'Error fetching accounts'
  } finally {
    loading.value = false
  }
})

async function handleSave (isWithdrawal: boolean) {
  if (form.value) {
    const valid = await form.value.validate()
    if (valid) {
      saveTransaccionNew(isWithdrawal)
    }
  }
}

async function saveTransaccionNew (bandera: boolean) {
  const { importe } = newMovimientoForm.value

  if (bandera) {
    const nuevoImporte = '-' + importe
    newMovimientoForm.value.importe = Number(nuevoImporte)
  }
  await addMovimiento(newMovimientoForm.value as IMovimiento)

  // resetForm()
}
</script>
