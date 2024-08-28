import { getBody } from './body';

const partnerActivation = (values, body) => {
  const html = getBody({ placeholders: values, body: body });
  return {
    html
  };
};

export { partnerActivation };
