export const getBody = (data: { body: string; placeholders }) => {
  const inputs = data.placeholders;
  const body = data.body;

  const fristName = inputs.firstName.charAt(0).toUpperCase() + inputs.firstName.substr(1);
  const newBody = body
    .replace('{FIRST_NAME}', `${fristName}`)
    .replace('{SCHOOL_NAME}', `${inputs.schoolName}`);

  console.log(newBody);

  return newBody;
};
