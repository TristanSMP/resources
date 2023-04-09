// @ts-check

import { Storage } from "@google-cloud/storage";
import { execSync } from "node:child_process";
import * as fs from "node:fs";

const McMeta = {
  pack: {
    description: `§dtsmp x vane§7 - §u✎ §p${process.env.GITHUB_SHA?.slice(
      0,
      7
    )}§r`,
    pack_format: 13,
  },
};

fs.writeFileSync("src/pack.mcmeta", JSON.stringify(McMeta, null, 2));

const storage = new Storage({
  credentials: JSON.parse(
    // @ts-ignore
    Buffer.from(process.env.GCLOUD_SERVICE_KEY, "base64").toString("ascii")
  ),
});

const bucket = storage.bucket("re.tristansmp.com");

execSync("(cd src && zip -r ../resources.zip .)");

bucket.upload("resources.zip", {
  destination: "resources.zip",
});
