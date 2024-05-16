import { Controller, Get } from '@nestjs/common';
import { SkipAuthGuard } from 'src/auth/decorators/public.decorator';

@Controller('breeds')
export class BreedController {
    @SkipAuthGuard()
    @Get('/')
    async getBreedData() {
        //TODO : 데이터 확정 후에는 DB에서 가져오는걸로 바꾸기..
        return [
            '말티즈',
            '푸들',
            '시바견',
            '골든 리트리버',
            '보더 콜리',
            '사모예드',
            '비글',
            '닥스훈트',
            '요크셔 테리어',
            '치와와',
            '보스턴 테리어',
            '퍼그',
            '허스키',
            '록시',
            '로트와일러',
            '비숑 프리제',
            '허밍턴',
            '셰퍼드',
            '웰시 코기',
            '잉글리쉬 세터',
            '아프간 하운드',
            '블러드하운드',
            '레브라도 리트리버',
            '잭 러셀 테리어',
            '베들링턴 테리어',
            '토이 푸들',
            '삽살개',
            '콜리',
            '말라뮤트',
        ];
    }
}
