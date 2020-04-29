import { v4 as uuidv4 } from 'uuid';

export namespace SecureRandom {
    export function uuid(): string {
        return uuidv4();
	}

	export function number(digit: number): string {
		return [...Array(digit)].reduce((accumulator) => accumulator + `${Math.floor(Math.random() * Math.floor(9))}`, '');
	}
}
