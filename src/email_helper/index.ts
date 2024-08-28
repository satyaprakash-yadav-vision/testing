import { partnerActivation } from './partner';
import { resetPin } from './resetPin';

export const getHtml = (data: { activity; values; body }) => {
  switch (data.activity) {
    case 'partnerActivation':
      return partnerActivation(data.values, data.body);
    case 'resetPin':
      return resetPin(data.values, data.body);
    default:
      break;
  }
};
