import apollo from '@/plugins/apollo'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'

import AccountsQuery from './../graphql/Accounts.graphql'
import AccountCreateMutation from './../graphql/AccountCreate.graphql'

const accounts = () => {
  const queryRef = apollo.watchQuery({
    query: AccountsQuery
  })

  return from(queryRef)
    .pipe(
      map(res => res.data.accounts)
    )
}

const createAccount = async variables => {
  const response = await apollo.mutate({
    mutation: AccountCreateMutation,
    variables,
    update: (proxy, { data: { createAccount } }) => {
      try {
        const data = proxy.readQuery({
          query: AccountsQuery
        })

        data.accounts = [...data.accounts, createAccount]

        proxy.writeQuery({
          query: AccountsQuery,
          data: data
        })
      } catch (e) {
        console.log('Query "accounts" ainda não foi criada!')
      }
    }
  })
  return response.data.createAccount
}

export default {
  accounts,
  createAccount
}
