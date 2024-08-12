"use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    CreateJournalDatabaseInput: function() {
        return CreateJournalDatabaseInput;
    },
    DogOutputForDetail: function() {
        return DogOutputForDetail;
    },
    JournalDetailResponse: function() {
        return JournalDetailResponse;
    },
    JournalListResponse: function() {
        return JournalListResponse;
    },
    JournalOutputForDetail: function() {
        return JournalOutputForDetail;
    }
});
let CreateJournalDatabaseInput = class CreateJournalDatabaseInput {
    static getKeysForJournalRequest() {
        return [
            'distance',
            'calories',
            'startedAt',
            'duration'
        ];
    }
};
let JournalListResponse = class JournalListResponse {
    static getKeysForJournalListRaw() {
        return [
            'journalId',
            'startedAt',
            'distance',
            'calories',
            'duration',
            'journalCnt'
        ];
    }
};
let DogOutputForDetail = class DogOutputForDetail {
    static getFieldForDogTable() {
        return [
            'id',
            'name',
            'profilePhotoUrl'
        ];
    }
};
let JournalOutputForDetail = class JournalOutputForDetail {
    static getFieldForJournalTable() {
        return [
            'id',
            'routes',
            'memo',
            'journalPhotos',
            'excrementCount'
        ];
    }
};
let JournalDetailResponse = class JournalDetailResponse {
    constructor(journalInfo, dogInfo){
        this.journalInfo = journalInfo;
        this.dogs = dogInfo;
    }
};

//# sourceMappingURL=journal.types.js.map