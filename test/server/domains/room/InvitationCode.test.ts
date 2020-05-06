import { InvitationCode } from '../../../../src/server/domains/room/InvitationCode';

describe('InvitationCode', () => {
	describe('create', () => {
		it('正常系', async () => {
			const value = '123456';
			const invitationCode = InvitationCode.create({ value });

			expect(invitationCode.value).toEqual(value);
		});

		describe('異常系', () => {
			it('招待コードが6文字未満の場合エラー', async () => {
				const value = '12345';

				await expect(async () => InvitationCode.create({ value })).rejects.toThrowError();
			});
		});

		it('招待コードに数字以外の文字列が含まれる場合エラー', async () => {
			const value = 'a23456';

			await expect(async () => InvitationCode.create({ value })).rejects.toThrowError();
		});
	});
});
