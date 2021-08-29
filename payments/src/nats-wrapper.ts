import nats, {Stan} from "node-nats-streaming";

class NatsWrapper {
    get client(): Stan {
        if (!this._client)
            throw new Error('Cannot access NATS client before connecting')
        return this._client;
    }

    private _client?: Stan

    connect(
        clusterId: string,
        clientId: string,
        url: string
    ) {
        this._client = nats.connect(clusterId, clientId, {url})
        return new Promise<void>((resolve, reject) => {
            this.client!.on('connect', () => {
                console.log("Connected to NATS")
                resolve()
            })
            this.client!.on('error', (err) => {
                reject(err)
            })
        })
    }
}

export const natsWrapper = new NatsWrapper()
