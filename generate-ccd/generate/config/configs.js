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

export const WorkloadConfig = {
    nonprod: {
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
      staging: {
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
      prod: {
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