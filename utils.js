export const throwErrorIfNotStatus200 = async ({
  responseRaw,
  successCallback = async (responseRaw) => {
    const response = await responseRaw.json();
    return response;
  }
}) => {
  if (responseRaw.status === 200) {
    return successCallback(responseRaw);
  }
  const response = await responseRaw.text()
  throw new Error(response);
}