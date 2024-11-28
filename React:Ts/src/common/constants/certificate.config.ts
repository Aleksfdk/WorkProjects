import { Dispatch, Key, RefObject, SetStateAction } from 'react';
import {
  DEFAULT_HASH,
  DEFAULT_TEXT,
  IAddedText,
  IListImage,
  NEW_IMAGE,
  NEW_QR,
  QR_CODE_ID
} from '../../pages/instructor/CertificateForm/CertificateForm.consts';
import { IHashType } from 'types/entities/tempCertificates';
import { IFunction, IObject } from '../components/Chat/interfaces';

export interface ListUsersType {
  key: Key;
  accountId: string;
  fullName: string;
  email: string;
}

const HASH_VIEW = {
  link: '{VERIFY_LINK}',
  code: '{CODE}',
  surname: '{SURNAME}',
  firstname: '{FIRSTNAME}',
  patronymic: '{PATRONYMIC}',
  trainingLabel: '{TRAINING_LABEL}',
  qrCode: '{QRCODE_IMAGE}',
  year: '{YEAR}'
};

export const exportModalProps = (title: string) => {
  return {
    title: title,
    footer: false,
    width: '956px',
    centered: true
  };
};

export const CBgColorChange = (setBackgroundColor: Dispatch<SetStateAction<string>>, color: string) => setBackgroundColor(color);

export const CHandleSelect = (id: string, e: any, setSelectedId: IFunction, stageRef: RefObject<any>, transformerRef: RefObject<any>) => {
  e.cancelBubble = true;
  setSelectedId(id);

  if (transformerRef.current && stageRef.current) {
    const node = stageRef.current.findOne(`#${id}`);
    transformerRef.current.nodes([node]);
    transformerRef.current.getLayer().batchDraw();
  }
};

export const CHandleDragEnd = (e: any, elements: IAddedText[], id: string, setElements: Dispatch<SetStateAction<IAddedText[]>>) => {
  const newTexts = elements.map((text) => {
    if (text.id === id) {
      return { ...text, x: e.target.x(), y: e.target.y() };
    }
    return text;
  });
  setElements(newTexts);
};

export const CAddText = (text: string, setElements: Dispatch<SetStateAction<IAddedText[]>>, setText: Dispatch<SetStateAction<string>>) => {
  const newText: IObject = {
    ...DEFAULT_TEXT,
    id: `${Date.now()}`,
    text
  };
  setElements((prevTexts: any) => [...prevTexts, newText]);
  setText('');
};
export const CHandleParameterChange = (
  elements: IAddedText[],
  type: string,
  selectedId: string | null,
  selectedImageId: string | null,
  parameter: IObject,
  setElements: Dispatch<SetStateAction<IAddedText[]>>
) => {
  const newTexts = elements.map((element) => {
    if (element.id === selectedId || element.id === selectedImageId) {
      if (type === 'object') {
        return {
          width: parameter.width,
          height: parameter.height,
          x: parameter.x,
          y: parameter.y,
          opacity: element.opacity,
          id: element.id,
          image: element.image,
          type: element.type
        };
      }
      return { ...element, [type]: parameter };
    }
    return element;
  });
  setElements(newTexts);
};

export const CHandleDeselect = (
  setSelectedId: Dispatch<SetStateAction<string | null>>,
  setSelectedImageId: Dispatch<SetStateAction<string | null>>,
  transformerRef: RefObject<any>
) => {
  setSelectedId(null);
  setSelectedImageId(null);
  if (transformerRef.current) {
    transformerRef.current.nodes([]);
    transformerRef.current.getLayer().batchDraw();
  }
};
export const CHashChange = (element: IObject, setElements: Dispatch<SetStateAction<IAddedText[]>>, selectedElement: any) => {
  const newHash: IObject = {
    ...DEFAULT_HASH,
    id: `${Date.now()}`,
    text: `#${element.label}`
  };

  if (element.value === QR_CODE_ID) {
    const newQr: IObject = {
      ...NEW_QR,
      id: `${Date.now()}`
    };
    return setElements((prev: any) => [...prev, newQr]);
  }

  if (!selectedElement) {
    return setElements((prev: any) => [...prev, newHash]);
  }

  return setElements((prev: any) => {
    return prev.reduce((acc: any, current: any) => {
      if (!acc.find((item: any) => item.id === current.id)) {
        if (selectedElement?.id === current.id) {
          current.text = `#${element.label}`;
        }
        acc.push(current);
      }
      return acc;
    }, []);
  });
};

export const CImageChange = (
  image: string,
  imageFile: File,
  saveListsImage: SetStateAction<IFunction>,
  selectedElement: any,
  setElements: Dispatch<SetStateAction<IAddedText[]>>,
  setSelectedImageId: Dispatch<SetStateAction<string | null>>
) => {
  const newImage: IObject = {
    ...NEW_IMAGE,
    id: `${Date.now()}`,
    image
  };

  const newImageFile: any = {
    ...NEW_IMAGE,
    id: `${Date.now()}`,
    image: imageFile
  };

  saveListsImage(newImageFile);
  setSelectedImageId(newImageFile.id);

  if (!selectedElement) {
    return setElements((prevTexts: any) => [...prevTexts, newImage]);
  }

  return setElements((prev: IAddedText[]) => {
    return prev.reduce((acc: IAddedText[], current: IAddedText) => {
      if (!acc.find((item: IAddedText) => item.id === current.id)) {
        if (selectedElement?.id === current.id) {
          current.image = image;
        }
        acc.push(current);
      }
      return acc;
    }, []);
  });
};
export const CMergeArrays = (array1: IAddedText[], array2: IListImage[]): IAddedText[] => {
  const arrImg: IAddedText[] = [];
  const arrText: IAddedText[] = [];

  for (const item of array1) {
    if (item.hasOwnProperty('image')) {
      arrImg.push(item);
    } else {
      arrText.push(item);
    }
  }

  arrImg.map((item1: any) => {
    const foundItem = array2.find((item2: IListImage) => item1.id === item2.id);
    if (foundItem) {
      item1.image = foundItem?.image;
    }
  });

  return [...arrText, ...arrImg];
};

export const CGenerateHTMLDocument = (
  elements: IAddedText[],
  loadedImages: any,
  isVertical: boolean,
  backgroundColor: string,
  backgroundImage: string
) => {
  const textElementsHTML = elements
    .filter(({ type }: any) => type === 'text')
    .map(
      (text: IObject) =>
        `<div style="position:absolute; left:${text.x}px; top:${text.y}px; font-size:${text.fontSize}px; color:${text.fill};">${text.text}</div>`
    )
    .join('');

  const imageElementsHTML = elements
    .filter(({ type }: any) => type === 'picture')
    .map((img: IObject) => {
      return `<img src="${img.image}" style="position:absolute; left:${img.x}px; top:${img.y}px; width:${img.width}px; height:${img.height}px; opacity:${img.opacity};"/>`;
    })
    .join('');

  const hashMappings: Record<string, string> = {
    '#ФИО': `${HASH_VIEW.surname} ${HASH_VIEW.firstname} ${HASH_VIEW.patronymic}`,
    '#Название курса': HASH_VIEW.trainingLabel,
    '#Год окончания курса': HASH_VIEW.year,
    '#QR-код': HASH_VIEW.qrCode,
    '#Код сертификата': HASH_VIEW.code
  };

  const hashElementsHTML = elements
    .filter(({ type }: { type: string }) => type === 'hash')
    .map((hash: IObject) => {
      let hashView: string | undefined;
      for (const key in hashMappings) {
        if (hash.text.includes(key)) {
          hashView = hashMappings[key];
          break;
        }
      }
      return `<div style="position:absolute; left:${hash.x}px; top:${hash.y}px; font-size:${hash.fontSize}px; color:${hash.fill}; font-family:${hash.fontFamily}; font-weight:${hash.fontWeight}; ">${hashView}</div>`;
    });

  const htmlDocument = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Шаблон сертификата</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box }
        html, body { width: 100%; height: 100%; font-family: Consolas; font-size: 13pt; }
      </style>
    </head>
    <body>
    <div style="position:relative; width:${
      isVertical ? '783px' : '1288px'
    }; height:1022px; background-color:${backgroundColor}; background-image: url('${backgroundImage}'); background-size: cover; background-repeat: no-repeat; background-position: center;">
      ${textElementsHTML}
      ${imageElementsHTML}
      ${hashElementsHTML}
    </div>
    </body>
    </html>
  `;

  return htmlDocument;
};

export const CHandleKeyDown = (
  e: any,
  setIsEditingText: Dispatch<SetStateAction<boolean>>,
  handleDeselect: IFunction,
  setSelectType: Dispatch<SetStateAction<string>>,
  isEditingText: boolean,
  selectType: string,
  selectedElement: any,
  setText: Dispatch<SetStateAction<string>>,
  handleParameterChange: IFunction,
  setElements: Dispatch<SetStateAction<IAddedText[]>>,
  selectedImageId: string | null,
  setLoadedImages: any,
  setTags: Dispatch<SetStateAction<IHashType[]>>
) => {
  if (e.key === 'Escape') {
    setIsEditingText(false);
    handleDeselect();
    setSelectType('');
  } else if (e.key === 'Delete') {
    setElements((prev: IAddedText[]) => prev.filter((item: IAddedText) => item.id !== selectedElement.id));
    handleDeselect();
    setSelectType('');
  } else if (isEditingText) {
    if (e.key === 'Enter') {
      setIsEditingText(false);
      handleDeselect();
      setSelectType('');
    } else if (e.key === 'Delete') {
      setElements((prev: IAddedText[]) => prev.filter((item: IAddedText) => item.id !== selectedElement.id));
      handleDeselect();
      setSelectType('');
    } else if (e.key === 'Backspace') {
      if (selectType === 'text' && selectedElement?.text) {
        const deleteChar = selectedElement?.text.slice(0, -1);
        setText(deleteChar);
        handleParameterChange(deleteChar, 'text');
      } else if (selectType === 'hash' && selectedElement) {
        setElements((prev: IAddedText[]) => prev.filter((item: IAddedText) => item.id !== selectedElement.id));
        handleDeselect();
        setSelectType('');
      }
      // Выражение проверяет на наличие: букв, знаков препинания, скобок, пробела
    } else if (/^[a-zA-Zа-яА-Я.,(){}[\] ]$/.test(e.key)) {
      if (e.code === 'Space') {
        e.preventDefault();
      }
      setText(selectedElement?.text + e.key);
      handleParameterChange(selectedElement?.text + e.key, 'text');
    }
  } else if (e.key === 'Delete' && selectedElement && (selectType === 'image' || selectType === 'hash')) {
    setElements((prev: IAddedText[]) => prev.filter((item: IAddedText) => item.id !== selectedElement.id));
    if (selectType === 'hash') {
      setTags((prev: any) =>
        prev.map((item: any) => {
          if (item.label === selectedElement.text.slice(1)) {
            return { ...item, disabled: false };
          }
          return item;
        })
      );
    }
    handleDeselect();
    setSelectType('');
  } else if (e.key === 'Backspace' && selectedElement && selectType === 'hash') {
    setElements((prev: IAddedText[]) => prev.filter((item: IAddedText) => item.id !== selectedElement.id));
    setTags((prev: any) =>
      prev.map((item: any) => {
        if (item.label === selectedElement.text.slice(1)) {
          return { ...item, disabled: false };
        }
        return item;
      })
    );
    handleDeselect();
    setSelectType('');
  } else if (e.key === 'Backspace' && selectType === 'image' && selectedElement && document.activeElement?.localName !== 'input') {
    setElements((prev: IAddedText[]) => prev.filter((item: IAddedText) => item.id !== selectedImageId));
    setLoadedImages([]);
    handleDeselect();
    setSelectType('');
  }
};
