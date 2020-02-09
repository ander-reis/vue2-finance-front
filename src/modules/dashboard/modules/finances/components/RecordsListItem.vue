<template>
  <v-list-item>

    <v-avatar>
      <v-icon :class="[ recordIconColor(record.type), 'lighten-1 white--text' ]">{{ recordIcon(record.type) }}</v-icon>
    </v-avatar>

    <v-list-item-content>
      <v-list-item-title>{{ record.description }}</v-list-item-title>
      <v-list-item-title>{{ record.category.description }} | {{ record.account.description }}</v-list-item-title>
    </v-list-item-content>

    <v-list-item-action>
      <span :class="amountColor(record.amount)">{{ formatCurrency(record.amount) }}</span>
    </v-list-item-action>

  </v-list-item>
</template>

<script>

import formatCurrencyMixin from '@/mixins/format-currency'
import amountColorMixin from './../mixins/amount-color'

export default {
  name: 'RecordsListItem',
  mixins: [
    formatCurrencyMixin,
    amountColorMixin
  ],
  props: {
    record: Object
  },
  methods: {
    recordIcon (type) {
      return type === 'CREDIT' ? 'arrow_upward' : 'arrow_downward'
    },
    recordIconColor (type) {
      return type === 'CREDIT' ? 'blue' : 'red'
    }
  }
}
</script>

<style scoped>

</style>
