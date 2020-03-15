import apollo from '@/plugins/apollo'
import moment from 'moment'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'
import md5 from 'md5'

import RecordCreateMutation from './../graphql/RecordCreate.graphql'
import RecordsQuery from './../graphql/Records.graphql'
import TotalBalanceQuery from './../graphql/TotalBalance.graphql'

// anterior a aula 468
// const createRecord = async variables => {
//   const response = await apollo.mutate({
//     mutation: RecordCreateMutation,
//     variables
//   })
//   return response.data.createRecord
// }

const createRecord = async variables => {
  const response = await apollo.mutate({
    mutation: RecordCreateMutation,
    variables,
    update: (proxy, { data: { createRecord } }) => {
      // console.log('Proxy: ', proxy)
      // console.log('Mutation: ', mutation)

      const month = moment(createRecord.date.substr(0, 10)).format('MM-YYYY')
      const variables = { month }

      // insere record
      try {
        // lê query cache apollo
        const recordsData = proxy.readQuery({
          query: RecordsQuery,
          variables
        })

        // reatribui valores
        recordsData.records = [...recordsData.records, createRecord]

        // reescreve query cache apollo
        proxy.writeQuery({
          query: RecordsQuery,
          variables,
          data: recordsData
        })
      } catch (e) {
        console.log('Query "records" não foi criada ainda!', e)
      }

      // recalcula totalBalance
      try {
        const currentDate = moment().endOf('day')
        const recordDate = moment(createRecord.date.substr(0, 10))
        const variables = { date: currentDate.format('YYYY-MM-DD') }

        if (recordDate.isBefore(currentDate)) {
          const totalBalanceData = proxy.readQuery({
            query: TotalBalanceQuery,
            variables
          })

          totalBalanceData.totalBalance = +(totalBalanceData.totalBalance + createRecord.amount).toFixed(2)

          proxy.writeQuery({
            query: TotalBalanceQuery,
            variables,
            data: totalBalanceData
          })
        }
      } catch (e) {
        console.log('Query "totalBalance" não foi criada ainda!', e)
      }
    }
  })
  return response.data.createRecord
}

// anterior a aula 467
// const records = async variables => {
//   const response = await apollo.query({
//     query: RecordsQuery,
//     variables
//   })
//   return response.data.records
// }

const recordsWatchedQueries = {}

const records = variables => {
  const hashKey = md5(
    Object.keys(variables)
      .map(k => variables[k])
      .join('_')
  )

  console.log('Hashkey', hashKey)

  let queryRef = recordsWatchedQueries[hashKey]

  if (!queryRef) {
    queryRef = apollo.watchQuery({
      query: RecordsQuery,
      variables
    })
    recordsWatchedQueries[hashKey] = queryRef
  }
  return from(queryRef)
    .pipe(
      map(res => res.data.records)
    )
}

const totalBalance = async () => {
  const response = await apollo.query({
    query: TotalBalanceQuery,
    variables: {
      date: moment().format('YYYY-MM-DD')
    }
  })
  return response.data.totalBalance
}

export default {
  createRecord,
  records,
  totalBalance
}
