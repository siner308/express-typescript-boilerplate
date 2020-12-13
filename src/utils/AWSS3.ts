import S3, { CopyObjectOutput } from 'aws-sdk/clients/s3';
import {
  ManagedUpload,
  PutObjectRequest,
  CopyObjectRequest,
  DeleteObjectOutput,
  DeleteObjectRequest,
  ListObjectsV2Request,
  ListObjectsV2Output,
} from 'aws-sdk/clients/s3';
import { AWSError } from 'aws-sdk';
import env from '../config/env';
import { ErrorWrapper } from './ErrorWrapper';

export class S3Controller {
  private static _bucket: S3;
  private static _default: S3Controller;

  private readonly bucketName: string;
  private readonly region: string;

  constructor() {
    this.bucketName = env.aws.s3Bucket;
    this.region = env.aws.region;
  }

  /**
   * singleton of controller
   */
  public static getInstance(): S3Controller {
    if (!S3Controller._default) {
      S3Controller._default = new S3Controller();
    }
    return S3Controller._default;
  }

  /**
   * singleton of s3 bucket
   * @private
   */
  private static getS3Bucket(): S3 {
    if (!S3Controller._bucket) {
      S3Controller._bucket = new S3({
        accessKeyId: env.aws.accessKeyId,
        secretAccessKey: env.aws.secretAccessKey,
        region: env.aws.region,
      });
      console.log('S3Bucket Instance for singleton is created');
    }
    return S3Controller._bucket;
  }

  /**
   * get prefix matching files
   * @param prefix
   */
  public getFiles(prefix: string): Promise<ListObjectsV2Output> {
    const params: ListObjectsV2Request = {
      Bucket: this.bucketName,
      Prefix: prefix,
    };
    return S3Controller.getS3Bucket()
      .listObjectsV2(params)
      .promise()
      .catch((err: AWSError) => {
        console.log(err);
        throw new ErrorWrapper('Unexpected S3 error', err);
      });
  }

  /**
   * Upload File to S3 as key
   * @param file
   * @param key
   */
  public uploadFile(file: Express.Multer.File, key: string): Promise<ManagedUpload.SendData> {
    const params: PutObjectRequest = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ACL: 'public-read',
    };

    return S3Controller.getS3Bucket()
      .upload(params)
      .promise()
      .catch((err: Error) => {
        console.log(err);
        throw new ErrorWrapper('Unexpected S3 error', err);
      });
  }

  /**
   * @description copy source file to destination path
   * @param source
   * @param destination
   */
  public copyFile(source: string, destination: string): Promise<CopyObjectOutput> {
    const params: CopyObjectRequest = {
      Bucket: this.bucketName,
      CopySource: source,
      Key: destination,
    };
    return S3Controller.getS3Bucket()
      .copyObject(params)
      .promise()
      .catch((err: Error) => {
        console.log(err);
        throw new ErrorWrapper('Unexpected S3 error', err);
      });
  }

  /**
   * @description delete s3 file
   * @param filePath
   */
  public deleteFile(filePath: string): Promise<DeleteObjectOutput> {
    const params: DeleteObjectRequest = {
      Bucket: this.bucketName,
      Key: filePath,
    };

    return S3Controller.getS3Bucket()
      .deleteObject(params)
      .promise()
      .catch((err: AWSError) => {
        console.log(err);
        throw new ErrorWrapper('Unexpected S3 error', err);
      });
  }

  /**
   * key
   * => https://bucket.s3.region.amazonaws.com/key
   */
  public getFileURL(key: string): string {
    return `${this.getBucketURL()}/${key}`;
  }

  /**
   * https://bucket.s3.region.amazonaws.com/filename.ext
   * => filename.ext
   */
  public getFilePath(fileURL: string): string {
    return `${this.getFileName(fileURL)}`;
  }

  /**
   * https://bucket.s3.region.amazonaws.com/path/filename.ext
   * => filename.ext
   */
  public getFileName(fileURLorKey: string): string {
    return fileURLorKey.substr(fileURLorKey.lastIndexOf('/') + 1);
  }

  /**
   * path/path/filename.ext
   * => ext
   */
  public getExtension(fileName: string): string {
    return fileName.substr(fileName.lastIndexOf('.') + 1);
  }

  /**
   * => https://bucket.s3.region.amazonaws.com
   */
  private getBucketURL(): string {
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com`;
  }
}
