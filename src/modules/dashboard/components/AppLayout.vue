<template>
  <div>
    <app-toolbar v-model="drawer"></app-toolbar>
    <app-menu v-model="drawer"></app-menu>

    <v-container grid-list-md>
      <v-layout>
        <v-flex xs12>
          <slot></slot>
        </v-flex>
      </v-layout>
    </v-container>

    <app-floating-button></app-floating-button>
  </div>
</template>

<script>

import AppToolbar from './AppToolbar'
import AppMenu from './AppMenu'
import AppFloatingButton from './AppFloatingButton'

export default {
  name: 'AppLayout',
  components: {
    AppToolbar,
    AppMenu,
    AppFloatingButton
  },
  data: () => ({
    drawer: false
  })
}
</script>

<style scoped>

</style>
