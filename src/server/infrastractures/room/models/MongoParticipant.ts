
import { User as Participant, UserEntity as ParticipantEntity } from '@server/domains/user/User';

export interface MongoParticipant {
    readonly id: string;
	readonly name: string;
}

export namespace MongoParticipant {
    export function toParticipant(mongoParticipant: MongoParticipant): Participant {
        return Participant.create({
			name: mongoParticipant.name,
		}, mongoParticipant.id);
    }

    export function fromParticipant(player: ParticipantEntity): MongoParticipant {
        return {
			id: player.id.value,
			name: player.name.value,
        };
    }
}
