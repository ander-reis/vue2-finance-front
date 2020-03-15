import apollo from '@/plugins/apollo'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'

import CategoriesQuery from './../graphql/Categories.graphql'
import CategoryCreateMutation from './../graphql/CategoryCreate.graphql'

const categories = ({ operation } = {}) => {
  const queryRef = apollo.watchQuery({
    query: CategoriesQuery,
    variables: {
      operation: operation ? operation.toUpperCase() : operation
    }
  })

  return from(queryRef)
    .pipe(
      map(res => res.data.categories)
    )
}

const createCategory = async variables => {
  const response = await apollo.mutate({
    mutation: CategoryCreateMutation,
    variables,
    update: (proxy, { data: { createCategory } }) => {
      try {
        const variables = { operation: createCategory.operation }
        const data = proxy.readQuery({
          query: CategoriesQuery,
          variables
        })

        data.categories = [...data.categories, createCategory]

        proxy.writeQuery({
          query: CategoriesQuery,
          variables,
          data
        })
      } catch (e) {
        console.log('Query "categories" ainda não foi criada!', e)
      }
    }
  })
  return response.data.createCategory
}

export default {
  categories,
  createCategory
}
