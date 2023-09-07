import { faker } from '@faker-js/faker'
// @ts-ignore
import type { PrismaClient } from '@prisma/client'

import { ProviderFlavors } from '../../_utils/providerFlavors'
import testMatrix from './_matrix'

declare let prisma: PrismaClient

// https://github.com/prisma/prisma/issues/12862
testMatrix.setupTestSuite(
  ({ providerFlavor }, _suiteMeta, clientMeta) => {
    const postgresqlError = 'violates check constraint \\"post_viewcount_check\\"'
    // Full error
    // new row for relation \"Post\" violates check constraint \"post_viewcount_check\""
    const pgAdapterError = 'violates check constraint "post_viewcount_check"'
    const providerError =
      !clientMeta.dataProxy && ProviderFlavors.PG === providerFlavor ? pgAdapterError : postgresqlError

    test('should propagate the correct error when a method fails', async () => {
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.firstName(),
        },
      })

      await expect(
        prisma.post.create({
          data: {
            authorId: user.id,
            title: faker.lorem.sentence(),
            viewCount: -1, // should fail, must be >= 0
          },
        }),
      ).rejects.toThrow(providerError)
    })

    test('should propagate the correct error when a method fails inside an transaction', async () => {
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.firstName(),
        },
      })

      await expect(
        prisma.$transaction([
          prisma.post.create({
            data: {
              authorId: user.id,
              title: faker.lorem.sentence(),
              viewCount: -1, // should fail, must be >= 0
            },
          }),
        ]),
      ).rejects.toThrow(providerError)
    })

    test('should propagate the correct error when a method fails inside an interactive transaction', async () => {
      await expect(
        prisma.$transaction(async (client) => {
          const user = await client.user.create({
            data: {
              email: faker.internet.email(),
              name: faker.person.firstName(),
            },
          })

          const post = await client.post.create({
            data: {
              authorId: user.id,
              title: faker.lorem.sentence(),
              viewCount: -1, // should fail, must be >= 0
            },
          })

          return post
        }),
      ).rejects.toThrow(providerError)
    })
  },
  {
    optOut: {
      from: ['cockroachdb', 'mongodb', 'mysql', 'sqlite', 'sqlserver'],
      reason: 'Issue relates to postgresql only',
    },
    alterStatementCallback: () => `
      ALTER TABLE "Post" 
      ADD CONSTRAINT Post_viewCount_check CHECK ("viewCount" >= 0);
    `,
  },
)
