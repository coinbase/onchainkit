import { frameResultToFrameMetadata } from './frameResultToFrameMetadata';
import { vNextSchema } from './validation';

export function parseHtml(html: string) {
  const document = new DOMParser().parseFromString(html, 'text/html');

  const ogImage = document.querySelectorAll(`[property='og:image']`);

  // According to spec, keys on the metatags should be on "property", but there are examples
  // in the wild where they're on "name". Process name tags first so that property tags take
  // precedence.
  const frameMetaTagsProperty = document.querySelectorAll(`[property^='fc:frame']`);
  const frameMetaTagsName = document.querySelectorAll(`[name^='fc:frame']`);

  const nameTags = [...frameMetaTagsName];
  const propertyTags = [...ogImage, ...frameMetaTagsProperty];
  const tags: Record<string, string> = {};

  function processTag(tag: Element, keyName: 'property' | 'name') {
    const key = tag.getAttribute(keyName);
    const value = tag.getAttribute('content');
    if (key && value) {
      tags[key] = value;
    }
  }
  nameTags.forEach((t) => processTag(t, 'name'));
  propertyTags.forEach((t) => processTag(t, 'property'));

  const isValid = vNextSchema.isValidSync(tags);
  const errors = aggregateValidationErrors(tags);
  const metadata = frameResultToFrameMetadata(tags);

  return { isValid, errors, tags, metadata };
}

function aggregateValidationErrors(tags: Record<string, string>) {
  try {
    vNextSchema.validateSync(tags, { abortEarly: false });
  } catch (e) {
    const errors: Record<string, string> = {};
    (e as any).inner.forEach((error: any) => {
      errors[error.path as string] = error.message;
    });
    return errors;
  }
  return {};
}
