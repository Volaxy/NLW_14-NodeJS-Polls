type Message = { pollOptionId: string, votes: number };

type Subscriber = (message: Message) => void;

class VotingPubSub {
    // Toda vez que um evento acontecer no canal de id (1º parâmetro), os inscritos (2º parâmetro) vão receber alguma mensagem desse evento
    private channels: Record<string, Subscriber[]> = {};

    subscribe(pollId: string, subscriber: Subscriber) {
        if(!this.channels[pollId]) {
            this.channels[pollId] = [];
        }

        this.channels[pollId].push(subscriber);
    }

    publish(pollId: string, message: Message) {
        if(!this.channels[pollId]) {
            return;
        }

        for(const subscriber of this.channels[pollId]) {
            subscriber(message);
        }
    }
}

export const voting = new VotingPubSub();