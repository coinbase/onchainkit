import { AppContext } from '@/components/AppProvider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useContext } from 'react';

export function ProjectId() {
  const { projectId, setProjectId } = useContext(AppContext);

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="project-id">Project ID</Label>
      </div>
      <Input
        id="project-id"
        placeholder="Enter CDP project ID"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
      />
    </div>
  );
}
