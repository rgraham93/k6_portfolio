import http from "k6/http";
import { check } from "k6";
import { WorkloadConfig, EnvConfig } from "./config/configs.js";
import { setupOptionsAndUrls } from "../../utils/setup.js";

const optionsSetup = setupOptionsAndUrls(WorkloadConfig, EnvConfig, "generate");
export const options = {
    scenarios: {
        generateCCD: {
            exec: "generateCCD",
            executor: "ramping-vus",
            stages: optionsSetup.options.stages,
        },
    },
    tags: optionsSetup.options.tags,
};

// Read the deidentified FHIR bundle
let fhirBundle = open("./data/fhir_bundle.json");

export function generateCCD() {
    const url = `${optionsSetup.baseUrl}/GenerateCCD/Generate`;
    const payload = JSON.stringify({
        inputType: "FHIR_R4",
        data: `${fhirBundle}`,
    });
    const params = {
        headers: {
            "Content-Type": "application/json",
        },
        timeout: "600s",
    }

    const response = http.post(url, payload, params);

    // Check that the response was successful and that the CCD has expected data in the response body
    check(response, {
        "status 200 returned": (r) => r.status === 200,
        "does response body include ccdaString": (r) => r.body.includes("ccdaString")
    });
}