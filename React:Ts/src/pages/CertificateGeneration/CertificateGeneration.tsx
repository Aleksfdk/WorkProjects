import { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Row, Table, TablePaginationConfig } from 'antd';
import { RcFile, UploadProps } from 'antd/es/upload/interface';
import { AccessContainer, Layout } from 'containers';
import { Button, customNotification, Icon, Input, NOTIFICATION_TYPES } from 'common/ui';
import { TableMultiple } from '../../common/components/TableMultiple';
import { BackButton, PageSpinner, PaginationFooter } from 'common/components';
import ProgramModal from 'common/components/ProgramModal/ProgramModal';
import { useAppSelector, useDebounce, useRedirect } from 'common/hooks';
import { MESSAGE } from 'common/constants';
import { ListUsersType } from 'common/constants/certificate.config';
import { profileSelectors } from 'api/student/profile/profile.selectors';
import { useGetInstructorsQuery } from 'api/instructor/courses/endpoints/course.enpoint';
import {
  useDeleteFileCertificateMutation,
  useGetCertificateListQuery,
  usePostCertificatesGenerateMutation,
  usePostFileCertificateMutation
} from 'api/tempCertificates/tempCertificates.api';
import { instructorLabels } from 'types/routes';
import { data, IData } from '../instructor/Resources/Resources.helper';
import { ModalFileGenerateCert } from './components/ModalFIleGenerateCert';
import { ModalPreviewCert } from './components/ModalPreviewCert';
import { ModalUploadFile } from './components/ModalUploadFile';
import { ModalUsersGenerateCert } from './components/ModalUsersGenerateCert';
import { getColumns } from './CertificateGeneration.helper';
import styles from '../instructor/Resources/styles.module.scss';
import {ICertificatesItem, ICertificatesItemMultiple} from "../../../types/entities/tempCertificates";

export const CertificateGeneration: FC = () => {
  const { courseId = '' } = useParams();
  const [dataSource] = useState(data);
  const [dataSearch, setDataSearch] = useState<IData[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalUpload, setIsModalUpload] = useState<boolean>(false);
  const [isModalUsersGenerate, setIsModalUsersGenerate] = useState<boolean>(false);
  const [isModalFileGenerate, setIsModalFileGenerate] = useState<boolean>(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const [tableParams, setTableParams] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10
  });
  const { permissions, role } = useAppSelector(profileSelectors.role);
  const { data: instructors, isFetching: insFetching } = useGetInstructorsQuery({ courseId });
  const { accountId, timeZone } = useAppSelector(profileSelectors.profile);
  const [file, setFile] = useState<RcFile | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [currentStudentId, setCurrentStudentId] = useState<string>('');
  const [usersGenerateCert, setUsersGenerateCert] = useState<string[]>([]);
  const [certificateId, setCertificateId] = useState<string | undefined>();
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false);
  const [isModalPreview, setIsModalPreview] = useState<boolean>(false);
  const [isPreviewLink, setIsPreviewLink] = useState<string>('');

  const isInstructor = instructors?.some((instructor) => instructor.accountId === accountId);

  const { data: certificatesList, isLoading } = useGetCertificateListQuery({
    trainingId: courseId,
    order: 0,
    currentPage: tableParams.current || 1,
    pageSize: tableParams.pageSize || 10,
    search: debouncedSearch
  });
  const [saveFileCertificate] = usePostFileCertificateMutation();
  const [deleteFileCertificate] = useDeleteFileCertificateMutation();
  const [saveCetrificatesGenerate] = usePostCertificatesGenerateMutation();

  const redirect = useRedirect();

  const onSelectPagination = useCallback(
    (value: string | null) => {
      setTableParams({
        ...tableParams,
        total: certificatesList?.totalCount,
        pageSize: Number(value)
      });
    },
    [tableParams, certificatesList]
  );

  const permissionForActions = useMemo(() => {
    if (role === 'Root') return true;

    return !!permissions.AccreditationsAccess && !!isInstructor;
  }, [isInstructor, role, permissions]);

  const onChangePage = useCallback(
    (page: number, pageSize: number) => {
      setTableParams({
        ...tableParams,
        current: page,
        pageSize
      });
    },
    [tableParams]
  );

  useEffect(() => {
    if (dataSource.length !== tableParams.total) {
      setTableParams({
        ...tableParams,
        total: dataSource.length
      });
    }
    const from = ((tableParams.current || 1) - 1) * (tableParams.pageSize || 10);
    const to = (tableParams.current || 1) * (tableParams.pageSize || 10);
    const newData = [...dataSource];
    setDataSearch(newData.slice(from, to));
  }, [tableParams, dataSource]);

  const onChangeSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  useEffect(() => {
    if (!dataSource) return;

    let data = dataSource;
    if (search) {
      data = data.filter(({ description }) => description.toLowerCase().includes(search.toLowerCase()));
    }

    setDataSearch(data);
  }, [dataSource, search]);

  const custom: UploadProps['customRequest'] = async (options) => {
    const { file } = options;
    if ((file as RcFile).name) {
      setFile(file as RcFile);
      setFileName((file as RcFile).name);
    }
  };

  const uploadProps: UploadProps = {
    listType: 'picture',
    maxCount: 1,
    accept: 'image/png, image/jpeg, image/jpg, image/pdf',
    customRequest: custom,
    showUploadList: false
  };

  const columns = useMemo(() => {
    return getColumns({
      onClick: (record, action) => {
        switch (action) {
          case 'delete':
            if (record.certificateId) {
              setCertificateId(record.certificateId);
              setIsOpenModalDelete(true);
            }
            break;
          case 'preview':
            if (record.link) {
              fetch(record.link).then((response) => {
                const contentType = response.headers.get('content-type');
                if (record.link) {
                  if (contentType === 'application/pdf') {
                    const link = document.createElement('a');
                    link.href = record.link;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  } else {
                    setIsPreviewLink(record.link);
                    setIsModalPreview(true);
                  }
                }
              });
            }
            break;
          case 'upload':
            setCertificateId(record.certificateId);
            setCurrentStudentId(record.studentId);
            setIsModalUpload(true);
            break;
          default:
            break;
        }
      },
      permission: permissionForActions,
      onFullNameClick: ({ studentId }) => redirect.studentProfile({ studentId }),
      timeZone
    });
  }, [certificatesList, redirect]);

  const onDeleteCert = async () => {
    if (certificateId) {
      await onDeleteFileCert(certificateId);
      setIsOpenModalDelete(false);
    }
  };

  const onDeleteFileCert = async (certificateId: string) => {
    setLoading(true);
    try {
      await deleteFileCertificate({ id: certificateId });
      customNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: MESSAGE.deleted });
    } catch (e) {
      customNotification({ type: NOTIFICATION_TYPES.ERROR, message: MESSAGE.hasError });
    } finally {
      setLoading(false);
    }
  };
  const onSaveForm = async ({ title, createdDate }: { title: string; createdDate: string }) => {
    setIsModalUpload(false);
    if (file) {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('studentId', currentStudentId);
      formData.append('trainingId', courseId);
      formData.append('title', title);
      formData.append('created', createdDate);

      try {
        if (certificateId) {
          await onDeleteFileCert(certificateId);
        }
        await saveFileCertificate(formData);
        customNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: MESSAGE.created });
      } catch (e) {
        customNotification({ type: NOTIFICATION_TYPES.ERROR, message: MESSAGE.createdError });
      } finally {
        setLoading(false);
      }
    }
  };

  const onModalFileGenerateCert = (value: boolean) => {
    setIsModalFileGenerate(value);
  };

  const onSetUsersGenerateCert = (value: ListUsersType[]) => {
    setUsersGenerateCert((prevState) => [...prevState, ...value.map((item) => item.accountId)]);
  };

  const onGenerateCertificates = async (id: string) => {
    setLoading(true);
    const data = { templateId: id, trainingId: courseId, studentIds: usersGenerateCert };
    setIsModalFileGenerate(false);
    setIsModalUsersGenerate(false);
    setUsersGenerateCert([]);

    await saveCetrificatesGenerate(data)
      .then((response) => {
        if ('error' in response) {
          customNotification({ type: NOTIFICATION_TYPES.ERROR, message: MESSAGE.createdError });
        } else {
          customNotification({ type: NOTIFICATION_TYPES.SUCCESS, message: MESSAGE.created });
          redirect.queueTasks({});
        }
      })
      .catch((error) => {
        console.error('Error editForm', error);
        customNotification({ type: NOTIFICATION_TYPES.ERROR, message: MESSAGE.createdError });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (isLoading || loading) return <PageSpinner />;

  return (
    <AccessContainer isShowChildren={role === 'Root' && permissions.Certificate}>
      <Layout>
        <Row justify={'center'}>
          <Col className={styles.backBtn} span={24} md={22} xl={22} xxl={22}>
            <BackButton />
          </Col>
          <Col span={24} md={22} xl={22} xxl={22} className={styles.mainWrapper}>
            <div className={styles.resource}>
              <h1 className={styles.title}>{instructorLabels.certificateGeneration}</h1>
              <div>
                <Row justify={'space-between'} align={'middle'} className={styles.rowLinkWrapper}>
                  <Col span={6}>
                    <Input type='search' placeholder='Поиск' onChange={onChangeSearch} value={search} />
                  </Col>
                  <Col>
                    <Button
                      className={styles.btn}
                      type='link'
                      onClick={() => setIsModalUsersGenerate(true)}
                      icon={<Icon type='refresh-new' />}
                    >
                      Сгенерировать
                    </Button>
                  </Col>
                </Row>
                <TableMultiple<ICertificatesItemMultiple> columns={columns} dataSource={certificatesList?.items} groupField={'fullName'} />
                <PaginationFooter
                  dataCount={certificatesList?.totalCount || 0}
                  tableParams={tableParams}
                  onChangePage={onChangePage}
                  onSelect={onSelectPagination}
                />
                <ModalPreviewCert isModalPreview={isModalPreview} onCancel={() => setIsModalPreview(false)} previewLink={isPreviewLink} />
                <ModalUploadFile
                  isModalUpload={isModalUpload}
                  onCancel={() => setIsModalUpload(false)}
                  uploadProps={uploadProps}
                  fileName={fileName}
                  saveForm={onSaveForm}
                  setFileName={setFileName}
                />
                <ModalUsersGenerateCert
                  isModalUsersGenerate={isModalUsersGenerate}
                  onModalFileGenerateCert={onModalFileGenerateCert}
                  onCancel={() => setIsModalUsersGenerate(false)}
                  onSetUsersGenerateCert={onSetUsersGenerateCert}
                  dataSource={certificatesList?.items}
                  courseId={courseId}
                  usersGenerateCert={usersGenerateCert}
                />
                <ModalFileGenerateCert
                  isModalFileGenerate={isModalFileGenerate}
                  usersGenerateCert={usersGenerateCert}
                  onGenerateCertificates={onGenerateCertificates}
                  onCancel={() => {
                    setIsModalFileGenerate(false);
                    setIsModalUsersGenerate(true);
                    setUsersGenerateCert([]);
                  }}
                />
                <ProgramModal
                  open={isOpenModalDelete}
                  onCancel={() => setIsOpenModalDelete(false)}
                  iconType='trash'
                  title='Удаление'
                  description={'Вы уверены, что хотите удалить сертификат?'}
                  btnText='Удалить'
                  onClick={() => onDeleteCert()}
                  isLoading={loading}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Layout>
    </AccessContainer>
  );
};
