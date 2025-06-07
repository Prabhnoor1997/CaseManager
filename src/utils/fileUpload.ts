import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import crypto from 'crypto';

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || '';

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

export const generateFileName = (originalName: string) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
};

export const getUploadUrl = async (fileName: string, fileType: string) => {
  const blobClient = containerClient.getBlockBlobClient(fileName);
  const uploadUrl = await blobClient.generateSasUrl({
    permissions: 'w',
    expiresOn: new Date(Date.now() + 3600 * 1000), // 1 hour
    contentType: fileType,
  });
  return uploadUrl;
};

export const getFileUrl = async (fileName: string) => {
  const blobClient = containerClient.getBlockBlobClient(fileName);
  const downloadUrl = await blobClient.generateSasUrl({
    permissions: 'r',
    expiresOn: new Date(Date.now() + 3600 * 1000), // 1 hour
  });
  return downloadUrl;
};

export const deleteFile = async (fileName: string) => {
  const blobClient = containerClient.getBlockBlobClient(fileName);
  await blobClient.delete();
};

export const getFileSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}; 