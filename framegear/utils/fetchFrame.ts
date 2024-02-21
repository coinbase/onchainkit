import { parseHtml } from './parseHtml';

export async function fetchFrame(url: string) {
  const response = await fetch('/api/getFrame', {
    body: JSON.stringify({ url }),
    method: 'POST',
    headers: {
      contentType: 'application/json',
    },
  });

  const json = (await response.json()) as { html: string };
  const html = json.html;
  return parseHtml(html);
}
