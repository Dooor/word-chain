import { v4 as uuidv4 } from 'uuid';

export namespace SecureRandom {
    export function uuid(): string {
        return uuidv4();
	}

	export function number(digit: number): string {
		const randomNumber = (): number => Math.floor(Math.random() * Math.floor(9));
		return [...Array(digit)].reduce((accumulator) => accumulator + `${randomNumber()}`, '');
	}
}
