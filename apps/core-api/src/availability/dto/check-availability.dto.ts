import {
  IsString,
  IsOptional,
  IsUUID,
  IsInt,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

class TimeRangeDto {
  @ApiProperty()
  @IsString()
  start: string; // HH:mm

  @ApiProperty()
  @IsString()
  end: string; // HH:mm
}

export class CheckAvailabilityDto {
  @ApiProperty({ example: "2025-01-15" })
  @IsString()
  date: string; // YYYY-MM-DD

  @ApiProperty({ required: false })
  @ValidateNested()
  @Type(() => TimeRangeDto)
  @IsOptional()
  timeRange?: TimeRangeDto;

  @ApiProperty({ type: [String] })
  @IsUUID("4", { each: true })
  serviceIds: string[];

  @ApiProperty({ required: false })
  @IsUUID("4")
  @IsOptional()
  venueId?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  partySize?: number;
}
