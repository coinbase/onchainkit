import { Frame } from '@/components/Frame';
import { ValidationResults } from '@/components/ValidationResults';
import { APP_NAME } from '@/utils/constants';

export default function Home() {
  return (
    <div className="p-4">
      <h1>{APP_NAME}</h1>
      <div className="grid grid-cols-2 gap-4">
        <Frame />
        <ValidationResults />
      </div>
    </div>
  );
}
