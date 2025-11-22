import { Header } from '@/app/components/layout/Header/Header'
import { getProjectById } from '@/app/projects/[projectId]/actions/get-project-by-id'

export default async function ProjectHeaderPage({
  params,
}: {
  params: { projectId: string }
}) {
  let title = ''

  try {
    const project = await getProjectById(params.projectId)
    if (project) {
      title = project.title || 'Untitled Project'
    }
  } catch (error) {
    console.error('Header fetch failed:', error)
  }

  return <Header title={title} />
}
