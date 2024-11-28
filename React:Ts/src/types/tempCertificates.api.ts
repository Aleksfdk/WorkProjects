import {
  ICertificatesChangeImageParams,
  ICertificatesChangeImageResponse,
  ICertificatesCopyTempParams,
  ICertificatesCreateTempParams,
  ICertificatesEditTempParams,
  ICertificatesEditTempResponse,
  ICertificatesGenerateParams,
  ICertificatesImage,
  ICertificatesTempIdParams,
  ICertificatesTempIdResponse,
  ICertificatesTempListParams,
  ICertificatesTempListResponse,
  ICertificationListParams,
  ICertificationListResponse,
  ICertificationPreviewParams,
  IDeleteFileCertificateParams,
  IGetCheckNameCertificateParams,
  IGetCheckNameCertificateResponse
} from 'types/entities/tempCertificates';
import { IStudentList } from '../../entities';

export module ICertificatesImageId {
  export type Response = ICertificatesImage;
  export type Params = ICertificatesImage;
}

export module ICertificatesChangeImage {
  export type Response = ICertificatesChangeImageResponse;
  export type Params = ICertificatesChangeImageParams;
}

export module ICertificatesTempList {
  export type Response = ICertificatesTempListResponse;
  export type Params = ICertificatesTempListParams;
}

export module ICertificatesTempId {
  export type Response = ICertificatesTempIdResponse;
  export type Params = ICertificatesTempIdParams;
}

export module ICertificatesEditTemp {
  export type Response = ICertificatesEditTempResponse;
  export type Params = ICertificatesEditTempParams;
}

export module ICertificatesCreateTemp {
  export type Response = any;
  export type Params = ICertificatesCreateTempParams;
}

export module ICertificatesCopyTemp {
  export type Response = any;
  export type Params = ICertificatesCopyTempParams;
}

export module ICertificationPreview {
  export type Response = any;
  export type Params = ICertificationPreviewParams;
}

export module ICertificationList {
  export type Response = ICertificationListResponse;
  export type Params = ICertificationListParams;
}

export module IUploadFileCertificate {
  export type Response = string;
  export type Params = FormData;
}

export module IDeleteFileCertificate {
  export type Response = any;
  export type Params = IDeleteFileCertificateParams;
}

export module ICertificatesGenerate {
  export type Response = any;
  export type Params = ICertificatesGenerateParams;
}

export module IGetUsersCourse {
  export type Response = IStudentList;
  export type Params = { id: string };
}

export module IGetCheckNameCertificate {
  export type Response = IGetCheckNameCertificateResponse;
  export type Params = IGetCheckNameCertificateParams;
}
