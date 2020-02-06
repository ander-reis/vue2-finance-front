<template>
 <app-layout>
   <router-view></router-view>
 </app-layout>
</template>

<script>

import AppLayout from '../components/AppLayout'

export default {
  name: 'Dashboard',
  components: {
    AppLayout
  }
}
</script>

<style scoped>

</style>
