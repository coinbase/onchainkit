export default function InstallationOptions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <a
        className="border-2 border-gray-200 rounded-md p-2"
        href="/installation/nextjs"
      >
        Next.js
      </a>
      <a
        className="border-2 border-gray-200 rounded-md p-2"
        href="/installation/vite"
      >
        Vite
      </a>
      <a
        className="border-2 border-gray-200 rounded-md p-2"
        href="/installation/svelte"
      >
        Svelte
      </a>
      <a
        className="border-2 border-gray-200 rounded-md p-2"
        href="/installation/astro"
      >
        Astro
      </a>
    </div>
  );
}
