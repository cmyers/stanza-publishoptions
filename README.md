# stanza-publishoptions
 <a href="https://www.npmjs.com/package/stanza-publishoptions"><img src="https://img.shields.io/npm/v/stanza-publishoptions?style=plastic" /></a>

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
    client.publishWithOptions<MyPubSubContent>(
        'to@jid',
        'from@jid',
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

Sends the following XMPP query:

```
<iq xmlns="jabber:client" id="iqId" to="to@jid" from="from@jid" type="set">
 <pubsub xmlns="http://jabber.org/protocol/pubsub">
  <publish node="nodeNamespace">
   <item id="itemId">
    <stuff xmlns="testnamespace">Some value</stuff>
   </item>
  </publish>
  <publish-options>
   <x xmlns="jabber:x:data" type="submit">
    <field var="FORM_TYPE" type="hidden">
     <value>http://jabber.org/protocol/pubsub#publish-options</value>
    </field>
    <field var="pubsub#access_model">
     <value>open</value>
    </field>
   </x>
  </publish-options>
 </pubsub>
</iq>
```
