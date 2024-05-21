import { ForbiddenException, Injectable } from '@nestjs/common';
import { DogsService } from 'src/dogs/dogs.service';
import { Excrements } from 'src/excrements/excrements.entity';
import { ExcrementsService } from 'src/excrements/excrements.service';
import { ExcrementsType } from 'src/excrements/types/excrements.enum';
import { JournalPhotos } from 'src/journal-photos/journal-photos.entity';
import { JournalPhotosService } from 'src/journal-photos/journal-photos.service';
import { JournalsDogs } from 'src/journals-dogs/journals-dogs.entity';
import { JournalsDogsService } from 'src/journals-dogs/journals-dogs.service';
import { formatDate, getStartAndEndOfDay, getStartAndEndOfMonth, getStartAndEndOfWeek } from 'src/utils/date.utils';
import { checkIfExistsInArr, makeSubObject, makeSubObjectsArray } from 'src/utils/manipulate.util';
import { DeleteResult, EntityManager, FindManyOptions, FindOptionsWhere, In, UpdateResult } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { JournalInfoForList } from './dtos/journal-list.dto';
import { UpdateJournalDto } from './dtos/journal-update.dto';
import { CreateJournalDto, ExcrementsInfoForCreate, JournalInfoForCreate, Location } from './dtos/journals-create.dto';
import {
    DogInfoForDetail,
    ExcrementsInfoForDetail,
    JournalDetailDto,
    JournalInfoForDetail,
    PhotoUrlDto,
} from './dtos/journals-detail.dto';
import { Journals } from './journals.entity';
import { JournalsRepository } from './journals.repository';
import { CreateJournalData } from './types/journal-types';

@Injectable()
export class JournalsService {
    constructor(
        private readonly journalsRepository: JournalsRepository,
        private readonly journalsDogsService: JournalsDogsService,
        private readonly dogsService: DogsService,
        private readonly journalPhotosService: JournalPhotosService,
        private readonly excrementsService: ExcrementsService,
        private readonly entityManager: EntityManager
    ) {}

    async create(entityData: CreateJournalData): Promise<Journals> {
        const journals = new Journals(entityData);
        return this.journalsRepository.create(journals);
    }

    async find(where: FindManyOptions<Journals>) {
        return this.journalsRepository.find(where);
    }

    async findOne(where: FindOptionsWhere<Journals>): Promise<Journals> {
        return await this.journalsRepository.findOne(where);
    }

    async update(
        where: FindOptionsWhere<Journals>,
        partialEntity: QueryDeepPartialEntity<Journals>
    ): Promise<UpdateResult> {
        return this.journalsRepository.update(where, partialEntity);
    }

    async delete(journalId: number): Promise<DeleteResult> {
        const where: FindOptionsWhere<Journals> = { id: journalId };
        return this.journalsRepository.delete(where);
    }

    async updateAndFindOne(
        where: FindOptionsWhere<Journals>,
        partialEntity: QueryDeepPartialEntity<Journals>
    ): Promise<Journals | null> {
        return this.journalsRepository.updateAndFindOne(where, partialEntity);
    }

    async getOwnJournalIds(userId: number): Promise<number[]> {
        const ownJournals = await this.journalsRepository.find({ where: { userId: userId } });

        return ownJournals.map((cur) => cur.id);
    }

    async getJournalPhotos(journalId: number): Promise<string[]> {
        const photoUrlsRaw = await this.journalPhotosService.find({ journalId });

        const photoUrls = photoUrlsRaw.map((cur) => {
            return cur[PhotoUrlDto.getKey() as keyof JournalPhotos];
        });

        return photoUrls as string[];
    }

    async checkDogExistsInJournal(journalDogs: JournalsDogs[], dogId: number) {
        const journalDogIds = journalDogs.map((cur) => cur.dogId);

        if (!checkIfExistsInArr(journalDogIds, dogId)) {
            throw new ForbiddenException(`Dog ${dogId} is not included in current journal `);
        }
        return;
    }

    async getJournalInfoForDetail(journalId: number): Promise<JournalInfoForDetail> {
        const journalInfoRaw = await this.findOne({ id: journalId });
        const journalInfo = makeSubObject(journalInfoRaw, JournalInfoForDetail.getKeysForJournalTable());
        journalInfo.id = journalId;
        journalInfo.routes = JSON.parse(journalInfo.routes);
        journalInfo.photoUrls = await this.getJournalPhotos(journalId);

        return journalInfo;
    }

    async getExcrementsCnt(journalId: number, dogId: number, type: ExcrementsType): Promise<number> {
        const excrements = await this.excrementsService.find({ where: { journalId, dogId, type } });

        return excrements.length;
    }

    async getExcrementsInfoForDetail(journalId: number, dogId: number): Promise<ExcrementsInfoForDetail | void> {
        const excrementsInfo = new ExcrementsInfoForDetail();

        excrementsInfo.dogId = dogId;
        const fecesCnt = await this.getExcrementsCnt(journalId, dogId, ExcrementsType.feces);
        const urineCnt = await this.getExcrementsCnt(journalId, dogId, ExcrementsType.urine);
        if (!fecesCnt && !urineCnt) {
            return;
        }
        fecesCnt ? (excrementsInfo.fecesCnt = fecesCnt) : fecesCnt;
        urineCnt ? (excrementsInfo.urineCnt = urineCnt) : urineCnt;

        return excrementsInfo;
    }

    async getDogsInfoForDetail(journalId: number, dogId: number): Promise<DogInfoForDetail> {
        const dogInfoRaw = await this.dogsService.findOne({ id: dogId });

        const dogInfo: DogInfoForDetail = makeSubObject(dogInfoRaw, DogInfoForDetail.getKeysForDogTable());

        return dogInfo;
    }

    async getJournalDetail(journalId: number): Promise<JournalDetailDto> {
        try {
            const journalInfo = await this.getJournalInfoForDetail(journalId);

            const journalDogIds = await this.journalsDogsService.getDogIdsByJournalId(journalId);
            const dogInfo: DogInfoForDetail[] = [];
            const excrementsInfo: ExcrementsInfoForDetail[] = [];
            for (const curDogId of journalDogIds) {
                dogInfo.push(await this.getDogsInfoForDetail(journalId, curDogId));
                const curExcrements = await this.getExcrementsInfoForDetail(journalId, curDogId);
                curExcrements ? excrementsInfo.push(curExcrements) : curExcrements;
            }

            return new JournalDetailDto(journalInfo, dogInfo, excrementsInfo);
        } catch (error) {
            throw error;
        }
    }

    async checkJournalOwnership(userId: number, journalIds: number | number[]): Promise<boolean> {
        const myJournalIds = await this.getOwnJournalIds(userId);
        return checkIfExistsInArr(myJournalIds, journalIds);
    }

    async createNewJournal(userId: number, journalInfo: CreateJournalData) {
        if (!journalInfo.memo) {
            journalInfo.memo = '';
        }
        journalInfo.userId = userId;
        return await this.create(journalInfo);
    }

    async createNewJournalDogs(journalId: number, dogIds: number[]) {
        for (const curId of dogIds) {
            await this.journalsDogsService.createIfNotExists(journalId, curId);
        }
        return;
    }

    async createNewPhotoUrls(journalId: number, photoUrls: string[]) {
        const keys: (keyof JournalPhotos)[] = ['journalId', 'photoUrl'];
        const data: Partial<JournalPhotos> = {};

        data.journalId = journalId;

        for (const curUrl of photoUrls) {
            data.photoUrl = curUrl;
            await this.journalPhotosService.createIfNotExists(data, keys);
        }
    }

    private makeCoordinate(lat: string, lag: string): string {
        return `POINT(${lat} ${lag})`;
    }

    async createNewExcrements(
        journalId: number,
        dogId: number,
        type: ExcrementsType,
        location: Location
    ): Promise<Excrements> {
        const coordinate = this.makeCoordinate(location.lat, location.lng);
        const data: Partial<Excrements> = { journalId, dogId, type, coordinate };

        return this.excrementsService.createIfNotExists(data);
    }

    async excrementsLoop(journalId: number, excrements: ExcrementsInfoForCreate[]) {
        let dogId;
        for (const curExcrements of excrements) {
            dogId = curExcrements.dogId;

            for (const curFeces of curExcrements.fecesLocations) {
                await this.createNewExcrements(journalId, dogId, ExcrementsType.feces, curFeces);
            }

            for (const curUrine of curExcrements.urineLocations) {
                await this.createNewExcrements(journalId, dogId, ExcrementsType.urine, curUrine);
            }
        }
    }

    private makeJournalData(userId: number, createJournalData: CreateJournalDto) {
        const journalData: CreateJournalData = makeSubObject(
            createJournalData.journalInfo,
            JournalInfoForCreate.getKeysForJournalTable()
        );
        journalData.userId = userId;
        journalData.routes = JSON.stringify(journalData.routes);

        return journalData;
    }

    private checkPhotoUrlExist(photoUrls: string[] | undefined): string[] {
        if (!photoUrls) {
            return [];
        } else {
            return photoUrls;
        }
    }

    @Transactional()
    async createJournal(userId: number, createJournalData: CreateJournalDto) {
        const dogs = createJournalData.dogs;
        const journalData = this.makeJournalData(userId, createJournalData);
        const createJournalResult = await this.createNewJournal(userId, journalData);
        await this.createNewJournalDogs(createJournalResult.id, dogs);

        const photoUrls = this.checkPhotoUrlExist(createJournalData.journalInfo.photoUrls);
        if (photoUrls.length) {
            await this.createNewPhotoUrls(createJournalResult.id, photoUrls);
        }

        const excrements: ExcrementsInfoForCreate[] = createJournalData.excrements;
        if (excrements.length) {
            await this.excrementsLoop(createJournalResult.id, excrements);
        }
    }

    @Transactional()
    async updateJournal(journalId: number, updateJournalData: UpdateJournalDto) {
        if (updateJournalData.memo) {
            await this.updateAndFindOne({ id: journalId }, { memo: updateJournalData.memo });
        }
        if (updateJournalData.photoUrls) {
            await this.journalPhotosService.delete({ journalId });
            if (updateJournalData.photoUrls.length) {
                await this.createNewPhotoUrls(journalId, updateJournalData.photoUrls);
            }
        }
    }

    async deleteJournal(journalId: number) {
        await this.delete(journalId);
    }

    async findJournals(userId: number, dogId: number, startDate: Date, endDate: Date): Promise<Journals[]> {
        return this.entityManager
            .createQueryBuilder(Journals, 'journals')
            .innerJoin(JournalsDogs, 'journals_dogs', 'journals.id = journals_dogs.journal_id')
            .where('journals.user_id = :userId', { userId })
            .andWhere('journals_dogs.dog_id = :dogId', { dogId })
            .andWhere('journals.started_at >= :startDate', { startDate })
            .andWhere('journals.started_at < :endDate', { endDate })
            .getMany();
    }

    async getTotal(journals: Journals[]): Promise<{ totalWalkCnt: number; totalDistance: number; totalTime: number }> {
        const totalDistance = journals.reduce((acc, journal) => acc + journal.distance, 0);
        const totalTime = journals.reduce((acc, journal) => acc + journal.duration, 0);
        return { totalWalkCnt: journals.length, totalDistance, totalTime };
    }

    async findJournalsAndGetTotal(
        userId: number,
        dogId: number,
        startDate: Date,
        endDate: Date
    ): Promise<{ [date: string]: number }> {
        const dogJournals = await this.findJournals(userId, dogId, startDate, endDate);
        return this.getTotal(dogJournals);
    }

    async aggregateJournalsByDay(
        journals: Journals[],
        startDate: Date,
        endDate: Date
    ): Promise<{ [date: string]: number }> {
        const journalCntAMonth: { [date: string]: number } = {};

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateString = formatDate(currentDate);
            journalCntAMonth[dateString] = 0;
            currentDate.setDate(currentDate.getDate() + 1);
        }

        journals.forEach((journal) => {
            const journalDate = new Date(journal.startedAt);
            const dateString = formatDate(journalDate);
            journalCntAMonth[dateString]++;
        });

        return journalCntAMonth;
    }

    async findJournalsAndAggregateByDay(
        userId: number,
        dogId: number,
        startDate: Date,
        endDate: Date
    ): Promise<{ [date: string]: number }> {
        const dogJournals = await this.findJournals(userId, dogId, startDate, endDate);
        return this.aggregateJournalsByDay(dogJournals, startDate, endDate);
    }

    async getDogStatisticsByMonth(userId: number, dogId: number, date: string) {
        const { startDate, endDate } = getStartAndEndOfMonth(new Date(date));
        return this.findJournalsAndAggregateByDay(userId, dogId, startDate, endDate);
    }

    async getDogStatisticsByWeek(userId: number, dogId: number, date: string) {
        const { startDate, endDate } = getStartAndEndOfWeek(new Date(date));
        return this.findJournalsAndAggregateByDay(userId, dogId, startDate, endDate);
    }

    async getJournalIdsByDogIdAndDate(dogId: number, date: string): Promise<number[]> {
        const startEndDate = getStartAndEndOfDay(new Date(date));
        const result = await this.entityManager
            .createQueryBuilder(Journals, 'journals')
            .orderBy('journals_id', 'ASC')
            .innerJoin(JournalsDogs, 'journals_dogs', 'journals.id = journals_dogs.journal_id')
            .where('journals_dogs.dog_id = :dogId', { dogId })
            .andWhere('journals.started_at >= :startDate', { startDate: startEndDate.startDate })
            .andWhere('journals.started_at < :endDate', { endDate: startEndDate.endDate })
            .getRawMany();

        return result.map((cur) => cur.journals_id);
    }

    private putDogCntToJournalList(journalInfos: JournalInfoForList[], firstJournalCnt: number): JournalInfoForList[] {
        return journalInfos.map((cur) => {
            const newJournal: JournalInfoForList = {
                ...cur,
                journalCnt: firstJournalCnt++,
            };
            return newJournal;
        });
    }

    async getJournalList(dogId: number, date: string): Promise<JournalInfoForList[]> {
        const journalIds = await this.getJournalIdsByDogIdAndDate(dogId, date);
        if (!journalIds.length) {
            return [];
        }
        const journalInfosRaw = await this.find({ where: { id: In(journalIds) } });
        const journalInfos = await makeSubObjectsArray(
            journalInfosRaw,
            JournalInfoForList.getAttributesForJournalTable(),
            JournalInfoForList.getKeysForJournalTable()
        );
        const findResult = await this.journalsDogsService.find({ where: { dogId } });
        const journalCntForFirstRow = findResult.findIndex((jd) => jd.journalId === journalInfos[0].journalId);
        const result = this.putDogCntToJournalList(journalInfos, journalCntForFirstRow + 1);
        return result;
    }
}
