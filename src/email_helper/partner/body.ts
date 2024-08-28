export const getBody = (data: { body: string; placeholders }) => {
  const inputs = data.placeholders;
  const body = data.body;

  const newBody = body
    .replace('{USERNAME}', `${inputs.firstName + '' + inputs.lastName}`)
    .replace('{URL}', inputs.url);

  console.log(newBody);

  return newBody;
};
