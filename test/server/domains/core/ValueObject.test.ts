import { ValueObject } from '../../../../src/server/domains/core/ValueObject';

describe('ValueObject', () => {
	class TestValueObject extends ValueObject<{ value: string }> {}
	const valueObject1 = new TestValueObject({ value: 'Test' }, 'ValueObject');

	describe('isEqualTo', () => {
		describe('正常系', () => {
			it('props / name が一致するなら真', async () => {
				const other = new TestValueObject({ value: 'Test' }, 'ValueObject');

				expect(valueObject1.isEqualTo(other)).toBeTruthy();
			});

			it('props が一致しないなら偽', async () => {
				const other = new TestValueObject({ value: 'TesT' }, 'ValueObject');

				expect(valueObject1.isEqualTo(other)).toBeFalsy();
			});

			it('props が undefined なら偽', async () => {
				const other = new TestValueObject(undefined as any, 'ValueObject');

				expect(valueObject1.isEqualTo(other)).toBeFalsy();
			});

			it('null が渡されたなら偽', async () => {
				expect(valueObject1.isEqualTo(null)).toBeFalsy();
			});

			it('undefined が渡されたなら偽', async () => {
				expect(valueObject1.isEqualTo(undefined)).toBeFalsy();
			});

			it('name が一致しないなら偽', () => {
				const other = new TestValueObject({ value: 'Test' }, 'FakeObject');

				expect(valueObject1.isEqualTo(other)).toBeFalsy();
			});
		});
	});
});
