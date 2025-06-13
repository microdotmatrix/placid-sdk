// types/placid.d.ts
interface EditorSDK {
  canvas: {
    create: (
      container: string | RefAttributes,
      config: { access_token: string; template_uuid: string }
    ) => null;
  };
}

interface Window {
  EditorSDK?: EditorSDK;
}
