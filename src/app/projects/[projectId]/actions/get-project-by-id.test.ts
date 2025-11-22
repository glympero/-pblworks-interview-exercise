import { getProjectById } from './get-project-by-id'
import { prisma } from '@/prisma/prisma'

jest.mock('@/prisma/prisma', () => ({
  prisma: {
    project: {
      findUnique: jest.fn(),
    },
  },
}))

describe('getProjectById', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return the project when given a valid numeric string ID', async () => {
    const mockProject = { id: 123, title: 'Test Project' }
    ;(prisma.project.findUnique as jest.Mock).mockResolvedValue(mockProject)

    const result = await getProjectById('123')

    expect(result).toEqual(mockProject)
    expect(prisma.project.findUnique).toHaveBeenCalledWith({
      where: { id: 123 },
    })
  })

  it('should throw "Invalid project id" when given a non-numeric string', async () => {
    await expect(getProjectById('abc')).rejects.toThrow('Invalid project id')
    expect(prisma.project.findUnique).not.toHaveBeenCalled()
  })

  it('should throw "Invalid project id" when given a negative number', async () => {
    await expect(getProjectById('-5')).rejects.toThrow('Invalid project id')
  })

  it('should return null if no project is found in database', async () => {
    ;(prisma.project.findUnique as jest.Mock).mockResolvedValue(null)

    const result = await getProjectById('999')

    expect(result).toBeNull()
  })
})
