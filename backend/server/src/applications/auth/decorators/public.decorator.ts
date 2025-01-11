import { SetMetadata } from '@nestjs/common';

export const SKIP = 'skipAuthGuard';
export const SkipAuthGuard = () => SetMetadata(SKIP, true);
