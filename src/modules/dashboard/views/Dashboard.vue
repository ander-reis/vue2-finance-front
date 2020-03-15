<template>
 <app-layout>
   <router-view></router-view>
 </app-layout>
</template>

<script>

import AppLayout from '../components/AppLayout'
import { registerVuexModule } from '../../../utils'
import financesStore from './../modules/finances/store'

export default {
  name: 'Dashboard',
  components: {
    AppLayout
  },
  created () {
    registerVuexModule(this.$store, 'finances', financesStore)
  }
}
</script>

<style scoped>

</style>
