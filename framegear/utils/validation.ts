import * as yup from 'yup';

export const vNextSchema = yup.object({
  'fc:frame': yup.string().required().matches(/vNext/, '"fc:frame" must be "vNext"'),
  'fc:frame:image': yup.string().required(),
  'og:image': yup.string().required(),
  'fc:frame:button:1': yup.string().optional(),
  // TODO: yup doesn't infer type well from this concise definition
  ...[2, 3, 4].reduce(
    (acc, index) => ({
      ...acc,
      [`fc:frame:button:${index}`]: yup
        .string()
        .optional()
        .test(
          `has-button-${index - 1}`,
          `Button index values must be in sequence, starting at 1. Failed on index: ${2}`,
          (value, ctx) => {
            if (value) {
              // we only care whether or not `prevButton` is undefined
              const prevButton = ctx.parent[`fc:frame:button:${index - 1}`];
              return !!prevButton;
            }
            return true;
          },
        ),
    }),
    {},
  ),
  // TODO: yup doesn't infer type well from this concise definition
  ...[1, 2, 3, 4].reduce(
    (acc, index) => ({
      ...acc,
      [`fc:frame:button:${index}:action`]: yup
        .string()
        .optional()
        .matches(
          /^post$|^post_redirect$|^mint$|^link$/,
          `button action must be "post" or "post_redirect". Failed on index: ${index}`,
        ),
    }),
    {},
  ),
  // TODO: yup doesn't infer type well from this concise definition
  ...[1, 2, 3, 4].reduce(
    (acc, index) => ({
      ...acc,
      [`fc:frame:button:${index}:target`]: yup
        .string()
        .optional()
        .test('target-has-valid-size', 'button target has maximum size of 256 bytes', (value) => {
          // test only fires when `value` is defined
          return new Blob([value!]).size <= 256;
        }),
    }),
    {},
  ),
  'fc:frame:post_url': yup
    .string()
    .optional()
    .test('url-has-valid-size', 'post_url has maximum size of 256 bytes', (value) => {
      // test only fires when `value` is defined
      return new Blob([value!]).size <= 256;
    }),
  'fc:frame:input:text': yup
    .string()
    .optional()
    .test('input-has-valid-size', 'input:text has maximum size of 32 bytes', (value) => {
      // test only fires when `value` is defined
      return new Blob([value!]).size <= 32;
    }),
  'fc:frame:image:aspect_ratio': yup
    .string()
    .optional()
    .matches(/^1:1$|^1.91:1$/),
  'fc:frame:state': yup
    .string()
    .optional()
    .test('state-has-valid-size', 'frame:state has maximum size of 4096 bytes', (value) => {
      // test only fires when `value` is defined
      return new Blob([value!]).size <= 4096;
    }),
});

// This interface doesn't fully encapsulate the dynamically defined types. Do we even need it?
export interface FrameVNext extends yup.InferType<typeof vNextSchema> {}
