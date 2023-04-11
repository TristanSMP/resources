// @ts-check

import { Storage } from "@google-cloud/storage";
import { execSync } from "node:child_process";
import * as fs from "node:fs";

const McMeta = {
  pack: {
    description: `§dtsmp x vane\n§p${process.env.GITHUB_SHA?.slice(0, 7)}`,
    pack_format: 13,
  },
};

fs.writeFileSync("src/pack.mcmeta", JSON.stringify(McMeta, null, 2));

const Music = [
  {
    name: "coffee_shop",
    url: "https://github.com/twisttaan/TristanLofi/raw/main/coffee-shop-vibes/coffeeshop.ogg",
  },
];

for (const song of Music) {
  const { name, url } = song;
  execSync(`curl -L ${url} -o src/assets/tsmp/sounds/music/${name}.ogg`);
}

const storage = new Storage({
  credentials: JSON.parse(
    // @ts-ignore
    Buffer.from(process.env.GCLOUD_SERVICE_KEY, "base64").toString("ascii")
  ),
});

const bucket = storage.bucket("re.tristansmp.com");

execSync("(cd src && zip -r ../resources.zip .)");

const sha1 = execSync("sha1sum resources.zip").toString().split(" ")[0];

fs.writeFileSync("resources.zip.sha1", sha1);

bucket.upload("resources.zip", {
  destination: "resources.zip",
  metadata: {
    cacheControl: "no-cache",
  },
});

bucket.upload("resources.zip.sha1", {
  destination: "resources.zip.sha1",
  metadata: {
    cacheControl: "no-cache",
  },
});
