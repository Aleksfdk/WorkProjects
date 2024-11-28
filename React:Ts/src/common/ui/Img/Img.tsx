import { FC, ImgHTMLAttributes, useEffect, useState } from 'react';
import Plug from '../../assets/images/no-image.png';

interface IImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  altSrc?: string;
}

export const Img: FC<IImageProps> = (props) => {
  const { altSrc = Plug, src = '', ...options } = props;
  const pictureURL = src.substring(0, 4) !== 'http' ? process.env?.REACT_APP_API + src : src;
  const [url, setUrl] = useState<string>(pictureURL);

  useEffect(() => {
    if (pictureURL.includes('/images/default')) {
      return setUrl(altSrc);
    }
    const img = new Image();
    img.src = pictureURL;
    img.onerror = () => setUrl(altSrc);
  }, [pictureURL, altSrc]);

  return <img {...options} src={url} />;
};
