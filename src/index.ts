import { Agent } from 'stanza';
import { DataFormFieldType, IQType } from 'stanza/Constants';
import { DataFormField, IQ, PubsubItemContent } from 'stanza/protocol';

declare module 'stanza' {
    export interface Agent {
        publishWithOptions<T extends PubsubItemContent = PubsubItemContent>(
            from: string,
            iqId: string,
            itemId: string,
            publishNode: string,
            itemType: T,
            context: 'owner' | 'user',
            publishOptions: Array<DataFormField>,
        ): Promise<IQ>;
    }
}

export default function (client: Agent): void {
    client.publishWithOptions = <T extends PubsubItemContent = PubsubItemContent>(
        from: string,
        iqId: string,
        itemId: string,
        publishNode: string,
        item: T,
        context: 'owner' | 'user',
        publishOptions: Array<DataFormField>
    ) => {
        return client.sendIQ({
            id: iqId,
            from,
            pubsub: {
                context,
                publish: {
                    item: {
                        content: item,
                        id: itemId
                    },
                    node: publishNode
                },
                publishOptions: {
                    type: 'submit',
                    fields: [
                        {
                            name: 'FORM_TYPE',
                            value: 'http://jabber.org/protocol/pubsub#publish-options',
                            type: DataFormFieldType.Hidden
                        },
                        ...publishOptions
                    ]
                }
            },
            type: IQType.Set
        });
    };
}