import { IsString } from 'class-validator';

export class UploadImageDto {
  @IsString()
  bucket: string;
}