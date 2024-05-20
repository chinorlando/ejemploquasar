<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
          @click="navigate(link)"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

defineOptions({
  name: 'MainLayout'
})

const linksList: (EssentialLinkProps & { route?: string })[] = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    route: '/'
  },
  {
    title: 'Cuenta',
    caption: 'Gestion de cuenta',
    icon: 'school',
    route: '/cuenta'
  },
  {
    title: 'Transacciones',
    caption: 'abono y retiro',
    icon: 'school',
    route: '/transaccion'
  },
  {
    title: 'Transferencias',
    caption: 'abono entre cuentas',
    icon: 'school',
    route: '/transferencia'
  }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function navigate (link: { route?: string}) {
  if (link.route) {
    router.push(link.route)
  }
}
</script>
