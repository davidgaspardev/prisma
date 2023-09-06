import { computeSchemaHeader } from '../../../../_utils/computeSchemaHeader'
import { idForProvider } from '../../../../_utils/idForProvider'
import testMatrix from '../_matrix'

export default testMatrix.setupSchema(({ provider, providerFlavor }): string => {
  const schemaHeader = computeSchemaHeader({
    provider,
    providerFlavor,
  })

  return /* Prisma */ `
${schemaHeader}
    
model User {
  id             ${idForProvider(provider)}
  name           String @unique
  posts          Post[]
}

model Post {
  id              ${idForProvider(provider)}
  title           String @unique
  author          User?     @relation(fields: [authorId], references: [id])
  authorId        String
}


model Compound {
  id1 Int
  id2 String

  field1 Int
  field2 String

  val Int

  @@unique([field1, field2], name: "uniques")
  @@id([id1, id2])
}
`
})
