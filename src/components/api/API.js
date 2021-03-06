import { API_URL, API_KEY } from "./APIConfig";

// -----------------------------------------------------------------------
// apiURL: e.g. "https://my.api.mockaroo.com"
// key: e.g. "?key=bb6adbc0" (Only seen this used for the mockaroo site.)
// endpoint: e.g. "Modules" or "/User/123"
// method: defaults to "GET" if not specified. (Use this later when trying to add or, modify or delete records.)
// body: defaults to null if not specified. (Use this later when you want to update records.)
// -----------------------------------------------------------------------

export const apiRequest = async (endpoint, method="GET", body=null) => {
  // Build request object
  let requestObj = { method: method }; // *GET, POST, PUT, DELETE, etc.
  if (body) requestObj = {
    ...requestObj,
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(body)
  };
  // Call API and return response object
  try {
    const endpointAddress = API_URL + endpoint + API_KEY;
    const response = await fetch(endpointAddress, requestObj);
    if ((response.status >= 200) && (response.status <= 299))
      return { success: true, response: await response.json() };
    else return { success: false, response: response };
  }
  catch (error) {
    return { success: false, response: error };
  }
}