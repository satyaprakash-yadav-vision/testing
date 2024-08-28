import { getBody } from './body';

const resetPin = (values, body) => {
  const html = getBody({ placeholders: values, body: body });
  return {
    html
  };
};

export { resetPin };
