import { UniqueEntityID } from '../../../../src/server/domains/core/UniqueEntityID';

import { SecureRandom } from '../../../../src/server/utils/SecureRandom';

import validator from 'validator';

describe('UniqueEntityID', () => {
	describe('create', () => {
		describe('正常系', () => {
			it('ID指定なし', async () => {
				const entityId = UniqueEntityID.create();

				expect(validator.isUUID(entityId.value)).toBeTruthy();
			});

			it('ID指定あり', async () => {
				const id = SecureRandom.uuid();
				const entityId = UniqueEntityID.create({ value: id });

				expect(validator.isUUID(entityId.value)).toBeTruthy();
				expect(entityId.value).toEqual(id);
			});
		});

		describe('異常系', () => {
			it('IDが不正な値の場合エラー', async () => {
				const fakeId = 'xxx-fake-id';

				await expect(async () => UniqueEntityID.create({ value: fakeId })).rejects.toThrowError();
			});
		});
	});
});
