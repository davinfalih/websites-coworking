import {
  Controller,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN_SPACE')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('revenue/month')
  @ApiOperation({ summary: '[ADMIN SPACE] Estimasi pendapatan per bulan' })
  @ApiResponse({ status: 200, description: 'Rekapitulasi pendapatan per bulan' })
  revenuePerMonth(@Request() req: any) {
    return this.reportsService.revenuePerMonth(req.user.profileId);
  }

  @Get('revenue/space-type')
  @ApiOperation({ summary: '[ADMIN SPACE] Distribusi pendapatan per jenis space' })
  @ApiResponse({ status: 200, description: 'Distribusi pendapatan per jenis space' })
  revenuePerSpaceType(@Request() req: any) {
    return this.reportsService.revenuePerSpaceType(req.user.profileId);
  }

  @Get('dashboard')
  @ApiOperation({ summary: '[ADMIN SPACE] Ringkasan dashboard (total, status, pendapatan)' })
  @ApiResponse({ status: 200, description: 'Ringkasan dashboard' })
  dashboard(@Request() req: any) {
    return this.reportsService.dashboardSummary(req.user.profileId);
  }
}
