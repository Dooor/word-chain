import { Entity } from '../../../../src/server/domains/core/Entity';
import { SecureRandom } from '../../../../src/server/utils/SecureRandom';

describe('Entity', () => {
	class TestEntity extends Entity<{ value: string }> {}
	const testEntity = new TestEntity({ value: 'Test' });

	describe('isEqualTo', () => {
		describe('正常系', () => {
			it('同じ Entity が与えられたなら真', async () => {
				expect(testEntity.isEqualTo(testEntity)).toBeTruthy();
			});

			it('EntityのIDが一致するなら真', async () => {
				const other = new TestEntity({ value: 'Test' }, testEntity.id);

				expect(testEntity.isEqualTo(other)).toBeTruthy();
			});

			it('与えられた値が null なら偽', async () => {
				expect(testEntity.isEqualTo(null)).toBeFalsy();
			});

			it('与えられた値が undefined なら偽', async () => {
				expect(testEntity.isEqualTo(undefined)).toBeFalsy();
			});

			it('与えられた値が Entity ではないなら偽', async () => {
				expect(testEntity.isEqualTo({ value: 'Test', id: SecureRandom.uuid() } as any)).toBeFalsy();
			});
		});
	});
});
