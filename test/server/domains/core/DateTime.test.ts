import { DateTime } from '../../../../src/server/domains/core/DateTime';

import { UnixTimestamp } from '../../../../src/server/utils/UnixTimestamp';

describe('DateTime', () => {
	describe('create', () => {
		describe('正常系', () => {
			it('タイムスタンプ指定なし', async () => {
				const mockTime = 1588258800;
				UnixTimestamp.now = jest.fn(() => mockTime);

				const dateTime = DateTime.create();

				expect(dateTime.value).toEqual(mockTime);
			});

			it('タイムスタンプ指定あり', async () => {
				const mockTime = 1588258800;
				const dateTime = DateTime.create({ value: mockTime });

				expect(dateTime.value).toEqual(mockTime);
			});
		});
	});
});
