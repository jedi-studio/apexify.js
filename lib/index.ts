import axios from "axios";
import * as path from "path";
import * as fs from "fs";

const CYAN: string = "\x1b[36m";
const RESET: string = "\x1b[0m";

const packageJsonPath: string = path.resolve(process.cwd(), "package.json");
const packageJson: any = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

const getLibraryVersion = function(library: string): string {
    const dependencies: any = packageJson.dependencies || {};
    const devDependencies: any = packageJson.devDependencies || {};
    const version: string = (dependencies[library] || devDependencies[library] || "").replace(/^(\^|~)/, "") || "Not installed";
    return version;
};

axios
    .get("https://registry.npmjs.com/-/v1/search?text=apexify.js")
    .then(function(response: any) {
        const version: string = response.data.objects[0]?.package?.version;
        if (version && getLibraryVersion("apexify.js") !== version) {
            console.error(CYAN +
                "Error: Please update apexify.js to the latest version (" + version + ")." +
                RESET);
        }
    })
    .catch(function(error: any) {});


import { ApexAI, ApexChat, ApexImagine, ApexPainter } from "./utils";

export { ApexPainter, ApexAI, ApexImagine, ApexChat };
export default { ApexPainter, ApexAI, ApexImagine, ApexChat };

export async function apexAI() {
    throw new Error('This Function is deprecated. Please use ApexAI instead. Refer to the documentation for further information.')
 }