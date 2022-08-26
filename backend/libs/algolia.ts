import algolia from "algoliasearch";
const APPID = process.env.ALGOLIA_APPID;
const APPKEY = process.env.ALGOLIA_APIKEY;
const client = algolia(APPID, APPKEY);

export const index = client.initIndex("pets");
