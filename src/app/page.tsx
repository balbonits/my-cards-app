import Workspace from '@/components/Workspace';
import { sampleWorkspace } from '@/lib/sampleData';

const workspaces = [sampleWorkspace]; // for now we just have one workspace, but this could be an array of multiple workspaces in the future

export default function Home() {
  return <div className="flex min-h-screen flex-col bg-zinc-100">
    <header className="border-b border-zinc-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
        <h1 className="text-lg font-semibold text-zinc-900 sm:text-xl">My Cards App</h1>
    </header>
  {workspaces.length === 0 ? (
      <p>No workspaces available</p>
  ) : (
      workspaces.map((workspace) => (
          <Workspace key={workspace.id} workspace={workspace} />
      ))
  )}
  </div>;
}
