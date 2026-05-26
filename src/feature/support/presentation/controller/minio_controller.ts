import { Controller, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../auth/presentation/guard/auth_guard';
import { MinioService } from '../../application/minio_service';
import { MinioResponse } from '../../domain/model/response/minio_response';

@UseGuards(AuthGuard)
@Controller('api/minio')
export class MinioController {
  constructor(private readonly service: MinioService) {}

  @Get('presign-upload')
  getPresignedUploadUrl(@Query('key') key: string): Promise<MinioResponse> {
    return this.service.getPresignedUploadUrl(key);
  }

  @Get('presign-view')
  getPresignedViewUrl(@Query('key') key: string): Promise<MinioResponse> {
    return this.service.getPresignedViewUrl(key);
  }

  @Delete()
  async remove(@Query('key') key: string): Promise<{ success: boolean }> {
    await this.service.removeObject(key);
    return { success: true };
  }
}
