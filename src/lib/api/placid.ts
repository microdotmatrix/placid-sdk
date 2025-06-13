export async function fetchJwtToken() {
  const response = await fetch(
    `https://api.placid.app/api/editor/accesstokens`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PLACID_PRIVATE_TOKEN}`,
      },
      body: JSON.stringify({
        exp: 1778783015,
        scopes: ["templates:write"],
      }),
    }
  );

  const data = (await response.json()) as {
    access_token: string;
    expires_at: string;
  };

  return data;
}

export async function fetchTemplates() {
  const response = await fetch(`https://api.placid.app/api/rest/templates`, {
    headers: {
      Authorization: `Bearer ${process.env.PLACID_PRIVATE_TOKEN}`,
    },
  });

  const data = (await response.json()) as {
    data: {
      uuid: string;
      title: string;
      thumbnail: string;
    }[];
  };

  return data;
}

export async function fetchTemplate(uuid: string) {
  const response = await fetch(
    `https://api.placid.app/api/rest/templates/${uuid}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PLACID_PRIVATE_TOKEN}`,
      },
    }
  );

  const data = (await response.json()) as {
    template: {
      uuid: string;
      title: string;
      thumbnail: string;
    };
  };

  return data;
}

export interface PlacidRequest {
  portrait: string;
  name: string;
  epitaph: string;
  birth: string;
  death: string;
}

export interface PlacidImage {
  id: number;
  status: "queued" | "finished" | "error";
  image_url: string;
  polling_url: string;
}

export async function generateImage({
  variables,
  templateId,
}: {
  variables: PlacidRequest;
  templateId: string;
}) {
  const response = await fetch("https://api.placid.app/api/rest/images", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PLACID_PRIVATE_TOKEN}`,
    },
    body: JSON.stringify({
      template_uuid: templateId,
      layers: {
        portrait: {
          image: variables.portrait,
        },
        name: {
          text: variables.name,
        },
        epitaph: {
          text: variables.epitaph,
        },
        birth: {
          text: variables.birth,
        },
        death: {
          text: variables.death,
        },
      },
    }),
  });

  return (await response.json()) as PlacidImage;
}

export async function fetchImage(id: number) {
  const response = await fetch(`https://api.placid.app/api/rest/images/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.PLACID_PRIVATE_TOKEN}`,
    },
  });

  const data = (await response.json()) as PlacidImage;

  return data;
}
