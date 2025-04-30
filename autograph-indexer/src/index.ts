// src/index.ts
import { ponder } from 'ponder:registry'
import schema from 'ponder:schema'

ponder.on("Autograph:Signature", async ({ event, context }) => {
    const { signer, message, location, timestamp } = event.args
    const hash = event.transaction.hash
    const res = await context.db.insert(schema.autograph).values({
        hash,
        signer,
        message,
        location,
        timestamp
    })
}
)