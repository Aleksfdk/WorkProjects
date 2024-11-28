import React, { Fragment, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Col, Row, Tooltip } from 'antd';
import cn from 'classnames';
import { AccessContainer, Layout } from 'containers';
import { Button, customNotification, CustomSwitch, Icon, NOTIFICATION_TYPES } from 'common/ui';
import { BackButton, PageSpinner } from 'common/components';
import { IFunction } from 'common/components/Chat/interfaces';
import { useAppSelector, useRedirect } from 'common/hooks';
import { MESSAGE } from 'common/constants';
import {
  CAddText,
  CBgColorChange,
  CGenerateHTMLDocument,
  CHandleDeselect,
  CHandleDragEnd,
  CHandleKeyDown,
  CHandleParameterChange,
  CHandleSelect,
  CHashChange,
  CImageChange,
  CMergeArrays
} from 'common/constants/certificate.config';
import { profileSelectors } from 'api/student/profile/profile.selectors';
import {
  useAddTempCertificateImageMutation,
  useDeleteTempCertificateImageMutation,
  useEditTempCertificateMutation,
  useGetTempCertificateIdQuery,
  useLazyGetCheckNameCertificateQuery,
  usePostPreviewTempCertificatesMutation
} from 'api/tempCertificates/tempCertificates.api';
import { IIconType } from 'types/common';
import { ICertificatesEditTempParams, IHashType } from 'types/entities/tempCertificates';
import {
  CONTENT_TYPE,
  IAddedText,
  IImagesFile,
  IListImage,
  TAGS,
  templateDataHorizontal,
  templateDataVertical
} from '../instructor/CertificateForm/CertificateForm.consts';
import { getBackgroundImage, sideBarButtons } from '../instructor/CertificateForm/CertificateForm.helper';
import { TypeGrid, TypeHash, TypePicture, TypeSettings, TypeText } from '../instructor/CertificateForm/components';
import MenuClickHandler from '../instructor/CertificateForm/components/MenuClickHandler';
import { URLImage } from '../instructor/CertificateForm/components/URLImage';
import BgImageHorizontal from 'common/assets/images/certificate-bg-horizontal.svg';
import BgImageVertical from 'common/assets/images/certificate-bg-vertical.svg';
import styles from '../instructor/CertificateForm/style.module.scss';

import { Group, Image as KonvaImage, Layer, Line, Stage, Text, Transformer } from 'react-konva';

export const CertificateDetailed = () => {
  const [content, setContent] = useState<CONTENT_TYPE>(CONTENT_TYPE.SETTINGS);
  const [orientation, setOrientation] = useState('vertical');
  const isVertical = orientation === 'vertical';
  const [isTemplate, setIsTemplate] = useState(false);
  const [elements, setElements] = useState<IAddedText[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [gridEnable, setGridEnable] = useState(false);
  const [gridColor, setGridColor] = useState('#000000');
  const [gridOpacity, setGridOpacity] = useState(0.6);
  const [loadedImages, setLoadedImages] = useState<any>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [backgroundPath, setBackgroundPath] = useState<string>('');
  const [certificateName, setCertificateName] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [ready, setReady] = useState<boolean>(false);
  const [backgroundColor, setBackgroundColor] = useState<string>('');
  const [isImageDelete, setIsImageDelete] = useState<IListImage>();
  const [isImageCopy, setIsImageCopy] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorEmptyFieldText, setErrorEmptyFieldText] = useState<string>('');
  const [errorEmptyField, setErrorEmptyField] = useState<boolean>(false);
  const [defaultTextPanel, setDefaultTextPanel] = useState<boolean>(false);
  const [deleteImgURL, setDeleteImgURL] = useState<string[]>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isEditingText, setIsEditingText] = useState<boolean>(false);
  const [selectType, setSelectType] = useState<string>('');
  const [tags, setTags] = useState<IHashType[]>(TAGS);
  const templateElements = isVertical ? templateDataVertical.elements : templateDataHorizontal.elements;

  const transformerRef = useRef<any>(null);
  const stageRef = useRef<any>(null);
  const contentRef = useRef<any>(null);

  const buttons = sideBarButtons(setContent);
  const selectedElement = elements.find((text) => text.id === selectedId || text.id === selectedImageId);

  const { handleMenuClick } = MenuClickHandler({ elements, selectedElement, setElements, setIsImageDelete, setIsImageCopy });
  const backgroundImage = getBackgroundImage(backgroundPath, isTemplate, isVertical);
  const [imageFiles, setImageFiles] = useState<IImagesFile>({ backgroundImageUrl: undefined, data: [] });
  const [saveImage] = useAddTempCertificateImageMutation();

  const redirectTo = useRedirect();
  const { permissions, role } = useAppSelector(profileSelectors.role);
  const location = useLocation();
  const id = location.state?.id;

  const { data: tempCert, isLoading } = useGetTempCertificateIdQuery({ id });
  const [triggerCheckName] = useLazyGetCheckNameCertificateQuery();
  const [editForm] = useEditTempCertificateMutation();
  const [deleteImageForm] = useDeleteTempCertificateImageMutation();
  const [previewTemp] = usePostPreviewTempCertificatesMutation();
  const profile = useAppSelector(profileSelectors.profile);

  useEffect(() => {
    if (profile.accountId === tempCert?.userId) {
      setIsEdit(true);
    }
    if (tempCert) {
      setTitle(tempCert?.title);
      setReady(tempCert?.isReady);
      setBackgroundColor(tempCert?.backgroundColor);
      const toDataParse = JSON.parse(tempCert?.data);
      setElements(toDataParse.elements);

      setOrientation(tempCert?.orientation === 0 ? 'vertical' : 'horizontal');
      setCertificateName(tempCert?.title);
      setBackgroundPath(tempCert?.backgroundImageUrl);

      const currentTags = toDataParse.elements.filter((item: IAddedText) => item.type === 'hash');
      const currentTagValues = currentTags.map((tag: IAddedText) => tag.text?.slice(1));
      const updatedElements = tags.map((item: IHashType) => {
        if (currentTagValues.includes(item.label)) {
          return { ...item, disabled: true };
        } else {
          return { ...item, disabled: false };
        }
      });

      setTags(updatedElements);
    }
  }, [tempCert]);

  useEffect(() => {
    if (isTemplate) {
      setElements((prev) => {
        const combinedElements = [...templateElements, ...prev];

        return combinedElements.reduce((acc, current) => {
          if (!acc.find((item: any) => item.id === current.id)) {
            acc.push(current);
          }
          return acc;
        }, []);
      });
      setOrientation(isVertical ? templateDataVertical.orientation : templateDataHorizontal.orientation);
      setCertificateName(templateDataVertical.certificateName);
      setBackgroundPath(isVertical ? BgImageVertical : BgImageHorizontal);
    }
  }, [isTemplate, isVertical]);

  useEffect(() => {
    const loadImages = async () => {
      const loaded = await Promise.all(
        elements
          .filter(({ type }) => type === 'picture')
          .map(async ({ id, image, x, y, width, height, opacity }) => {
            const img: any = new window.Image();
            img.src = image;
            await new Promise((resolve) => {
              img.onload = resolve;
            });
            return { id, image: img, x, y, width, height, opacity };
          })
      );
      setLoadedImages(loaded);
    };
    loadImages();
  }, [elements]);

  useEffect(() => {
    if (selectedElement) {
      setContent(selectedElement?.type);
    }
  }, [selectedElement, selectedId]);

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      CHandleKeyDown(
        e,
        setIsEditingText,
        handleDeselect,
        setSelectType,
        isEditingText,
        selectType,
        selectedElement,
        setText,
        handleParameterChange,
        setElements,
        selectedImageId,
        setLoadedImages,
        setTags
      );
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditingText, selectedElement, selectedImageId]);

  const onBgColorChange = useCallback((color: string) => CBgColorChange(setBackgroundColor, color), []);

  const handleSelect = useCallback(
    (id: string, e: any) => {
      setSelectType(e.currentTarget.attrs.type);
      if (e.currentTarget.attrs.type === 'text') {
        setIsEditingText(true);
      } else {
        setIsEditingText(false);
      }
      CHandleSelect(id, e, setSelectedId, stageRef, transformerRef);
    },
    [transformerRef, stageRef, elements]
  );

  const handleDragEnd = useCallback(
    (id: string, e: any) => {
      CHandleDragEnd(e, elements, id, setElements);
    },
    [elements]
  );

  const addText = useCallback(() => {
    CAddText(text, setElements, setText);
  }, [text]);

  const handleParameterChange = useCallback(
    (parameter: any, type: string) => {
      CHandleParameterChange(elements, type, selectedId, selectedImageId, parameter, setElements);
    },
    [elements, selectedId, selectedImageId]
  );

  const handleDeselect = useCallback(() => {
    CHandleDeselect(setSelectedId, setSelectedImageId, transformerRef);
  }, [transformerRef]);

  const onHashChange = useCallback(
    (element: IHashType) => {
      const updatedTags = tags.map((tag: IHashType) => (tag.value === element?.value ? { ...tag, disabled: true } : tag));
      setTags(updatedTags);
      CHashChange(element, setElements, selectedElement);
    },
    [selectedElement]
  );

  const onImageChange = useCallback(
    (image: string, imageFile: File) => {
      CImageChange(image, imageFile, saveListsImage, selectedElement, setElements, setSelectedImageId);
    },
    [selectedElement]
  );

  const saveBackgroundImage = (file: File) => {
    setImageFiles((prevState) => ({
      ...prevState,
      backgroundImageUrl: file
    }));
  };

  const removeBackgroundImage = () => {
    if (backgroundImage.indexOf('http') > -1 && tempCert?.backgroundImageUrl) {
      setDeleteImgURL((prevState) => {
        return [...(prevState || []), tempCert?.backgroundImageUrl];
      });
    }

    setImageFiles((prevState) => ({
      ...prevState,
      backgroundImageUrl: undefined
    }));
  };
  const saveListsImage = (newData: IListImage) => {
    setImageFiles((prevState) => ({
      ...prevState,
      data: [...(prevState.data || []), newData]
    }));
  };

  useEffect(() => {
    if (imageFiles.data) {
      const newData = imageFiles.data.filter((item) => item.id !== isImageDelete?.id);
      if (isImageDelete && typeof isImageDelete.image == 'string') {
        const image = isImageDelete.image as 'string';
        const idImg = image.split('/').pop() as 'string';
        setDeleteImgURL((prevState) => {
          return [...(prevState || []), idImg];
        });
      }

      setImageFiles((prevState) => ({
        ...prevState,
        data: newData
      }));
    }
  }, [isImageDelete]);

  useEffect(() => {
    if (isImageCopy && imageFiles.data) {
      const copyItem = imageFiles.data.filter((item) => item.id == isImageCopy);
      const newData = { ...copyItem[0], x: 50, y: 50, id: `${Date.now()}` };
      setImageFiles((prevState) => ({
        ...prevState,
        data: [...(prevState.data || []), newData]
      }));
    }
  }, [isImageCopy]);

  const onNewClick = useCallback(() => {
    setBackgroundPath('');
    setBackgroundColor('#FFFFFF');
    setGridColor('#FFFFFF');
    setGridEnable(false);
    setGridOpacity(100);
    setOrientation('vertical');
    setIsTemplate(false);
    setElements([]);
  }, []);

  const settingsProps = useMemo(
    () => ({
      isVertical,
      setOrientation,
      isTemplate: true,
      setIsTemplate,
      onBgColorChange,
      setBackgroundPath,
      backgroundPath,
      certificateName,
      setCertificateName,
      onNewClick,
      saveBackgroundImage,
      removeBackgroundImage,
      isDisabledBtn: true,
      isEdit,
      errorEmptyField,
      errorEmptyFieldText,
      setErrorEmptyField
    }),
    [
      onNewClick,
      setIsTemplate,
      setOrientation,
      isVertical,
      onBgColorChange,
      setBackgroundPath,
      backgroundPath,
      certificateName,
      setCertificateName,
      saveBackgroundImage,
      removeBackgroundImage,
      isEdit,
      errorEmptyField,
      errorEmptyFieldText,
      setErrorEmptyField
    ]
  );

  const textProps = useMemo(
    () => ({
      addText,
      setText,
      handleParameterChange,
      text,
      isVertical,
      selectedElement,
      handleMenuClick,
      setIsEditingText,
      isEditingText
    }),
    [addText, setText, handleParameterChange, text, isVertical, selectedElement, handleMenuClick, setIsEditingText, isEditingText]
  );

  const gridProps = useMemo(
    () => ({
      gridEnable,
      setGridEnable,
      setGridColor,
      gridColor,
      setGridOpacity,
      gridOpacity
    }),
    [gridEnable, setGridEnable, setGridColor, gridColor, setGridOpacity, gridOpacity]
  );

  const hashProps = useMemo(
    () => ({
      handleParameterChange,
      isVertical,
      onHashChange,
      handleMenuClick,
      selectedElement,
      tags
    }),
    [handleParameterChange, isVertical, onHashChange, handleMenuClick, selectedElement, tags]
  );

  const pictureProps = useMemo(
    () => ({
      selectedElement,
      onImageChange,
      handleParameterChange,
      handleMenuClick,
      disabled: isEdit
    }),
    [selectedElement, onImageChange, handleParameterChange, handleMenuClick, isEdit]
  );

  const contentType = useMemo(() => {
    const MAP: any = {
      [CONTENT_TYPE.SETTINGS]: <TypeSettings {...settingsProps} />,
      [CONTENT_TYPE.TEXT]: <TypeText {...textProps} />,
      [CONTENT_TYPE.PICTURE]: <TypePicture {...pictureProps} />,
      [CONTENT_TYPE.HASH]: <TypeHash {...hashProps} />,
      [CONTENT_TYPE.GRID]: <TypeGrid {...gridProps} />
    };
    return MAP[content];
  }, [content, settingsProps, textProps, gridProps, hashProps, pictureProps]);

  const onFinish = useCallback(async () => {
    if (!certificateName) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      setErrorEmptyFieldText('Поле не может быть пустым');
      setErrorEmptyField(true);
    } else {
      setLoading(true);
      const validName = await triggerCheckName({ title: certificateName });
      if (validName?.data?.isValid) {
        const mergedArray = CMergeArrays(elements, imageFiles?.data);

        const uploadImages = mergedArray.map(async (item: any) => {
          if (item.image instanceof File) {
            const formData = new FormData();
            formData.append('file', item.image);

            const res: any = await saveImage({ file: formData });

            item.image = `${process.env?.REACT_APP_API}${res?.data}`;
          }
          return item;
        });

        await Promise.all(uploadImages)
          .then(() => {
            if (deleteImgURL && deleteImgURL.length > 0) {
              deleteImgURL.map(async (item) => await deleteImageForm({ id: item }));
            }
          })
          .then(async () => {
            let imageBgLink = '';
            if (imageFiles.backgroundImageUrl) {
              const formData = new FormData();
              formData.append('file', imageFiles.backgroundImageUrl);

              const res: any = await saveImage({ file: formData });
              imageBgLink = `${process.env?.REACT_APP_API}${res?.data}`;
            } else {
              imageBgLink = backgroundPath;
            }

            const toDataJson = JSON.stringify({
              elements: mergedArray,
              gridSettings: {
                enabled: gridEnable,
                color: gridColor,
                opacity: gridOpacity
              }
            });

            const htmlContent = CGenerateHTMLDocument(mergedArray, loadedImages, isVertical, backgroundColor, imageBgLink);

            const result: ICertificatesEditTempParams = {
              id,
              title: certificateName,
              userFullName: tempCert?.userFullName || '',
              orientation: orientation === 'vertical' ? 0 : 1,
              backgroundColor: backgroundColor,
              backgroundImageUrl: imageBgLink,
              isReady: ready,
              body: htmlContent,
              data: toDataJson
            };
            return result;
          })
          .then((result) => {
            return editForm(result);
          })
          .then(() => {
            customNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: MESSAGE.created });
          })
          .catch((error) => {
            console.error('Error editForm', error);
            customNotification({ type: NOTIFICATION_TYPES.ERROR, message: MESSAGE.createdError });
          })
          .finally(() => {
            setLoading(false);
            redirectTo.move({ number: -1 });
          });
      } else {
        setLoading(false);
        setErrorEmptyFieldText('Такое наименование уже сущетсвует');
        setErrorEmptyField(true);
      }
    }
  }, [contentRef, editForm, orientation, certificateName, ready, backgroundPath, imageFiles, elements]);

  const onPreviewHtml = async () => {
    setLoading(true);
    const mergedArray = CMergeArrays(elements, imageFiles?.data);
    const htmlContent = CGenerateHTMLDocument(mergedArray, loadedImages, isVertical, backgroundColor, backgroundImage);

    const response = await previewTemp({
      userId: crypto.randomUUID(),
      firstname: 'Фамилия',
      surname: 'Имя',
      patronymic: 'Отчество',
      trainingLabel: certificateName,
      body: htmlContent,
      orientation: isVertical ? 0 : 1
    }).unwrap();

    const url = URL.createObjectURL(response);
    window.open(url, '_blank');
    setLoading(false);
    URL.revokeObjectURL(url);
  };

  if (isLoading || loading) return <PageSpinner />;

  return (
    <Layout>
      <BackButton />
      <Row className={styles.mainWrapper} justify={'space-between'}>
        <Col className={styles.contentWrapper} lg={14} xl={16} xxl={18}>
          <h1 className={styles.title}>{title}</h1>
          <div
            ref={contentRef}
            style={{
              position: 'relative',
              width: isVertical ? '783px' : '1288px',
              height: '1022px',
              background: 'white',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundColor,
              backgroundImage
            }}
          >
            <Stage width={isVertical ? 783 : 1288} height={1022} ref={stageRef} onMouseUp={handleDeselect}>
              <Layer>
                {elements.map((text) => {
                  return (
                    <Text
                      {...text}
                      key={text.id}
                      draggable={isEdit}
                      onDragEnd={(e) => isEdit && handleDragEnd(text.id, e)}
                      onClick={(e) => isEdit && handleSelect(text.id, e)}
                    />
                  );
                })}
                {loadedImages.map((img: any) => (
                  <Fragment key={img.id}>
                    <URLImage
                      key={img.id}
                      draggable={isEdit}
                      onDragEnd={(e: any) => isEdit && handleDragEnd(img.id, e)}
                      shapeProps={img}
                      isSelected={img.id === selectedImageId}
                      onSelect={() => {
                        if (isEdit) {
                          setIsEditingText(false);
                          setSelectedId(null);
                          setSelectedImageId(img.id);
                          setSelectType('image');
                        }
                      }}
                      onChange={(newAttrs: any) => handleParameterChange(newAttrs, 'object')}
                    />
                  </Fragment>
                ))}
                {isEdit && (
                  <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 5 || newBox.height < 5) {
                        return oldBox;
                      }
                      return newBox;
                    }}
                  />
                )}
                {isEdit && <Transformer width={100} ref={transformerRef} />}
                {gridEnable && (
                  <Group>
                    {[...Array(isVertical ? 23 : 37)].map((_, index) => (
                      <Line
                        key={index}
                        opacity={gridOpacity}
                        points={[index * 35, 0, index * 35, 1022]}
                        stroke={gridColor}
                        strokeWidth={0.5}
                      />
                    ))}
                    {[...Array(Math.ceil(1022 / 35))].map((_, index) => (
                      <Line
                        key={index}
                        points={[0, index * 35, orientation === 'vertical' ? 783 : 1288, index * 35]}
                        stroke={gridColor}
                        strokeWidth={0.5}
                        opacity={gridOpacity}
                      />
                    ))}
                  </Group>
                )}
              </Layer>
            </Stage>
          </div>
          {isEdit && (
            <Row>
              <Button onClick={onPreviewHtml} className={styles.previewBtn} type={'ghost'} icon={<Icon type='preview-new' />}>
                Предпросмотр
              </Button>
            </Row>
          )}
          <Row className={styles.footer} justify={'space-between'}>
            <CustomSwitch disabled={!isEdit} defaultChecked={ready} onChange={(value) => setReady(value)} title={'Готов к использованию'} />
            {isEdit && (
              <Button onClick={onFinish} className={styles.saveBtn} type={'primary'}>
                Сохранить
              </Button>
            )}
          </Row>
        </Col>
        <Col className={styles.sideBarWrapper} lg={4} xl={6} xxl={6}>
          <Row className={styles.buttonsWrapper}>
            {buttons.map(({ icon, onClick, label }: { icon: string; onClick: IFunction; label: string }) => (
              <Tooltip key={icon} overlay={label}>
                <Button
                  disabled={!isEdit}
                  className={cn(styles.typeBtns, { [styles.active]: content === icon })}
                  onClick={() => {
                    onClick();
                    setSelectedId(null);
                    setSelectedImageId(null);
                  }}
                  icon={<Icon type={icon as IIconType} />}
                />
              </Tooltip>
            ))}

            {contentType}
          </Row>
        </Col>
      </Row>
    </Layout>
  );
};
