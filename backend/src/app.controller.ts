// ============================================================
// ALFA DARK JOYERÍA — App Controller
// ============================================================

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  healthCheck(): { status: string; service: string; timestamp: string } {
    return {
      status: 'OK',
      service: 'ALFA DARK JOYERÍA API',
      timestamp: new Date().toISOString(),
    };
  }
}
