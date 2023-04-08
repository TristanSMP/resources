// @ts-ignore

import * as ActionsCore from "@actions/core";
import * as GitHub from "@actions/github";
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

const packMcMeta = JSON.stringify(McMeta, null, 2);

fs.writeFileSync("src/pack.mcmeta", packMcMeta);

const client = new GitHub.GitHub(process.env.GITHUB_TOKEN);

execSync("zip -r -q -X -9 -y -o -j src.zip src");

const upload = await client.repos.createReleaseAsset({
  owner: "tristansmp",
  repo: "resources",
  release_id: 1,
  name: "src.zip",
  data: fs.readFileSync("src.zip"),
  headers: {
    "content-type": "application/zip",
    "content-length": fs.statSync("src.zip").size,
  },
});

ActionsCore.setOutput("upload_url", upload.data.browser_download_url);
