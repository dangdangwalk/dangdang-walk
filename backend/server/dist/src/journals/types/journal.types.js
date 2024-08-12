"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalDetailResponse = exports.JournalOutputForDetail = exports.DogOutputForDetail = exports.JournalListResponse = exports.CreateJournalDatabaseInput = void 0;
class CreateJournalDatabaseInput {
    static getKeysForJournalRequest() {
        return ['distance', 'calories', 'startedAt', 'duration'];
    }
}
exports.CreateJournalDatabaseInput = CreateJournalDatabaseInput;
class JournalListResponse {
    static getKeysForJournalListRaw() {
        return ['journalId', 'startedAt', 'distance', 'calories', 'duration', 'journalCnt'];
    }
}
exports.JournalListResponse = JournalListResponse;
class DogOutputForDetail {
    static getFieldForDogTable() {
        return ['id', 'name', 'profilePhotoUrl'];
    }
}
exports.DogOutputForDetail = DogOutputForDetail;
class JournalOutputForDetail {
    static getFieldForJournalTable() {
        return ['id', 'routes', 'memo', 'journalPhotos', 'excrementCount'];
    }
}
exports.JournalOutputForDetail = JournalOutputForDetail;
class JournalDetailResponse {
    constructor(journalInfo, dogInfo) {
        this.journalInfo = journalInfo;
        this.dogs = dogInfo;
    }
}
exports.JournalDetailResponse = JournalDetailResponse;
//# sourceMappingURL=journal.types.js.map