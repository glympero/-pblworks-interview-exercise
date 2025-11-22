import { notFound } from 'next/navigation'
import { getProjectById } from './actions/get-project-by-id'
import { EditProjectWrapper } from '@/app/projects/[projectId]/components/EditProjectWrapper/EditProjectWrapper'

export default async function Page({
  params,
}: {
  params: { projectId: string }
}) {
  const project = await getProjectById(params.projectId)

  if (!project) {
    return notFound()
  }

  return <EditProjectWrapper project={project} />
}
