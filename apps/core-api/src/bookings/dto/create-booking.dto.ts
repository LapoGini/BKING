import {
  IsString,
  IsDate,
  IsInt,
  IsOptional,
  IsUUID,
  ValidateNested,
  IsEmail,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

class CustomerDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @IsBoolean()
  gdprConsent: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  marketingConsent?: boolean;
}

export class CreateBookingDto {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endTime?: Date;

  @ApiProperty({ type: [String] })
  @IsUUID("4", { each: true })
  serviceIds: string[];

  @ApiProperty({ required: false })
  @IsUUID("4")
  @IsOptional()
  venueId?: string;

  @ApiProperty()
  @IsInt()
  partySize: number;

  @ApiProperty({ type: CustomerDto })
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
