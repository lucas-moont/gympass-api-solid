import { FetchNearbyGymsService } from './fetch-nearby-gyms'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { test, describe, expect, beforeEach } from 'vitest'

let sut: FetchNearbyGymsService
let gymRepository: InMemoryGymRepository

beforeEach(() => {
  gymRepository = new InMemoryGymRepository()
  sut = new FetchNearbyGymsService(gymRepository)
})

describe('fetch nearby gyms', () => {
  test('fetch nearby gyms', async () => {
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

    const { gyms } = await sut.execute({
      userLatitude: 0,
      userLongitude: 0,
      page: 1,
    })

    console.log(gyms)

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

    const { gyms } = await sut.execute({
      userLatitude: 0,
      userLongitude: 0,
      page: 2,
    })

    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Academia 21' }),
      expect.objectContaining({ title: 'Academia 22' }),
    ])
  })

  //TODO: TESTE PARA NÃO PEGAR ACADEMIAS PRÓXIMAS
})
