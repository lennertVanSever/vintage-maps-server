import fetch from "node-fetch";
import sha1 from 'js-sha1';
import { v4 as uuid } from 'uuid';

const {
  BACKBLAZE_USERNAME_PASSWORD,
  BACKBLAZE_BUCKET_ID: bucketId,
  SEJDA_API_KEY
} = process.env;

const getAuthorization = async () => {
  const responseRaw = await fetch("https://api.backblazeb2.com/b2api/v2/b2_authorize_account", {
    headers: {
      "Authorization": `Basic ${BACKBLAZE_USERNAME_PASSWORD}`
    },
  });
  return responseRaw.json();
}

const getPdfCode = async (sejdaParameters) => {
  const responseRaw = await fetch(`https://api.sejda.com/v2/html-pdf`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token: ${SEJDA_API_KEY}`
    },
    body: JSON.stringify({
      ...sejdaParameters
    })
  });
  if (responseRaw.status === 200) {
    const response = await responseRaw.arrayBuffer();
    return response;
  }
  const response = await responseRaw.text()
  throw new Error(response);
}

const getUploadUrl = async () => {
  const { authorizationToken: Authorization, apiUrl } = await getAuthorization();
  const responseRaw = await fetch(`${apiUrl}/b2api/v2/b2_get_upload_url`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization
    },
    body: JSON.stringify({ bucketId })
  });
  const response = await responseRaw.json();
  return response;

}

const uploadFile = async ({ content }) => {
  const { authorizationToken: Authorization, uploadUrl } = await getUploadUrl();

  const responseRaw = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization,
      'X-Bz-File-Name': `map-${uuid()}.pdf`,
      'X-Bz-Content-Sha1': sha1(content),
      'Content-Type': 'application/pdf',
    },
    body: content,
  });
  const response = await responseRaw.json();
  if (responseRaw.status === 200) {
    if (response.fileName) {
      return `https://f000.backblazeb2.com/file/map-prints/${response.fileName}`;
    }
  }
  throw new Error(JSON.stringify(response));
}

export default (app) => {
  app.post('/upload_map', async (req, res, next) => {
    try {
      const {
        body: {
          sejdaParameters
        }
      } = req;
      const content = await getPdfCode(sejdaParameters);
      const fileLink = await uploadFile({ content });
      res.send({
        fileLink
      })
    } catch(error) {
      next(error);
    }
  })
}