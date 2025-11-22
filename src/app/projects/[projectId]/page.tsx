import { EditProjectForm } from '@/app/projects/[projectId]/components/EditProjectForm/EditProjectForm'
import { notFound } from 'next/navigation'
import { getProjectById } from './actions/get-project-by-id'

export default async function Page({
  params,
}: {
  params: { projectId: string }
}) {
  const project = await getProjectById(params.projectId)

  if (!project) {
    return notFound()
  }

  return <EditProjectForm project={project} />
}
