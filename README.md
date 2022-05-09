# terra-chain-indexer
General Indexer groups for on-chain data

# How to Start Indexing
It is (fully) recommended that this is ran on a stable cloud service provider with a full node localhost lcd endpoint enabled.
If this cannot be done, it's ok but it is necessary to use a private lcd endpoint. 

Open terminal, do `yarn` then `yarn start`. You should see a table of indexes coming up on the console every block.

The Indexer queries the latest block and all it's txs, then based on the filters you set, indexes it to the correct collection of your choosing. 
If you look at saveInColl.ts, you should see the object literal (switch) as well as the functions that utilizes different mongoose models. 
