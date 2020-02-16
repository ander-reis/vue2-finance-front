<template>
    <records-list></records-list>
</template>

<script>

import { mapActions } from 'vuex'
import RecordsList from '../components/RecordsList'

export default {
  name: 'RecordsHome',
  components: {
    RecordsList
  },
  created () {
    this.setTitle({ title: 'Laçamentos' })
  },
  methods: {
    ...mapActions(['setTitle'])
  }
}
</script>

<style scoped>

</style>
