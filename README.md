# stanza-publishoptions

Plugin for use with https://github.com/legastero/stanza to enable publishing with options.

Usage:

```
import { createClient, JXT } from 'stanza';
import PublishWithOptionsPlugin from 'stanza-publishoptions';

const client = createClient({
    jid: '',
    password: ''
});

client.use(PublishWithOptionsPlugin);

export const NS_MY_PUBSUB = 'testnamespace';

export interface MyPubSubContent {
    itemType?: typeof NS_MY_PUBSUB;
    value: string;
}

client.stanzas.define({
    aliases: JXT.pubsubItemContentAliases(),
    element: 'stuff',
    fields: {
        value: JXT.text()
    },
    namespace: NS_MY_PUBSUB,
    type: NS_MY_PUBSUB
});
 
client.on('session:started', () => {
    client.publishWithOptions(
        'admin@localhost',
        'iqId',
        'itemId',
        'nodeNamespace',
        {
            itemType: NS_MY_PUBSUB,
            value: 'Some value'
        },
        'user',
        [{
            name: 'pubsub#access_model',
            value: 'open'
        }]
    );

});
```
