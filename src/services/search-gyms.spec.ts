import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { describe, test, beforeEach, expect } from 'vitest'
import { SearchGymByName } from './search-gym'

let sut: SearchGymByName
let gymRepository: InMemoryGymRepository

beforeEach(() => {
  gymRepository = new InMemoryGymRepository()
  sut = new SearchGymByName(gymRepository)
})

describe('search gym', () => {
  test('should be able to find gyms by name', async () => {
    const query = 'academia'

    gymRepository.create({
      cnpj: '123456789',
      latitude: 0,
      longitude: 0,
      title: 'Academia 01',
    })

    gymRepository.create({
      cnpj: '123456780',
      latitude: 0,
      longitude: 0,
      title: 'Academia 02',
    })

    gymRepository.create({
      cnpj: '123456781',
      latitude: 0,
      longitude: 0,
      title: 'Academia 03',
    })

    const { gyms } = await sut.execute({ query, page: 1 })

    expect(gyms).toHaveLength(3)
  })

  test('pagination should be working', async () => {
    for (let index = 1; index <= 22; index++) {
      gymRepository.create({
        cnpj: `${index}`,
        latitude: 0,
        longitude: 0,
        title: `Academia ${index}`,
      })
    }

    const query = 'academia'

    const { gyms } = await sut.execute({ query, page: 2 })
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Academia 21' }),
      expect.objectContaining({ title: 'Academia 22' }),
    ])
  })
})
