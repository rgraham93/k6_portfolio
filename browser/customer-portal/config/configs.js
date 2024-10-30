// Example Environment Configs that could be configured to any environments, allowing the tests to be environment agnostic.
// To run locally you would set the CONFIG_ENV environment variable to be the environment you want to run the test in e.g. -e CONFIG_ENV=nonprod
export const EnvConfig = {
    nonprod: {
      BASE_URL: 'http://localhost:3333', 
      MY_FLAG: true
    },
    staging: {
      BASE_URL: 'https://pizza.qa.grafana.fun',
      MY_FLAG: true
    },
    prod: {
      BASE_URL: 'https://pizza.grafana.fun',
      MY_FLAG: false
    }
  }

// Example WorkloadConfigs that could be configured to run any type of performance testing such as load, stress, spike, soak, etc.
// To run locally you would set the WORKLOAD environment variable to be the type of testing you want e.g. -e WORKLOAD=load
export const WorkloadConfig = {
    load: {
        stages: [
            { duration: '1m', target: 10 }, // ramp-up to 10 VUs
            { duration: '5m', target: 10 }, // stay at 10 VUs for 5 minutes
            { duration: '1m', target: 50 }, // ramp-up to 50 VUs
            { duration: '5m', target: 50 }, // stay at 50 VUs for 5 minutes
            { duration: '1m', target: 0 },  // ramp-down to 0 VUs
          ],
          thresholds: {
            http_req_duration: ['p(95)<500'], // 95% of requests should complete below 500ms
          },
      },
      stress: {
        stages: [
            { duration: '1m', target: 10 }, // ramp-up to 10 VUs
            { duration: '5m', target: 10 }, // stay at 10 VUs for 5 minutes
            { duration: '1m', target: 50 }, // ramp-up to 50 VUs
            { duration: '5m', target: 50 }, // stay at 50 VUs for 5 minutes
            { duration: '1m', target: 0 },  // ramp-down to 0 VUs
          ],
          thresholds: {
            http_req_duration: ['p(95)<500'], // 95% of requests should complete below 500ms
          },
      },
      spike: {
        stages: [
            { duration: '1m', target: 10 }, // ramp-up to 10 VUs
            { duration: '5m', target: 10 }, // stay at 10 VUs for 5 minutes
            { duration: '1m', target: 50 }, // ramp-up to 50 VUs
            { duration: '5m', target: 50 }, // stay at 50 VUs for 5 minutes
            { duration: '1m', target: 0 },  // ramp-down to 0 VUs
          ],
          thresholds: {
            http_req_duration: ['p(95)<500'], // 95% of requests should complete below 500ms
          },
      }
}