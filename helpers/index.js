import { API } from "api";

const photoUrls = () => {
  const urls = {
    45: 'lll',
  };

  return async (id) => {
    if (urls[id]) return urls[id];

    try {
      const url = await API.getPhotoUrl(id);
      urls[id] = url;
      return url;
    } catch {
      console.log("Произошла ошибка. Фото не найдено." );
      return '';
    }
  };
};

const getPhotoUrl = photoUrls();

export { getPhotoUrl };
