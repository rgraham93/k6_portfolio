import { browser } from "k6/browser";
import { check } from "https://jslib.k6.io/k6-utils/1.5.0/index.js";
import { open } from "k6/experimental/fs";
import { LoginPage } from "./pages/login-page.js";
import { RequestsPage } from "./pages/requests-page.js";
import { getSecret, setupOptionsAndUrls } from "../../utils/setup.js";
import { WorkloadConfig, EnvConfig } from "./config/configs.js";
import { readAll } from "../../utils/file-buffer.js";
import { formatDateToMMDDYYYY } from "../../utils/date-helpers.js";

// Test options would be set up here by referencing the WorkloadConfig and EnvConfig data 
const optionsSetup = setupOptionsAndUrls(
  WorkloadConfig,
  EnvConfig,
  "create-request"
);

export const options = {
  scenarios: {
    browser: {
      exec: "createCustomerRequest",
      executor: "ramping-vus",
      stages: optionsSetup.options.stages,
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
  tags: optionsSetup.options.tags,
};

// The getSecret is a function that retrieves a username and password from AWS Secrets to be used to log into the application
export function setup() {
  const secrets = getSecret(
    optionsSetup.testSecretName,
    optionsSetup.awsWebIdentityToken
  );

  const appUser = secrets["user"];
  const appPass = secrets["password"];

  return { appUser, appPass };
}

// Declare the location of the file on the local filesystem
let file;
(async function () {
  file = await open("./data/TomSawyer.pdf");
})();

// Get the current date in MM/DD/YYYY format to be used throughout the test
let currentDate = new Date();
const formattedCurrentDate = formatDateToMMDDYYYY(currentDate);

export async function createCustomerRequest(data) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  const requestsPage = new RequestsPage(page);
  // Read the whole file content into a buffer
  const fileContent = await readAll(file);

  try {
    // Login
    await loginPage.goto(optionsSetup.baseUrl);
    await loginPage.login(page, data);

    // Add a new request
    await requestsPage.clickNewRequestButton();
    await requestsPage.clickAddRequestButton();

    // Look up customer
    await requestsPage.customerLookup("sawyer");
    await requestsPage.enterCustomerId("1234567890");

    // Look up location
    await requestsPage.locationLookup("location");

    // Fill in request data
    await requestsPage.selectUseCase();
    await requestsPage.enterServiceDates("10", "1", "2021", "10", "14", "2021");
    await requestsPage.enterReceivedDate(formattedCurrentDate);
    await requestsPage.uploadSupportingDocument(
      "TomSawyer.pdf",
      "application/pdf",
      fileContent
    );
    await requestsPage.selectLocation();
    await requestsPage.selectProcessingMethod();
    await requestsPage.enterEmailRecipient("testing@appservice.com");

    // Save the draft request and wait for the page to load
    await requestsPage.saveDraftButton.click();
    await requestsPage.draftRequestCustomerLastName.waitFor();

    // Check that the draft request was saved
    const lastName =
      await requestsPage.draftRequestCustomerLastName.textContent();
    const lastNameOK = await lastName.includes("Sawyer");
    await check(lastNameOK, { "Draft request was saved": lastNameOK });

    // Log the request
    await requestsPage.checkLogRequestCheckbox();
    await requestsPage.logRequest();

    // Check that the request was logged successfully
    const successMessage = await requestsPage.logRequestSuccessMessage;
    await successMessage.waitFor();
    const successMessageOK = await successMessage.isVisible();
    await check(successMessageOK, {
      "Request logged successfully": successMessageOK,
    });
  } finally {
    await page.close();
  }
}