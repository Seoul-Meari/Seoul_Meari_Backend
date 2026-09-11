export interface InitiateUploadResponseDto {
  uploadId: string;
  urls: Array<{
    fileName: string;
    url: string;
  }>;
}
