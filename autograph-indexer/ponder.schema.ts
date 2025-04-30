import { onchainTable } from "ponder";

export const autograph = onchainTable("autograph", (t) => ({
    hash: t.hex().primaryKey(),
    message: t.text().notNull(),
    location: t.text().notNull(),
    signer: t.text().notNull(),
    timestamp: t.bigint().notNull(),
}))