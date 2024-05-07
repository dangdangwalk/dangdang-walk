import { Type } from 'class-transformer';
import { IsNotEmpty, IsUrl, ValidateNested } from 'class-validator';
class DogDto {
    @IsNotEmpty()
    id: string;
  
    @IsNotEmpty()
    name: string;
  
    @IsNotEmpty()
    @IsUrl()
    photoUrl: string;
  
    @IsNotEmpty()
    fecesCnt: number;
  
    @IsNotEmpty()
    urinesCnt: number;
  }
  
  class RouteDto {
    @IsNotEmpty()
    x: number;
  
    @IsNotEmpty()
    y: number;
  }
  
  export class CreateWalkDto {
    @IsNotEmpty()
    title: string;
  
    @IsNotEmpty()
    distance: number;
  
    @IsNotEmpty()
    calorie: number;
  
    @IsNotEmpty()
    duration: number;
  
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => RouteDto)
    routes: RouteDto[];
  
    @IsNotEmpty()
    @IsUrl()
    routeUrl: string;
  
    @IsNotEmpty()
    @IsUrl({},{ each: true })
    photoUrls: string[];
  
    @IsNotEmpty()
    memo: string;
  
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => DogDto)
    dog: DogDto;
  
    @IsNotEmpty()
    @IsUrl({}, { each: true })
    companions: string[];
  }