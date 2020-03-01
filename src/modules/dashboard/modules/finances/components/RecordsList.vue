<template>
  <div>

    <total-balance class="mb-2"></total-balance>

    <toolbar-by-month
      class="mb-2"
      format="MM-YYYY"
      @month="changeMonth"
      :color="toolbarColor"
      :month="$route.query.month"
    ></toolbar-by-month>

    <v-card>

      <v-card-text class="text-center" v-if="mappedRecordsLength === 0">
        <v-icon size="100" color="grey">book</v-icon>
        <p class="font-weight-light grey--text">
          Nenhum laçamento no período
        </p>
      </v-card-text>

      <v-list two-line subheader v-else>
        <template v-for="(records, date, index) in mappedRecords">
          <v-subheader :key="date">{{ date }}</v-subheader>
          <records-list-item v-for="record in records" :key="record.id" :record="record"></records-list-item>
          <v-divider :key="`${date}-${index}`" v-if="showDivider(index, mappedRecords)"></v-divider>
        </template>
      </v-list>

      <v-footer class="pa-2">
        <v-flex class="d-flex flex-row-reverse">
          <h3 class="font-weight-light">
            <span>Saldo do Mês</span>
            <strong class="ml-3" :class="amountColor(totalAmount)">{{ formatCurrency(totalAmount) }}</strong>
          </h3>
        </v-flex>
      </v-footer>
    </v-card>
  </div>
</template>

<script>
import moment from 'moment'
import { Subject } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import RecordsListItem from './RecordsListItem'
import ToolbarByMonth from './ToolbarByMonth'
import TotalBalance from './TotalBalance'
import RecordsService from './../services/records-service'
import amountColorMixin from './../mixins/amount-color'
import formatCurrencyMixin from '@/mixins/format-currency'
import { groupBy } from '@/utils'

export default {
  name: 'RecordsList',
  components: {
    RecordsListItem,
    ToolbarByMonth,
    TotalBalance
  },
  mixins: [
    formatCurrencyMixin,
    amountColorMixin
  ],
  data: () => ({
    records: [],
    monthSubject$: new Subject()
  }),
  computed: {
    mappedRecords () {
      return groupBy(this.records, 'date', (record, dateKey) => {
        return moment(record[dateKey].substr(0, 10)).format('DD/MM/YYYY')
      })
    },
    mappedRecordsLength () {
      return Object.keys(this.mappedRecords).length
    },
    totalAmount () {
      return this.records.reduce((sum, record) => sum + record.amount, 0)
    },
    toolbarColor () {
      return this.totalAmount < 0 ? 'error' : 'primary'
    }
  },
  created () {
    this.setRecords()
  },
  methods: {
    changeMonth (month) {
      this.$router.push({
        path: this.$route.path,
        query: { month: month }
      })

      this.monthSubject$.next({ month })
    },
    setRecords (month) {
      console.log('Subcribing...', this.records)
      this.monthSubject$.pipe(
        mergeMap(variables => RecordsService.records(variables))
      ).subscribe(records => (this.records = records))
    },
    showDivider (index, object) {
      return index < Object.keys(object).length - 1
    }
  }
}
</script>

<style scoped>

</style>
