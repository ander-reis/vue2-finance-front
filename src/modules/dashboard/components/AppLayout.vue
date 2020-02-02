<template>
  <div>
    <app-toolbar v-model="drawer"></app-toolbar>
    <app-menu v-model="drawer"></app-menu>
  </div>
</template>

<script>

import AppToolbar from './AppToolbar'
import AppMenu from './AppMenu'

export default {
  name: 'AppLayout',
  components: {
    AppToolbar,
    AppMenu
  },
  data: () => ({
    drawer: false
  })
}
</script>

<style scoped>

</style>
